/**
 * GitHub API client — fetches PR diffs and posts reviews.
 *
 * Requires one of:
 *   - GITHUB_TOKEN (personal access token with repo scope)
 *   - GITHUB_APP_ID + GITHUB_APP_PRIVATE_KEY + GITHUB_INSTALLATION_ID (GitHub App)
 */

const GITHUB_API = "https://api.github.com";

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3.diff",
    "User-Agent": "prism-code-review",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

function getJsonHeaders(): Record<string, string> {
  return {
    ...getHeaders(),
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
  };
}

export interface PRInfo {
  owner: string;
  repo: string;
  prNumber: number;
  headSha: string;
  baseSha: string;
  title: string;
}

/**
 * Fetch the unified diff for a pull request.
 */
export async function fetchPRDiff(pr: PRInfo): Promise<string> {
  const url = `${GITHUB_API}/repos/${pr.owner}/${pr.repo}/pulls/${pr.prNumber}`;
  const res = await fetch(url, { headers: getHeaders() });

  if (!res.ok) {
    throw new Error(
      `GitHub API error fetching PR diff: ${res.status} ${res.statusText}`
    );
  }

  return res.text();
}

/**
 * Fetch PR metadata (title, base ref, etc).
 */
export async function fetchPRInfo(
  owner: string,
  repo: string,
  prNumber: number
): Promise<PRInfo> {
  const url = `${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}`;
  const res = await fetch(url, { headers: getJsonHeaders() });

  if (!res.ok) {
    throw new Error(
      `GitHub API error fetching PR info: ${res.status} ${res.statusText}`
    );
  }

  const data = (await res.json()) as {
    head: { sha: string };
    base: { sha: string };
    title: string;
  };

  return {
    owner,
    repo,
    prNumber,
    headSha: data.head.sha,
    baseSha: data.base.sha,
    title: data.title,
  };
}

export interface ReviewComment {
  path: string;
  line: number;
  body: string;
  side?: "LEFT" | "RIGHT";
}

export interface ReviewPayload {
  body: string;
  event: "COMMENT" | "APPROVE" | "REQUEST_CHANGES";
  comments: ReviewComment[];
}

/**
 * Post a PR review with line-level comments.
 */
export async function postReview(
  pr: PRInfo,
  payload: ReviewPayload
): Promise<void> {
  const url = `${GITHUB_API}/repos/${pr.owner}/${pr.repo}/pulls/${pr.prNumber}/reviews`;
  const res = await fetch(url, {
    method: "POST",
    headers: getJsonHeaders(),
    body: JSON.stringify({
      commit_id: pr.headSha,
      body: payload.body,
      event: payload.event,
      comments: payload.comments,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `GitHub API error posting review: ${res.status} ${res.statusText} — ${text}`
    );
  }
}

/**
 * Post a standalone PR comment (not as part of a review).
 */
export async function postPRComment(
  pr: PRInfo,
  body: string
): Promise<void> {
  const url = `${GITHUB_API}/repos/${pr.owner}/${pr.repo}/issues/${pr.prNumber}/comments`;
  const res = await fetch(url, {
    method: "POST",
    headers: getJsonHeaders(),
    body: JSON.stringify({ body }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `GitHub API error posting comment: ${res.status} ${res.statusText} — ${text}`
    );
  }
}

/**
 * Check that GitHub credentials are configured.
 */
export function isGitHubConfigured(): boolean {
  return !!process.env.GITHUB_TOKEN;
}