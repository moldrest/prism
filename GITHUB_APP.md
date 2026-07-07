# Prism GitHub App Setup

This document describes how to register Prism as a GitHub App so it can receive webhook events and post reviews on pull requests.

## Prerequisites

- A GitHub account (personal or organization)
- Admin access to the repositories where Prism will be installed

## Step 1: Create the GitHub App

1. Go to **Settings → Developer settings → GitHub Apps → New GitHub App** (https://github.com/settings/apps/new)
2. Fill in the following:

| Field | Value |
|---|---|
| **GitHub App name** | `prism-code-review` (or your preferred name) |
| **Homepage URL** | `https://prism.dev` (or your actual domain) |
| **Webhook URL** | `https://<your-domain>/api/webhook` |
| **Webhook secret** | Generate a random string (used as `GITHUB_WEBHOOK_SECRET`) |
| **Permissions** | See table below |
| **Subscribe to events** | `Pull requests` |

## Step 2: Required Permissions

| Permission | Access | Why |
|---|---|---|
| **Pull requests** | Read & Write | Read PR diffs; post reviews and comments |
| **Checks** | Read & Write | Create check runs on PRs (future) |
| **Contents** | Read | Read repository contents for context |
| **Metadata** | Read (automatic) | Access repository metadata |

These permissions are the **minimum required** for Prism to function. No write access to code is needed — Prism only reads diffs and writes review comments.

## Step 3: Subscribe to Events

Prism needs to receive the following webhook events:

- **Pull requests** — Required. Listens for `opened` and `synchronize` actions to trigger reviews.

> Note: When a PR is updated with new commits (`synchronize`), Prism automatically re-reviews the changes.

## Step 4: Install the App

1. After creating the app, generate a **private key** (download the `.pem` file) on the app's settings page
2. Note the **App ID** shown at the top of the page
3. Install the app on your repository:
   - Go to your app's page (e.g., `https://github.com/apps/prism-code-review`)
   - Click **Install** and select the repositories
   - Or use the **Install App** option in the GitHub App settings page

## Step 5: Configure Environment Variables

Once the app is created and installed, configure Prism with these environment variables:

### Option A: GitHub App (recommended for production)

```bash
GITHUB_APP_ID=123456                    # Your GitHub App ID
GITHUB_APP_PRIVATE_KEY="-----BEGIN..."  # Contents of the .pem file
GITHUB_INSTALLATION_ID=987654           # Installation ID (from the app's install URL)
GITHUB_WEBHOOK_SECRET="your-secret"     # The webhook secret you configured
OPENAI_API_KEY="sk-..."                 # OpenAI API key for reviews
```

### Option B: Personal Access Token (simpler for development)

```bash
GITHUB_TOKEN="github_pat_..."           # Fine-grained PAT with repo permissions
OPENAI_API_KEY="sk-..."                 # OpenAI API key for reviews
GITHUB_WEBHOOK_SECRET="your-secret"     # Optional: webhook signature verification
```

> A fine-grained personal access token is easier to set up for development and testing. For production, a GitHub App is recommended.

## Webhook Endpoint

The webhook endpoint is:

```
POST /api/webhook
```

- **Method:** POST
- **Content-Type:** `application/json`
- **Headers:** `X-GitHub-Event`, `X-Hub-Signature-256` (if secret configured)

### Health Check

```
GET /api/webhook
```

Returns the configuration status and whether the required API keys are set.

## Response Format

When a valid `pull_request` event with `opened` or `synchronize` action is received, Prism:

1. Responds immediately with `{"status": "queued", "pr": "owner/repo#123"}`
2. Processes the review asynchronously:
   - Fetches the PR diff from GitHub's API
   - Parses the diff into per-file changes
   - Sends each file's diff to OpenAI (GPT-4o-mini) for analysis
   - Posts a review with line-level comments and a summary

## Rate Limiting

- **GitHub API:** 5,000 requests/hour for authenticated requests. Prism makes ~2 requests per PR (info + diff) plus 1 per review post.
- **OpenAI API:** Varies by tier. Prism makes ~1 request per changed file with a 200ms delay between them.
- **Webhook retry:** GitHub retries failed webhook deliveries up to 3 times. Prism returns 200 immediately and processes asynchronously, so retries shouldn't trigger duplicate reviews in normal operation.

## Testing the Webhook

You can test the webhook with curl:

```bash
# Health check
curl https://<your-domain>/api/webhook

# Simulate a PR event
curl -X POST https://<your-domain>/api/webhook \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: pull_request" \
  -d '{
    "action": "opened",
    "pull_request": {"number": 1, "head": {"sha": "abc123"}},
    "repository": {"full_name": "owner/repo"}
  }'
```

## Troubleshooting

| Symptom | Likely Cause | Solution |
|---|---|---|
| `"Missing: GITHUB_TOKEN, OPENAI_API_KEY"` | Environment variables not set | Add `GITHUB_TOKEN` and `OPENAI_API_KEY` |
| Webhook returns 401 | Invalid signature | Check `GITHUB_WEBHOOK_SECRET` matches GitHub App settings |
| No review posted | GitHub token lacks permissions | Check token has `repo` or `pull_requests:write` scope |
| Review fails silently | Server error | Check server logs for error messages |
| 404 on webhook URL | Wrong URL configured | Verify the webhook URL matches the deployed endpoint |
