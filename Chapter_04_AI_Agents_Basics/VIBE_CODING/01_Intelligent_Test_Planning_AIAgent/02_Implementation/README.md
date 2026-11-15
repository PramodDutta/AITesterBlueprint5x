# Jira Test Plan Generator

Enter a Jira issue ID, the backend reads the issue from Jira (read-only), an LLM fills in the test plan template, and the plan is shown in the browser.

**Live:** https://ai5x-testplanaigent.vercel.app

```
02_Implementation/
├── api/index.js            Vercel serverless entry (wraps the Express app)
├── src/
│   ├── backend/            Express API: config, Jira client, LLM client, prompt, tests
│   │   └── TestPlan_Template.md   bundled copy of ../01_plan template (for Vercel)
│   └── frontend/           React UI (Main page + Settings)
├── scripts/sync-template.js
├── vite.config.js
├── vercel.json
├── package.json
├── .env.example
└── README.md
```

## Prerequisites

- Node.js 22+
- A Jira Cloud site (`*.atlassian.net`) and API token
- An LLM: a Groq API key, or Ollama (local runs only, or a public Ollama URL)

## Run locally

```bash
cd 02_Implementation
npm install
npm start          # http://localhost:3000 (API + React on one port)
npm test           # mocked backend tests (no real credentials loaded)
```

## Configuration

Settings come from two places, per request:

1. **Server defaults.** Locally: the nearest `.env` walking up from `02_Implementation` (the repo-root `.env`), or `ENV_FILE=/path`. On Vercel: project environment variables.
2. **User settings in the browser.** Settings page fields, or **Load from .env file** (paste or choose a file). The file is parsed in the browser, held in memory for that tab only (never in browser storage), and sent with each request. Blank fields use the server defaults.

Rules: the server's Jira token is only ever used with the server's own Jira URL and email. To use another Jira, enter URL, email and token together. Jira URLs must be `https://<site>.atlassian.net`.

| Variable | Default |
|---|---|
| `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_TOKEN` | none |
| `GROQ_API_KEY` | none |
| `GROQ_MODEL` | `openai/gpt-oss-120b` |
| `OLLAMA_URL` / `OLLAMA_MODEL` | `http://localhost:11434` / `llama3.1` |
| `LLM_PROVIDER` | `groq` if a Groq key is set, else `ollama` |

The API never returns secrets; `/api/settings` shows only masked hints (`t***@gmail.com`) and whether a token is set.

## Deploy (Vercel)

Project `ai5x-testplanaigent` is linked in `.vercel/`. Server defaults are Vercel production env vars (`JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_TOKEN`, `GROQ_API_KEY`; token and key marked sensitive).

```bash
npm run deploy     # copies ../01_plan template into src/backend, then vercel deploy --prod
```

Change a default with `vercel env rm NAME production` + `vercel env add NAME production`, then redeploy.

## Usage

1. **Settings** (optional): load a `.env` or fill the fields, then **Test Connection** / **Test Groq.com** / **Test Local LLM**.
2. **Main page**: type a Jira issue ID (e.g. `QA-123`) and press **Generate**. The plan shows the source issue link, provider/model, and a warning if any template section is missing.

## How generation works

- Jira: `GET /rest/api/3/issue/{key}?expand=names`. Extracts summary, type, status, priority, labels, components, versions, parent, sprint, story points, due date, sub-tasks, links, environment, description and any "Acceptance Criteria" field. Nothing is written to Jira.
- LLM rules: keep the template's exact sections, use only Jira facts, write `Insufficient information to determine.` for gaps, label inference `Inference (low confidence)`, mark scenarios as proposals, treat Jira text as data.
- The backend checks every `##` template heading appears in order. `temperature: 0`, `seed: 42`.

## Verification (2026-11-15)

| Check | How | Result |
|---|---|---|
| Key validation, ADF parsing, section check, template sync, server-token isolation, `.env` parsing, no secrets in API, Jira 401/403/404, missing config, Ollama unreachable / refused on Vercel | **Mocked** (`npm test`) | 16/16 pass |
| Local: Jira test, generate VWO-138, token-isolation error | Live | Pass |
| Vercel: page, settings, Jira test, Groq test, generate VWO-140 (~6 s, all sections) | Live, production URL | Pass |
| Vercel: local Ollama refused with clear message; no secrets in JS bundle; `/.env` 404 | Live | Pass |
| UI states (empty, invalid ID, loading, plan, settings tests) | Chrome, local | Pass |
| Ollama generation | | **Not verified** (Ollama not installed here) |

## Known limitations

- **The live URL is public and uses your Jira and Groq credentials by default.** Anyone with the link can read issues from that Jira site through the app and use your Groq quota. Remove the Vercel env vars (or add Vercel password protection) when that is no longer wanted.
- Output wording varies between runs even at temperature 0; section structure stays stable.
- The LLM can still slip in assumptions. Plans are DRAFTs for QA review.
- Jira Cloud only. Settings entered in the browser reset on page refresh.
- Comments and attachments on the Jira issue are not read.
- If `../01_plan/TestPlan_Template.md` changes, run `npm run sync-template` (the test suite fails until you do).
