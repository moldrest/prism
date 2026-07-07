/**
 * Production server for the built site. Wraps the TanStack Start handler
 * with static file serving and a native webhook endpoint.
 */
import handler from "./dist/server/server.js";

const PORT = 3000;
const HOST = "0.0.0.0";
const CLIENT_DIR = `${import.meta.dir}/dist/client`;

const freePort =
  `for _ in $(seq 1 25); do ` +
  `pids=$(lsof -t -iTCP:${String(PORT)} -sTCP:LISTEN 2>/dev/null || true); ` +
  `if [ -z "$pids" ]; then exit 0; fi; ` +
  `kill $pids 2>/dev/null || true; sleep 0.2; ` +
  `done`;

/** GET /api/webhook — health check / config status */
function statusResponse(): Response {
  const missing: string[] = [];
  if (!process.env.GITHUB_TOKEN) missing.push("GITHUB_TOKEN");
  if (!process.env.OPENAI_API_KEY) missing.push("OPENAI_API_KEY");
  return new Response(
    JSON.stringify({
      status: "ok",
      configured: {
        github: !!process.env.GITHUB_TOKEN,
        llm: !!process.env.OPENAI_API_KEY,
      },
      message:
        missing.length > 0
          ? `Prism is not fully configured. Missing: ${missing.join(", ")}`
          : "Prism is fully configured and ready to review PRs.",
      endpoints: {
        webhook: "POST /api/webhook",
        health: "GET /api/webhook",
      },
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

/** POST /api/webhook — receive GitHub pull_request events */
async function handleWebhook(request: Request): Promise<Response> {
  // Verify webhook secret if configured
  const signature = request.headers.get("x-hub-signature-256");
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (secret && signature) {
    const raw = await request.clone().text();
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(raw));
    const hex = Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
    if (hex !== signature.replace("sha256=", "")) {
      return new Response("Invalid signature", { status: 401 });
    }
  }

  const event = request.headers.get("x-github-event");
  if (event !== "pull_request") {
    return new Response("Ignored", { status: 200 });
  }

  let body: Record<string, unknown>;
  try { body = (await request.json()) as Record<string, unknown>; }
  catch { return new Response("Invalid JSON", { status: 400 }); }

  const action = body.action as string;
  if (action !== "opened" && action !== "synchronize") {
    return new Response(`Ignored: ${action}`, { status: 200 });
  }

  const pr = body.pull_request as Record<string, unknown> | undefined;
  const repo = body.repository as Record<string, unknown> | undefined;
  if (!pr || !repo) return new Response("Missing payload", { status: 400 });

  const fullName = (repo.full_name as string) || "";
  const [owner, repoName] = fullName.split("/");
  const prNumber = pr.number as number;
  if (!owner || !repoName || !prNumber) return new Response("Invalid info", { status: 400 });

  if (!process.env.GITHUB_TOKEN || !process.env.OPENAI_API_KEY) {
    const m: string[] = [];
    if (!process.env.GITHUB_TOKEN) m.push("GITHUB_TOKEN");
    if (!process.env.OPENAI_API_KEY) m.push("OPENAI_API_KEY");
    return new Response(JSON.stringify({ error: `Missing: ${m.join(", ")}` }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Fire and forget — respond immediately
  runReview(owner, repoName, prNumber).catch((err) =>
    console.error(`prism: review error ${owner}/${repoName}#${prNumber}:`, err)
  );

  return new Response(JSON.stringify({ status: "queued", pr: `${fullName}#${prNumber}` }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/** Run a full PR review: fetch diff → LLM analyze → post comments */
async function runReview(owner: string, repo: string, prNumber: number) {
  const GITHUB_API = "https://api.github.com";
  const ghToken = process.env.GITHUB_TOKEN!;
  const gh = (accept: string) => ({
    Authorization: `Bearer ${ghToken}`,
    "User-Agent": "prism-code-review",
    Accept: accept,
  });

  // 1. Fetch PR info
  const prRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}`, {
    headers: gh("application/vnd.github.v3+json"),
  });
  if (!prRes.ok) throw new Error(`GitHub ${prRes.status} fetching PR`);
  const prData = (await prRes.json()) as { head: { sha: string }; title: string };
  const headSha = prData.head.sha;

  // 2. Fetch diff
  const diffRes = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}`, {
    headers: gh("application/vnd.github.v3.diff"),
  });
  if (!diffRes.ok) throw new Error(`GitHub ${diffRes.status} fetching diff`);
  const diff = await diffRes.text();

  // 3. Parse diff into per-file chunks
  const fileDiffs = new Map<string, string>();
  let currentFile = "";
  const lines: string[] = [];
  for (const line of diff.split("\n")) {
    if (line.startsWith("diff --git")) {
      if (currentFile && lines.length > 0) fileDiffs.set(currentFile, lines.join("\n"));
      currentFile = "";
      lines.length = 0;
    } else if (line.startsWith("+++ b/")) {
      currentFile = line.slice(6);
      lines.push(line);
    } else {
      lines.push(line);
    }
  }
  if (currentFile && lines.length > 0) fileDiffs.set(currentFile, lines.join("\n"));

  // 4. Analyze each file with LLM
  const SYSTEM_PROMPT = `You are a senior engineer reviewing a PR diff. For each issue, return JSON with: severity ("error"|"warning"|"suggestion"), category ("bug"|"security"|"style"|"architecture"|"performance"), message (short title), explanation (why it matters + how to fix). Return ONLY valid JSON array.`;

  type Issue = { path: string; line: number; severity: string; category: string; message: string; explanation: string };
  const allIssues: Issue[] = [];

  for (const [fileName, fileDiff] of fileDiffs) {
    if (fileDiff.length > 10000) continue;
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: `Review this diff for "${fileName}":\n\`\`\`diff\n${fileDiff.slice(0, 8000)}\n\`\`\`` },
          ],
          temperature: 0.1,
          max_tokens: 2000,
        }),
      });
      if (!res.ok) continue;
      const data = (await res.json()) as { choices: { message: { content: string } }[] };
      const content = data.choices?.[0]?.message?.content;
      if (!content) continue;
      const json = content.replace(/^```(?:json)?\s*|```$/gi, "").trim();
      const issues = JSON.parse(json) as Issue[];
      allIssues.push(...issues.map((i) => ({ ...i, path: fileName })));
    } catch { /* skip file on error */ }
    await new Promise((r) => setTimeout(r, 200));
  }

  // 5. Build and post review
  const errors = allIssues.filter((i) => i.severity === "error");
  const warnings = allIssues.filter((i) => i.severity === "warning");
  const suggestions = allIssues.filter((i) => i.severity === "suggestion");

  if (allIssues.length === 0) {
    await fetch(`${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}/reviews`, {
      method: "POST",
      headers: { ...gh("application/vnd.github.v3+json"), "Content-Type": "application/json" },
      body: JSON.stringify({
        commit_id: headSha,
        body: "## ✅ Prism Review — No issues found\n\nThis PR looks clean! No bugs, security issues, or style concerns detected. Nice work!",
        event: "COMMENT",
        comments: [],
      }),
    });
    return;
  }

  let summary = `## ${errors.length > 0 ? "🔴" : "🟡"} Prism Review — ${allIssues.length} issue${allIssues.length > 1 ? "s" : ""} found\n\n`;
  summary += [`**${errors.length} error${errors.length !== 1 ? "s" : ""}**`, `**${warnings.length} warning${warnings.length !== 1 ? "s" : ""}**`, `**${suggestions.length} suggestion${suggestions.length !== 1 ? "s" : ""}**`].join(" · ");
  summary += `\n\n| # | File | Severity | Category | Issue |\n|---|---|---|---|---|\n`;
  allIssues.forEach((issue, i) => {
    const e = issue.severity === "error" ? "🔴" : issue.severity === "warning" ? "🟡" : "💡";
    summary += `| ${i + 1} | \`${issue.path}:${issue.line}\` | ${e} ${issue.severity} | ${issue.category} | ${issue.message} |\n`;
  });
  summary += `\n---\n*Review by Prism AI — always double-check critical findings.*`;

  const comments = allIssues.slice(0, 20).map((issue) => ({
    path: issue.path,
    line: issue.line,
    body: `**${issue.severity.toUpperCase()}** — ${issue.category}\n\n${issue.message}\n\n${issue.explanation}`,
  }));

  await fetch(`${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}/reviews`, {
    method: "POST",
    headers: { ...gh("application/vnd.github.v3+json"), "Content-Type": "application/json" },
    body: JSON.stringify({
      commit_id: headSha,
      body: summary,
      event: errors.length > 0 ? "REQUEST_CHANGES" : "COMMENT",
      comments,
    }),
  });
}

// ---- Bootstrap ----
for (let attempt = 1; ; attempt++) {
  await Bun.$`sudo sh -c ${freePort}`.quiet().nothrow();
  try {
    Bun.serve({
      port: PORT,
      hostname: HOST,
      async fetch(req) {
        const url = new URL(req.url);

        if (url.pathname === "/api/webhook") {
          if (req.method === "GET") return statusResponse();
          if (req.method === "POST") return handleWebhook(req);
          return new Response("Method not allowed", { status: 405 });
        }

        if (url.pathname !== "/") {
          const file = Bun.file(CLIENT_DIR + url.pathname);
          if (await file.exists()) return new Response(file);
        }

        return (handler as { fetch: (r: Request) => Response | Promise<Response> }).fetch(req);
      },
    });
    break;
  } catch (err) {
    if (attempt >= 10) throw err;
    await Bun.sleep(200);
  }
}

console.log(`team-site serving on http://${HOST}:${String(PORT)}`);
