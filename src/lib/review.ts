/**
 * Code review engine — sends diffs to an LLM and parses the response.
 *
 * Requires OPENAI_API_KEY environment variable.
 */

export interface ReviewIssue {
  path: string;
  line: number;
  severity: "error" | "warning" | "suggestion";
  category: "bug" | "security" | "style" | "architecture" | "performance";
  message: string;
  explanation: string;
}

export interface ReviewResult {
  summary: string;
  event: "COMMENT" | "REQUEST_CHANGES";
  issues: ReviewIssue[];
}

const REVIEW_SYSTEM_PROMPT = `You are a senior software engineer performing a thorough code review on a pull request diff.

Analyze each file's changes and identify:

1. **Bugs & Logic Errors** — null pointer risks, race conditions, off-by-one errors, incorrect assumptions, missing edge cases
2. **Security Vulnerabilities** — injection risks, hardcoded secrets, unsafe deserialization, missing input validation, authorization issues
3. **Style Violations** — naming convention breaks, inconsistent formatting, deprecated patterns, deviation from common best practices
4. **Architectural Improvements** — overly complex functions, poor abstractions, tight coupling, missing error handling, violation of separation of concerns
5. **Performance Concerns** — unnecessary allocations, N+1 queries, inefficient algorithms, missing memoization

For each issue found, provide:
- The file path and line number
- Severity: "error" (definitely needs fixing), "warning" (should fix), "suggestion" (nice to have)
- Category from the list above
- A clear, concise message describing the issue
- A brief explanation of why it matters and how to fix it

If no significant issues are found, return an empty issues array with a positive summary.

Respond in JSON format ONLY, with this exact structure:
{
  "summary": "Overall review summary (2-3 sentences)",
  "event": "COMMENT" or "REQUEST_CHANGES",
  "issues": [
    {
      "path": "src/file.ts",
      "line": 42,
      "severity": "error" | "warning" | "suggestion",
      "category": "bug" | "security" | "style" | "architecture" | "performance",
      "message": "Short issue title",
      "explanation": "Explanation of why it matters and how to fix"
    }
  ]
}`;

/**
 * Send a diff to the LLM for analysis and parse the structured result.
 */
export async function analyzeDiff(
  diff: string,
  fileName: string
): Promise<ReviewIssue[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set — configure it to enable code reviews."
    );
  }

  const userMessage = `Review this diff for file "${fileName}":\n\n\`\`\`diff\n${diff.slice(0, 8000)}\n\`\`\``;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: REVIEW_SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`LLM API error: ${res.status} ${res.statusText} — ${text}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    return [];
  }

  // Parse the JSON response, handling potential markdown fences
  const jsonStr = content
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(jsonStr) as {
      issues?: ReviewIssue[];
    };
    return parsed.issues ?? [];
  } catch {
    // If JSON parsing fails, return empty — the error is handled gracefully
    return [];
  }
}

/**
 * Parse a unified diff into per-file changes.
 * Returns a map of filename -> diff content.
 */
export function parseDiff(diff: string): Map<string, string> {
  const files = new Map<string, string>();
  let currentFile = "";
  let currentLines: string[] = [];

  for (const line of diff.split("\n")) {
    if (line.startsWith("diff --git")) {
      if (currentFile && currentLines.length > 0) {
        files.set(currentFile, currentLines.join("\n"));
      }
      currentFile = "";
      currentLines = [];
    } else if (line.startsWith("--- a/") || line.startsWith("+++ b/")) {
      if (line.startsWith("+++ b/")) {
        currentFile = line.slice(6);
      }
      currentLines.push(line);
    } else {
      currentLines.push(line);
    }
  }

  // Last file
  if (currentFile && currentLines.length > 0) {
    files.set(currentFile, currentLines.join("\n"));
  }

  return files;
}

/**
 * Check that the LLM is configured.
 */
export function isLLMConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

export function getConfiguredEnv(): {
  github: boolean;
  llm: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  if (!process.env.GITHUB_TOKEN) missing.push("GITHUB_TOKEN");
  if (!process.env.OPENAI_API_KEY) missing.push("OPENAI_API_KEY");

  return {
    github: !!process.env.GITHUB_TOKEN,
    llm: !!process.env.OPENAI_API_KEY,
    missing,
  };
}