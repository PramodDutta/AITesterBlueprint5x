# Salesforce login Selenium framework from a RICE-POT prompt

**Problem:** Turn the RICE-POT prompt in `Chapter_02_Prompt_Engineering/RICE_POT/REALPROMPT_RICE_POT.md` into a runnable Maven + TestNG + PageFactory + Allure framework for `login.salesforce.com/?locale=in` (XPath only, no comments, no `Thread.sleep`), and make it pass both headless and headed.

## Approach
1. **Look at the live page before writing a locator.** `curl` the HTML, then drive it with a real browser (Playwright MCP snapshot plus `outerHTML` reads). The prompt's example shows username, password and submit on one form. The live page does not: it is identifier-first. Step 1 has Username, Log In and Remember me. Step 2 (after Log In) adds `//input[@id='password']` and an identity card `//span[@id='idcard-identity']`.
2. **Capture the exact error strings by triggering them** (empty username, empty password, wrong password) and copy them into constants. Never paraphrase an error message.
3. **Model the two steps in the page object.** `submitUsername()` clicks Log In and waits for the password field. `doLogin()` only does step 1 when the password field is not already showing (after an error, both fields are on screen).
4. **Map the prompt's guardrails to code.** "Insufficient information to determine." becomes `SkipException` when no `sf.username`/`sf.password` (or `SF_USERNAME`/`SF_PASSWORD`) is given. The inferred success check (the login form goes away) is labelled "Inference (low confidence)" in the Allure description.
5. **When a setUp fails, capture evidence, not a theory.** Intermittent "username not visible" failures were fixed by attaching a screenshot, the URL and the page source on setUp failure. The screenshot showed the real cause: the same URL sometimes serves a different LWC page, "Log In with Email". `open()` now waits for either the username field or `//a[contains(@class,'gid-username-link')]` and clicks the link when the email variant is served. To test that path on purpose, point `base.url` at `?locale=in&email_login=1`.
6. **Pin the toolchain by what works, not by the newest version.** Surefire 3.6.x refuses `suiteXmlFiles` (TestNG now runs on the JUnit Platform), so pin 3.5.6. Allure 3.x is a new major line, so stay on 2.35.x to match the 2.36 CLI.
7. **Check what the report actually stores.** `@Param(mode = MASKED)` only hides the value in the UI. The raw password is still in `allure-results/*.json`. Steps that handle secrets use `Allure.step("Enter password", () -> ...)`, so the value is never recorded.

## Judgment calls (what was NOT done)
- **No user-agent spoofing or bot-check workarounds.** The page was inspected through normal browser automation only.
- **No `Thread.sleep` and no retry analyzer** to hide the variant flake. The root cause was handled in `open()`, and `configfailurepolicy="continue"` stops one bad load from skipping the rest of a class.
- **No invented valid-login assertion** (dashboard title, Lightning URL). It is unknown without an org and may hit identity verification, so it skips with the guardrail text.
- **No real accounts in negative tests.** Only `example.com`/`example.org` usernames, and only a few attempts per run, to stay clear of lockouts and rate limits.
- **No extra test for the email variant.** The prompt asked for two scripts. The switch is checked once through the `base.url` override and shows up as an Allure step whenever it fires.

## Reusable rule
When UI tests fail only sometimes, attach a screenshot and the page source on the failing fixture before changing waits. Intermittent "element not found" is often a different page (A/B variant, interstitial), not a slow page.
