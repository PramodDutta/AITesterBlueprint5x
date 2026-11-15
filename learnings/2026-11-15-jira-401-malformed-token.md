# Jira 401 from a malformed API token in .env

**Problem:** A new Jira Test Plan app got HTTP 401 from Jira Cloud with credentials from the repo `.env`, even though the email and URL looked right.

## Approach
1. Confirm the failure is auth and not the URL. `/rest/api/3/serverInfo` returned 200 while `/myself` returned 401 with header `x-seraph-loginreason: AUTHENTICATED_FAILED`. So the host is fine and the credential pair is rejected.
2. Inspect the secret's shape without printing it: length, whitespace, quotes, and the first 4 chars masked. The token was 193 chars and started `_ATA`. Atlassian API tokens start `ATATT` and are 192 chars, so a stray leading `_` was likely.
3. Test the hypothesis read-only: strip the first char in memory and call `GET /myself`. It returned 200. Root cause confirmed.
4. Keep working without touching the file: start the server with `JIRA_TOKEN="$(grep ... | sed 's/^_//')" npm start`. Node's `process.loadEnvFile` does not override variables already set in the shell, so the shell value wins.
5. Same session, second issue: Groq "connected" but the default model `llama-3.3-70b-versatile` was not on the key. Listing `GET /openai/v1/models` showed what exists, and the default became `openai/gpt-oss-120b`.

## Judgment calls
- Did NOT edit the user's `.env`. It is their secret file and was open in their IDE. I reported the one-char fix instead.
- Did NOT print the token or email anywhere. I only looked at masked prefixes and lengths.
- Did NOT assume the code was wrong (v2 vs v3, header format). The serverInfo/myself split ruled that out first.
- Did NOT hardcode a model from memory. I checked the provider's model list first.

## Reusable rule
When valid-looking credentials get a 401, check the secret's shape (length, prefix, stray chars) against the provider's known token format before you debug the code. Then confirm with one read-only call.
