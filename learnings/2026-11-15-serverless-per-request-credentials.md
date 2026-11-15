# Moving a local "settings page" app to a public serverless host

**Problem:** A local Express app kept user-entered Jira/LLM credentials in server memory. It had to go to a public Vercel URL with the owner's keys as defaults, and visitors had to be able to enter their own `.env`.

## Approach
1. Spot what breaks on serverless. Server memory is shared by every visitor on a warm instance and lost on cold start. Credentials saved by one visitor could be used by the next one.
2. Make the API stateless. The browser keeps settings in React state (not localStorage) and sends a `config` object with every request. The server merges it over defaults per request and stores nothing.
3. Keep the owner's defaults on the server only (Vercel env vars, sensitive). The browser gets masked hints (`t***@gmail.com`) and "is set" flags only.
4. Close the credential-forwarding hole. The server's Jira token is only used with the server's own URL and email. If a user changes the URL or email, they must supply their own token. Restrict URLs to `https://*.atlassian.net`.
5. Parse the user's `.env` in the browser, so the file never leaves their machine except as fields of the request.
6. Remove the global "busy" lock. On a shared host it blocks other users; the frontend already prevents double submits.
7. Files outside the deploy root (the template in `../01_plan`) are not uploaded. Add a sync script plus a test that fails when the bundled copy drifts.

## Judgment calls
- Did NOT hardcode keys in source, even when asked to "hardcode". Env vars give the same result without keys in git or the bundle.
- Did NOT block server-side Ollama entirely; refused only private and localhost hosts on Vercel, with a message explaining why.
- Did NOT add auth to the hosted app. Instead I told the user plainly that the public URL spends their quota and exposes their Jira.

## Reusable rule
Before hosting an app that "saves settings" on the server, ask who else shares that memory. On serverless, make requests carry their own config, and never forward the server's secret to a destination the user chose.
