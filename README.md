# 🤖 AI Tester Blueprint 5x

Hands-on course material from **The Testing Academy** for testers moving into AI: build Agent Skills that do real QA work, then learn how the LLMs behind them actually behave, so you can test them.

---

## 📑 Table of Contents

- [Roadmap](#-roadmap)
- [Chapters at a glance](#-chapters-at-a-glance)
- [Project structure](#-project-structure)
- [Getting started](#-getting-started)
- [Chapters](#-chapters)
  - [00 · Agent Skill Basics](#00--agent-skill-basics)
  - [01 · LLM Fundamentals from Scratch](#01--llm-fundamentals-from-scratch)
  - [02 · Prompt Engineering: RICE-POT to a Selenium Framework](#02--prompt-engineering-rice-pot-to-a-selenium-framework)
  - [02.1 · Anti-Hallucination Rules](#021--anti-hallucination-rules)
  - [03 · Prompt Frameworks for QA: STAR, CLEAR, CRISP](#03--prompt-frameworks-for-qa-star-clear-crisp)
  - [03.1 · Reusable QA Prompt Templates](#031--reusable-qa-prompt-templates)
  - [03.2 · Context Files](#032--context-files)
  - [04 · Jira Test Plan AI Agent (vibe-coded app)](#04--jira-test-plan-ai-agent-vibe-coded-app)
  - [05 · n8n Jira Test Plan Agent](#05--n8n-jira-test-plan-agent)
- [Learnings](#-learnings)

---

## 🗺️ Roadmap

```mermaid
flowchart LR
    C0["Ch 00 · Agent Skills<br/>SKILL.md basics + advanced"] --> C1["Ch 01 · LLM Fundamentals<br/>13 lessons, one HTML guide"]
    C1 --> C2["Ch 02 · Prompt Engineering<br/>RICE-POT -> Selenium framework"]
    C2 --> C21["Ch 02.1 · Anti-Hallucination Rules<br/>verified facts only"]
    C21 --> C3["Ch 03 · Prompt Frameworks for QA<br/>STAR, CLEAR, CRISP -> plan, cases, bug"]
    C3 --> C31["Ch 03.1 · Reusable Prompt Templates<br/>6 fill-in-the-blank QA prompts"]
    C31 --> C32["Ch 03.2 · Context Files<br/>project, feature, testing, constraints"]
    C32 --> C4["Ch 04 · Jira Test Plan AI Agent<br/>React + Express app on Vercel"]
    C4 --> C5["Ch 05 · n8n Jira Agent<br/>same job, no-code workflow"]

    classDef done fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20
    class C0,C1,C2,C21,C3,C31,C32,C4,C5 done
```

---

## 📚 Chapters at a glance

| # | Chapter | What you build or learn | Format | Status |
|:-:|:--------|:------------------------|:-------|:------:|
| 00 | [Agent Skill Basics](Chapter_00_SKILL_Basics/) | A basic and an advanced test-plan skill (Jira ticket -> reviewed test plan) | `SKILL.md` + references + scripts | ✅ |
| 01 | [LLM Fundamentals from Scratch](Chapter_01_LLM_Basics/) | 13 plain-words lessons: tokens, temperature, context, RAG, MCP, agents, testing LLM output | Single-file HTML guide | ✅ |
| 02 | [Prompt Engineering](Chapter_02_Prompt_Engineering/RICE_POT/) | A RICE-POT prompt turned into a Selenium + Java framework for the Salesforce login page, run headless and headed | Maven + TestNG + Allure | ✅ |
| 02.1 | [Anti-Hallucination Rules](Chapter_02_Prompt_Engineering/anti-hallucination.rules.md) | A reusable rule block that limits a QA assistant to the input you give it and makes it report what is missing | Prompt rules (Markdown) | ✅ |
| 03 | [Prompt Frameworks for QA](Chapter_03_Prompt_Engineering_QA/) | Three prompt frameworks for the VWO login page: STAR -> test plan, CLEAR -> 10 test cases, CRISP -> one bug report | Prompts (Markdown) + Word outputs | ✅ |
| 03.1 | [Reusable QA Prompt Templates](Chapter_03_Prompt_Engineering_QA/01_reuse-templates/) | Six fill-in-the-blank prompts: basic, PRD-based, API, negative, security and regression test cases | Prompt templates (Markdown) | ✅ |
| 03.2 | [Context Files](Chapter_03_Prompt_Engineering_QA/00_context-vwo/) | Four context files (project, feature, testing, constraints) you fill once and paste above any prompt | Context templates (Markdown) | ✅ |
| 04 | [Jira Test Plan AI Agent](Chapter_04_AI_Agents_Basics/VIBE_CODING/01_Intelligent_Test_Planning_AIAgent/) | A web app vibe-coded from a RICE-POT prompt: enter a Jira ID, get a test plan built on the template. [Live demo](https://ai5x-testplanaigent.vercel.app) | React + Express + Groq / Ollama, on Vercel | ✅ |
| 05 | [n8n Jira Test Plan Agent](Chapter_05_AIAgents_n8n/01_JIRAAIAgent.json) | The same Jira -> test plan job as a 4-node n8n workflow: chat trigger, AI Agent, Groq model, Jira tool | n8n workflow export (JSON) | ✅ |

---

## 🌳 Project structure

```
AITesterBlueprint5x/
├── Chapter_00_SKILL_Basics/
│   ├── 00_basics_skills/
│   │   ├── testplan-creator-skill/          # basic skill: template inline in SKILL.md
│   │   ├── testcase-creator-skill/          # placeholder (empty SKILL.md)
│   │   └── apitestcase-response-validator-skill/   # placeholder (empty SKILL.md)
│   ├── 01_advance-skills/
│   │   └── testplan-creator-skill_a/        # advanced skill: Jira -> gap analysis -> plan
│   │       ├── SKILL.md
│   │       ├── references/                  # requirement-checklist.md, test-plan-template.md
│   │       ├── scripts/fetch-jira.sh        # curl + jq Jira REST v3 fetch
│   │       ├── misc/                        # company logo, company details
│   │       └── output/VWO-49-test-plan.pdf  # sample output
│   └── resources/VWO-49.doc                 # source ticket
├── Chapter_01_LLM_Basics/
│   └── LLM_Fundamentals.html                # 13-lesson guide, open in any browser
├── Chapter_02_Prompt_Engineering/
│   ├── anti-hallucination.rules.md          # reusable guardrails: facts only, four-part output
│   └── RICE_POT/
│       ├── REALPROMPT_RICE_POT.md           # the filled RICE-POT prompt behind the framework
│       ├── Template_RICE_POT/               # blank RICE-POT template + guardrail block
│       └── SeleniumFramework/               # Maven + TestNG + Selenium 4 + Allure
│           ├── pom.xml
│           ├── testng.xml                   # "Valid Login" and "Invalid Login" tests
│           └── src/
│               ├── main/java/com/atb5x/salesforce/
│               │   ├── pages/LoginPage.java         # PageFactory, XPath only, explicit waits
│               │   └── exceptions/FrameworkException.java
│               └── test/
│                   ├── java/com/atb5x/salesforce/
│                   │   ├── base/BaseTest.java       # config, one driver per test, failure evidence
│                   │   └── tests/                   # ValidLoginTest, InvalidLoginTest
│                   └── resources/                   # config.properties, allure.properties
├── Chapter_03_Prompt_Engineering_QA/
│   ├── STAR.md                              # Situation, Task, Action, Result -> test plan
│   ├── Template.md                          # test plan table of contents the STAR prompt fills
│   ├── CLEAR.md                             # Context, Limits, Examples, Action, Review -> test cases
│   ├── CRISP.md                             # Context, Role, Instructions, Style, Parameters -> bug report
│   ├── 00_context-vwo/                      # context files pasted above any prompt
│   │   ├── context_project.md               # app, tech stack, environment URLs
│   │   ├── context_feature.md               # user stories, acceptance criteria, rules, errors
│   │   ├── context_testing.md               # scope, test data, environment, known issues
│   │   └── context_constraints.md           # MUST / MUST NOT rules and output markers
│   ├── 01_reuse-templates/                  # 6 fill-in-the-blank QA prompts
│   │   ├── Template1_Basic_TC_Gen.md        # [NUMBER] test cases for [FEATURE]
│   │   ├── Template2_PRD_TC_Comprehensive.md    # PRD -> functional, negative, boundary, edge
│   │   ├── Template3_APITest_Gen.md         # API docs -> status-code-based tests
│   │   ├── Template4_Negative_TC.md         # negative cases only
│   │   ├── Template5_Security_TC.md         # OWASP-style checks, no real payloads
│   │   └── Template6_Regression_Test_Suite.md   # end-to-end regression suite with time estimates
│   └── output/
│       ├── VWO_Login_Test_Plan.md / .docx   # STAR output (Markdown source + Word)
│       ├── VWO_Login_Test_Cases.docx        # CLEAR output: 10 cases, all "Not Run"
│       └── VWO_Login_Bug_Report.docx        # CRISP output: hypothetical training bug
├── Chapter_04_AI_Agents_Basics/VIBE_CODING/
│   ├── 01_Intelligent_Test_Planning_AIAgent/
│   │   ├── 00_design/image.png              # wireframe: main page + settings
│   │   ├── 01_plan/                         # TestPlan_Template.md, RICEPOT_Framework.md
│   │   └── 02_Implementation/               # the app (see its README)
│   │       ├── prompt_TP_Creator.md         # RICE-POT prompt the app was built from
│   │       ├── api/index.js                 # Vercel serverless entry
│   │       ├── src/backend/                 # Express: config, Jira, LLM, prompt, mocked tests
│   │       ├── src/frontend/                # React: main page, settings, .env loader
│   │       └── vercel.json
│   ├── 02_Test_Strategy_Builder_AIAgent/    # next agent (empty)
│   └── 03_Test_Case_CreationAI_Agent/       # next agent (empty)
├── Chapter_05_AIAgents_n8n/
│   └── 01_JIRAAIAgent.json                  # n8n workflow: chat -> agent -> Groq + Jira tool
├── learnings/                               # one-page approach notes per solved problem
├── output/                                  # generated test plans (HTML + PDF)
└── .env                                     # Jira credentials, git-ignored
```

---

## 🚀 Getting started

```bash
git clone https://github.com/PramodDutta/AITesterBlueprint5x.git
cd AITesterBlueprint5x

# Chapter 01: no build step, just open the guide
open Chapter_01_LLM_Basics/LLM_Fundamentals.html

# Chapter 00: the advanced skill needs Jira credentials in .env (never commit it)
cat > .env <<'EOF'
JIRA_BASE_URL=https://yourco.atlassian.net
JIRA_EMAIL=you@yourco.com
JIRA_TOKEN=your-api-token
EOF

# Chapter 02: needs Java 17+, Maven and Chrome (Selenium Manager downloads the driver)
cd Chapter_02_Prompt_Engineering/RICE_POT/SeleniumFramework
mvn clean test

# Chapter 04: needs Node 22+; reads Jira + GROQ_API_KEY from the root .env
cd Chapter_04_AI_Agents_Basics/VIBE_CODING/01_Intelligent_Test_Planning_AIAgent/02_Implementation
npm install && npm start      # http://localhost:3000

# Chapter 05: n8n -> Workflows -> Import from file -> Chapter_05_AIAgents_n8n/01_JIRAAIAgent.json
```

---

## 📖 Chapters

### 00 · Agent Skill Basics

**Concept:** An Agent Skill is a folder with a `SKILL.md` file (YAML frontmatter plus instructions) that teaches an AI agent one repeatable QA job. Here, that job is turning a PRD or a Jira ticket into a test plan that follows your company's template.

**Why:** It stops you re-pasting the same long prompt every time: the agent loads your template, checklist and scripts only when the task matches the skill's description.

**Q&A: why use this?**
- **Q: When do I reach for a skill?** A: When you repeat the same QA task (a test plan from a ticket, test cases from a story) and want the agent to follow your template every time without being re-told.
- **Q: What does it replace?** A: A long copy-pasted prompt. The `description` field is the trigger, and the body, `references/` and `scripts/` are loaded only when the skill fires.
- **Q: What's the gotcha?** A: The agent follows the files on disk, so every path named in `SKILL.md` must really exist (check with `ls`), and the human review gate must stay: the skill drafts, a person approves.

```mermaid
flowchart TD
    A["Tester: 'Create a test plan for VWO-49'"] --> B["scripts/fetch-jira.sh VWO-49"]
    B --> C["Score ticket against<br/>references/requirement-checklist.md"]
    C --> D{"Gaps found?"}
    D -->|Yes| E["Gaps & Questions for the author"]
    D -->|No| F["Fill references/test-plan-template.md<br/>P0 / P1 / P2 scenarios"]
    E --> F
    F --> G["🛑 Human Review Gate"]
    G -->|Approve| H["Test cases / automation may start"]
    G -->|Edit| F

    classDef gate fill:#fff3e0,stroke:#ef6c00,color:#e65100
    class G gate
```

**Basic vs advanced skill**

| | `00_basics_skills/testplan-creator-skill` | `01_advance-skills/testplan-creator-skill_a` |
|:--|:--|:--|
| Input | PRD or requirement text | Jira key (`VWO-49`) or pasted ticket |
| Files | One `SKILL.md`, template inline | `SKILL.md` + `references/` + `scripts/` + `misc/` |
| Gap analysis | No | Yes, every checklist row marked ✅ / ⚠️ / ❌ |
| Ends with | A filled test plan | A draft plus a mandatory human review gate |

**Code sample:** the advanced skill's frontmatter, and fetching the ticket the way the skill does.

```yaml
---
name: advance-testplan-creator
description: Turn a JIRA ticket into a review-ready test plan. Use when a tester or QA lead says "write a test plan for JIRA-1234", "plan testing for this story", "what
  should we test here", or pastes an acceptance-criteria / user-story ticket.
license: MIT
metadata:
  stlc-phase: Test Planning
  version: 1.0.0
---
```

```bash
# load Jira credentials from .env, then fetch the ticket as trimmed JSON (needs curl + jq)
set -a; source .env; set +a
bash Chapter_00_SKILL_Basics/01_advance-skills/testplan-creator-skill_a/scripts/fetch-jira.sh VWO-49
# -> { "key": "VWO-49", "summary": ..., "priority": ..., "description": ..., "links": [...] }
```

Sample outputs: [VWO-49-test-plan.pdf](Chapter_00_SKILL_Basics/01_advance-skills/testplan-creator-skill_a/output/VWO-49-test-plan.pdf), [VWO_Login_Dashboard_Test_Plan.pdf](output/VWO_Login_Dashboard_Test_Plan.pdf).

---

### 01 · LLM Fundamentals from Scratch

**Concept:** A 13-lesson, single-file HTML course that explains how LLMs work in plain words, from "what is a token?" to "how a tester checks LLM output". Every lesson reuses one small login feature (rules R1 to R4) and the sentence "The cat will sit on the ___", and ends with a quick check and a practice exercise.

**Why:** AI features fail in new ways (made-up facts, different wording every run, instructions hidden in data) that `expected == actual` assertions miss, and you cannot test what you cannot explain.

**Q&A: why use this?**
- **Q: When do I reach for it?** A: Before your first LLM test. It gives a manual or automation tester the core ideas (tokens, temperature, context window, memory, RAG, MCP, agents) needed to read an AI feature's behaviour, in about an hour.
- **Q: What does it replace?** A: Exact-match thinking. Wording changes every run, so you climb the assertion ladder and assert what must be true: format, rules, meaning, and a judge only for what code cannot check.
- **Q: What's the gotcha?** A: Temperature 0 is not accuracy, it can repeat the same wrong answer every time. And HTTP 200 is not success: a cut-off answer or a refusal also returns 200, so check the stop reason, format, usage and time.

```mermaid
flowchart LR
    P1["1 · Meet the LLM<br/>01-04<br/>AI vs ML vs LLM, next-token loop,<br/>tokens, base vs chat models"]
    P2["2 · Talk to it<br/>05-08<br/>prompts, temperature,<br/>context window, memory"]
    P3["3 · Give it tools<br/>09-11<br/>RAG, tools & MCP,<br/>AI agents"]
    P4["4 · Test it<br/>12-13<br/>why LLMs get things wrong,<br/>the assertion ladder"]
    P1 --> P2 --> P3 --> P4

    classDef part fill:#e3f2fd,stroke:#1565c0,color:#0d47a1
    classDef test fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20
    class P1,P2,P3 part
    class P4 test
```

**The assertion ladder (lesson 13):** use the lowest step that can check what matters.

| Step | Use it for | Example check |
|:-----|:-----------|:--------------|
| 1 · Exact match | Labels, IDs, numbers, yes or no | severity is one of High, Medium, Low |
| 2 · Format | Every structured output | The JSON parses and has every required field |
| 3 · Rules | Test cases, plans, bug reports | Each of R1-R4 has a test; no rule outside R1-R4 |
| 4 · Meaning | Free text with a known good answer | Close in meaning to a reviewed answer |
| 5 · Judge | Quality that code cannot check | A rubric graded by another model, checked against human reviewers first |

**Code sample:** the structured prompt from lesson 05. Paste it into any chat model and compare the output against R1 to R4.

```text
Role: You are a senior QA engineer.
Instructions: Write test cases for the login story below.
  [Mandatory] Cover every rule, R1 to R4.
  [Don't] Invent rules that are not in the story.
Context:
  R1: Lock the account after 5 wrong passwords in a row.
  R2: The lock lasts 15 minutes.
  R3: A successful login resets the counter.
  R4: Wrong credentials show a generic error message.
Example: TC-01 | Lock after 5 wrong passwords | enter a wrong password 5 times | the account is locked | R1
Parameters: At most 10 tests. Only facts from the story.
Output: A Markdown table with ID, Title, Steps, Expected, Rule.
Tone: Clear and short.
```

---

### 02 · Prompt Engineering: RICE-POT to a Selenium Framework

**Concept:** RICE-POT is a seven-part prompt structure: **R**ole, **I**nstructions, **C**ontext, **E**xample, **P**arameters, **O**utput, **T**one, plus a guardrail block against hallucination. This chapter takes one real RICE-POT prompt ([REALPROMPT_RICE_POT.md](Chapter_02_Prompt_Engineering/RICE_POT/REALPROMPT_RICE_POT.md)) and turns it into a working Selenium + Java framework for the Salesforce login page at `login.salesforce.com/?locale=in`, then runs it in headless and headed Chrome. Start your own prompt from the [blank template](Chapter_02_Prompt_Engineering/RICE_POT/Template_RICE_POT/Template.RICEPPOT.md).

**Why:** A one-line "write Selenium tests for login" prompt gives you "typical" code: CSS selectors, `Thread.sleep`, made-up locators. Each RICE-POT block removes a class of mistakes. `[Don't]` rules ban the bad practices, the Parameters block bans invented UI, and the Output block fixes exactly which files you get.

**Q&A: why use this?**
- **Q: When do I reach for RICE-POT?** A: When you want AI-generated test code or test cases to come out in your framework's shape every time: same patterns, same locator strategy, same report.
- **Q: What does it replace?** A: Vague prompts plus a long round of "no, use XPath", "no sleeps", "add Allure" corrections after the code comes back.
- **Q: What's the gotcha?** A: The prompt is not the truth, the live page is. The prompt describes one form with username, password and submit. The real page logs you in over two steps (username first, then password), and the same URL sometimes serves a different "Log In with Email" page. Check the live DOM before you trust any generated locator.

**How each RICE-POT block shows up in the code**

| Block | What the prompt asked for | Where it lives |
|:------|:--------------------------|:---------------|
| R · Role | Senior Salesforce QA automation tester | Allure Epic / Feature / Story / Severity on every test |
| I · Instructions | TestNG, POM + PageFactory, XPath only, try-catch, Allure, no sleeps | `LoginPage.java`, `BaseTest.java`, `pom.xml` |
| C · Context | Username, password, submit, Remember me | `@FindBy(xpath = ...)` fields in `LoginPage` |
| E · Example | PageFactory `LoginPage` with a `doLogin()` method | `LoginPage.doLogin()`, extended for the two-step flow |
| P · Parameters | No invented UI, "Insufficient information to determine." | Error strings copied from the live page; the valid-credential test skips with that exact text when no credentials are given |
| O · Output | 1 page object, 2 TestNG scripts, a Maven project | `LoginPage`, `ValidLoginTest`, `InvalidLoginTest`, `pom.xml` |
| T · Tone | Code only | No comments anywhere in the source |

**The login flow the page object handles**

```mermaid
flowchart TD
    A["open(base.url)"] --> B{"Which page was served?"}
    B -->|"Username form"| D["Step 1: enter username, click Log In"]
    B -->|"Log In with Email variant"| C["Click 'Log In with Username'"]
    C --> D
    D --> E["Step 2: password field + identity card"]
    E --> F["Enter password, click Log In"]
    F --> G{"Result"}
    G -->|"Wrong or empty input"| H["div#error shows the exact message"]
    G -->|"Valid credentials"| I["Login form goes away"]

    classDef variant fill:#fff3e0,stroke:#ef6c00,color:#e65100
    class C variant
```

**Test cases**

| Class | Test | Checks |
|:------|:-----|:-------|
| `ValidLoginTest` | `verifyLoginPageTitle` | Title is `Login \| Salesforce` |
| | `verifyLoginPageElementsAreDisplayed` | Logo, Username, Log In, Remember me, Forgot Your Password (soft asserts) |
| | `verifyRememberMeCheckbox` | Unchecked by default, checked after a click |
| | `verifyUsernameStepRevealsPasswordField` | Password field appears and the identity card shows the username |
| | `verifyLoginWithValidCredentials` | Skips with "Insufficient information to determine." unless credentials are given |
| `InvalidLoginTest` | `verifyErrorForEmptyUsername` | `Error: Please enter your username.` |
| | `verifyErrorForEmptyPassword` | `Error: Please enter your password.` |
| | `verifyErrorForInvalidCredentials` (2 data rows) | `Error: Please check your username and password. ...` and the user stays on the login page |

Last run (2026-11-01): 9 tests, 8 passed, 1 skipped (valid credentials), in both headless and headed Chrome.

**Code sample:** run it, then open the Allure report.

```bash
cd Chapter_02_Prompt_Engineering/RICE_POT/SeleniumFramework

mvn clean test                          # headed Chrome (default in config.properties)
mvn clean test -Dheadless=true          # headless, for CI
mvn clean test -Dbrowser=firefox        # chrome | firefox | edge

# enable the valid-login test with a real org (env vars keep the password out of shell history)
export SF_USERNAME='you@yourorg.com' SF_PASSWORD='your-password'
mvn clean test

allure serve target/allure-results      # needs the Allure CLI (brew install allure)
```

Every `config.properties` key (`base.url`, `browser`, `headless`, `explicit.wait.seconds`, `page.load.timeout.seconds`) can be overridden with `-Dkey=value`. When a test or a setUp fails, a screenshot, the URL and the page source are attached to the Allure report.

---

### 02.1 · Anti-Hallucination Rules

**Concept:** [anti-hallucination.rules.md](Chapter_02_Prompt_Engineering/anti-hallucination.rules.md) is a reusable prompt block that limits a QA assistant to what you actually give it (PRD, API docs, logs, screenshots, test data, user input) and makes it answer in four fixed sections: Verified Facts, Missing / Unknown Information, Generated Output, Self-Validation Check.

**Why:** Asked about a system it cannot see, an LLM fills the gaps with "typical" behaviour, so a test can look right while checking a feature, an error code or a button that does not exist.

**Q&A: why use this?**
- **Q: When do I reach for it?** A: Whenever AI output turns into something people will trust: test cases, bug reports, locators. Paste it above your task and input, or use it as the guardrail block in a RICE-POT prompt.
- **Q: What does it replace?** A: Telling the model "be accurate", which gives it no way to say "I don't know". These rules give it two exact phrases, `Insufficient information to determine.` and `Inference (low confidence)`, so you can search the output for them.
- **Q: What's the gotcha?** A: It lowers the risk but does not remove it. The Self-Validation Check is written by the same model that wrote the output, so a person still has to trace each assertion back to the input.

```mermaid
flowchart TD
    A["Your input<br/>PRD, API docs, logs, screenshots, test data"] --> B["Step 1: extract verifiable facts"]
    B --> C["Step 2: list unknown or missing information"]
    C --> D["Step 3: generate output only from Step 1 facts"]
    D --> Q{"For each detail"}
    Q -->|"Stated in the input"| G["Write it, traceable to the input"]
    Q -->|"Inferred"| H["Label it: Inference (low confidence)"]
    Q -->|"Missing or unclear"| I["Say: Insufficient information to determine."]
    G --> E["Step 4: self-check for hallucinations or contradictions"]
    H --> E
    I --> E
    E --> F["Four-part output"]

    classDef guard fill:#fff3e0,stroke:#ef6c00,color:#e65100
    class H,I guard
```

**Where the two phrases already appear in this repo**

| File | How it uses them |
|:-----|:-----------------|
| [REALPROMPT_RICE_POT.md](Chapter_02_Prompt_Engineering/RICE_POT/REALPROMPT_RICE_POT.md) | Guardrail block of the Selenium prompt |
| [Template.RICEPPOT.md](Chapter_02_Prompt_Engineering/RICE_POT/Template_RICE_POT/Template.RICEPPOT.md) | Guardrail block of the blank template |
| [ValidLoginTest.java](Chapter_02_Prompt_Engineering/RICE_POT/SeleniumFramework/src/test/java/com/atb5x/salesforce/tests/ValidLoginTest.java) | The skip reason when no credentials are given, and the label on the inferred success check |

**Code sample:** a shortened copy of the rules with a real task. Paste it into any chat model.

```text
ROLE: You are a QA assistant operating under strict verification rules.

You may ONLY use information explicitly provided in the input below.

1. DO NOT invent features, APIs, error codes, UI elements, or behavior.
2. DO NOT assume default or "typical" system behavior.
3. If information is missing or unclear, respond with:
   "Insufficient information to determine."
4. Every assertion must be traceable to provided input.
5. If a detail is inferred, label it explicitly as:
   "Inference (low confidence)".
6. Output must be deterministic and repeatable.

OUTPUT FORMAT (STRICT):
- Verified Facts:
- Missing / Unknown Information:
- Generated Output:
- Self-Validation Check:

TASK: Write test cases for the Salesforce login errors in the input.

INPUT:
- Empty username shows "Error: Please enter your username."
- Empty password shows "Error: Please enter your password."
```

**What to check:** the input says nothing about account lockout, so a lockout test under Generated Output means the model ignored the rules.

---

### 03 · Prompt Frameworks for QA: STAR, CLEAR, CRISP

**Concept:** Three prompt frameworks, each matched to one QA document, all run against the same VWO login page (`app.vwo.com`). [STAR](Chapter_03_Prompt_Engineering_QA/STAR.md) (Situation, Task, Action, Result) produces a test plan, [CLEAR](Chapter_03_Prompt_Engineering_QA/CLEAR.md) (Context, Limits, Examples, Action, Review) produces 10 test cases, and [CRISP](Chapter_03_Prompt_Engineering_QA/CRISP.md) (Context, Role, Instructions, Style, Parameters) produces one bug report.

**Why:** Each QA document fails in its own way: a plan drifts into invented rules, test cases drift in format, a bug report mixes what was seen with what was guessed. Each framework has a slot that blocks that failure.

**Q&A: why use this?**
- **Q: When do I reach for which one?** A: STAR when you need a planning document, CLEAR when you need many items in one fixed format (it carries a filled example and a review checklist), CRISP when one precise artifact must be readable by someone who was not there.
- **Q: What does it replace?** A: "Write a test plan for the login page", which returns password rules, error messages and session timeouts that nobody approved.
- **Q: What's the gotcha?** A: The requirements decide what can be tested. All three prompts tell the model to write "Requires clarification", "Not supplied" or "Not provided" instead of guessing, so read those markers first: they are the questions to take to the Product Owner.

```mermaid
flowchart LR
    R["VWO login requirements<br/>REQ-01 to REQ-05"] --> S["STAR<br/>Situation · Task · Action · Result"]
    R --> C["CLEAR<br/>Context · Limits · Examples · Action · Review"]
    R --> K["CRISP<br/>Context · Role · Instructions · Style · Parameters"]
    S --> SO["Test plan<br/>16 scenarios, 11 open questions"]
    C --> CO["10 test cases<br/>all Not Run"]
    K --> KO["1 bug report<br/>Hypothetical training example"]
    SO --> G["🛑 Review: every 'Requires clarification'<br/>goes to the Product Owner"]
    CO --> G
    KO --> G

    classDef gate fill:#fff3e0,stroke:#ef6c00,color:#e65100
    class G gate
```

**Which framework for which document**

| Framework | Output in this chapter | The slot that does the most work | Unknowns are marked as |
|:----------|:-----------------------|:---------------------------------|:-----------------------|
| STAR | [Test plan](Chapter_03_Prompt_Engineering_QA/output/VWO_Login_Test_Plan.md) ([.docx](Chapter_03_Prompt_Engineering_QA/output/VWO_Login_Test_Plan.docx)), follows [Template.md](Chapter_03_Prompt_Engineering_QA/Template.md) | Action: "Do not invent password rules, exact error messages, or session timeouts." | Requires clarification, (Recommendation) |
| CLEAR | [10 test cases](Chapter_03_Prompt_Engineering_QA/output/VWO_Login_Test_Cases.docx), Jira-style table | Examples: one filled test case fixes the format for all ten | Requires clarification |
| CRISP | [Bug report](Chapter_03_Prompt_Engineering_QA/output/VWO_Login_Bug_Report.docx), under 500 words | Instructions: "Distinguish observed behavior from assumptions." | Not supplied, Not provided, Provisional |

**Code sample:** the CRISP prompt behind the bug report, shortened. Paste it into any chat model.

```text
Context: For a training exercise, assume I observed this defect at https://app.vwo.com/:
- Requirement: Email and password are mandatory.
- Action: Enter a registered test email, leave the password empty, submit the login form.
- Observation: The form submits, but no visible validation feedback appears.
- Reproducibility: 3 out of 3 attempts.
- Browser, OS, build, time, screenshots, logs: Not supplied.
Role: Act as a senior QA engineer writing a clear, reproducible bug report.
Instructions: Title, Environment, Preconditions, Test Data, Steps to Reproduce,
  Expected Result, Actual Result, Reproducibility, Suggested Severity, Attachments.
  Do not invent the exact validation text. Distinguish observed behavior from
  assumptions. Label severity as provisional.
Style: Concise, factual, numbered steps, for a developer who has not seen the issue.
Parameters: One report, under 500 words, placeholders for accounts,
  label it "Hypothetical training example."
```

**What to check:** the observation never says whether the user ended up logged in. A good answer lists that as "Not observed" and makes severity depend on it, a bad one assumes it either way.

---

### 03.1 · Reusable QA Prompt Templates

**Concept:** [01_reuse-templates/](Chapter_03_Prompt_Engineering_QA/01_reuse-templates/) holds six short prompts you fill in and reuse. Each has the same four parts: ROLE, TASK, CONSTRAINTS and a fixed FORMAT table, plus a slot like `[PASTE REQUIREMENTS HERE]` for your input.

**Why:** Writing a full STAR or CLEAR prompt for every small job is slow, so these give you a tested starting point for the six test-design jobs testers do most.

**Q&A: why use this?**
- **Q: When do I reach for a template instead of STAR / CLEAR / CRISP?** A: For quick, repeatable jobs ("negative cases for this form", "API tests for this endpoint"). Use the full frameworks when the output is a document others will sign off.
- **Q: What does it replace?** A: Retyping the role, rules and table columns every time, and getting a different table shape each run.
- **Q: What's the gotcha?** A: Only Templates 1 to 3 tell the model what to do when information is missing. Templates 4 to 6 do not, and Template 6 asks for time estimates the input cannot support. Paste the [anti-hallucination rules](Chapter_02_Prompt_Engineering/anti-hallucination.rules.md) above them, or add a "Not specified" line to their CONSTRAINTS.

```mermaid
flowchart TD
    Q{"What do you have?"} -->|"A few requirements"| T1["Template 1<br/>Basic test cases"]
    Q -->|"A PRD, BRD, Jira or Confluence page"| T2["Template 2<br/>Comprehensive from PRD"]
    Q -->|"API docs"| T3["Template 3<br/>API tests"]
    Q -->|"A form or feature to break"| T4["Template 4<br/>Negative only"]
    Q -->|"A feature with auth or user input"| T5["Template 5<br/>Security"]
    Q -->|"A module before release"| T6["Template 6<br/>Regression suite"]
    T4 --> G["Add a 'Not specified' rule<br/>or the anti-hallucination block"]
    T5 --> G
    T6 --> G

    classDef guard fill:#fff3e0,stroke:#ef6c00,color:#e65100
    class G guard
```

**The six templates**

| # | Template | Output columns | Says what to do when info is missing? |
|:-:|:---------|:---------------|:-------------------------------------:|
| 1 | [Basic TC Gen](Chapter_03_Prompt_Engineering_QA/01_reuse-templates/Template1_Basic_TC_Gen.md) | Test ID, Description, Pre-conditions, Steps, Expected Result, Priority | ✅ "Not specified" |
| 2 | [PRD TC Comprehensive](Chapter_03_Prompt_Engineering_QA/01_reuse-templates/Template2_PRD_TC_Comprehensive.md) | TID, Category, Description, Pre-conditions, Steps, Expected, Priority | ✅ "Needs clarification" |
| 3 | [API Test Gen](Chapter_03_Prompt_Engineering_QA/01_reuse-templates/Template3_APITest_Gen.md) | Test ID, Endpoint, Method, Request Body, Expected Status, Expected Response | ✅ No undocumented behavior |
| 4 | [Negative TC](Chapter_03_Prompt_Engineering_QA/01_reuse-templates/Template4_Negative_TC.md) | Test ID, Invalid Scenario, Input, Expected Error | ❌ Add it |
| 5 | [Security TC](Chapter_03_Prompt_Engineering_QA/01_reuse-templates/Template5_Security_TC.md) | Test ID, Security Risk, Attack Vector, Expected Secure Behavior | ❌ Add it |
| 6 | [Regression Suite](Chapter_03_Prompt_Engineering_QA/01_reuse-templates/Template6_Regression_Test_Suite.md) | Test ID, Scenario, Data Setup, Steps, Est. Time, Priority | ❌ Add it |

**Code sample:** Template 4 filled in for the VWO login page, with the missing-info rule added. Paste it into any chat model.

```text
ROLE: You are a QA Engineer focused on negative testing.

TASK: Generate negative test cases for the VWO login page (https://app.vwo.com/).

FOCUS AREAS:
- Invalid inputs
- Missing required fields
- Unauthorized access

CONSTRAINTS:
- Do NOT include happy path scenarios
- Each test must validate error handling
- Include expected error message if documented
- If the expected behavior is not documented, write "Not specified"

FORMAT:
| Test ID | Invalid Scenario | Input | Expected Error |

FEATURE REQUIREMENTS:
- Email and password are mandatory.
- Invalid credentials must not grant access.
- Invalid login shows "Your email, password, IP address or location did not match"
```

**What to check:** the requirements give no message for empty fields, so the empty-email and empty-password rows should say "Not specified", not a made-up message like "Password is required".

---

### 03.2 · Context Files

**Concept:** [00_context-vwo/](Chapter_03_Prompt_Engineering_QA/00_context-vwo/) splits everything the model needs to know into four files you fill once per project and paste above any prompt: [project](Chapter_03_Prompt_Engineering_QA/00_context-vwo/context_project.md) (app, tech stack, URLs), [feature](Chapter_03_Prompt_Engineering_QA/00_context-vwo/context_feature.md) (stories, acceptance criteria, validation rules, error messages), [testing](Chapter_03_Prompt_Engineering_QA/00_context-vwo/context_testing.md) (scope, test data, environment) and [constraints](Chapter_03_Prompt_Engineering_QA/00_context-vwo/context_constraints.md) (MUST / MUST NOT rules).

**Why:** The templates in 03.1 are only as good as what you paste into them, and retyping the app, rules and test data for every prompt leads to gaps the model fills by guessing.

**Q&A: why use this?**
- **Q: When do I reach for it?** A: Once per project or feature. Fill the four files, then stack them above any 03.1 template or STAR / CLEAR / CRISP prompt: project, feature, testing, constraints, then the task.
- **Q: What does it replace?** A: The "Context" paragraph you rewrite in every prompt, and the missing-info rule that Templates 4 to 6 lack: `context_constraints.md` adds "Not specified in requirements", "[NEEDS CLARIFICATION]" and "[ASSUMPTION]" to any prompt.
- **Q: What's the gotcha?** A: Three of the four files are still blank templates, and their sample rows look real (`Email: Valid format required`, `400 | ...`, `test@example.com`). Delete any row you did not fill, or the model will treat it as a requirement.

```mermaid
flowchart TD
    P["context_project.md<br/>app, stack, URLs"] --> S["Stacked context"]
    F["context_feature.md<br/>stories, criteria, rules, errors"] --> S
    T["context_testing.md<br/>scope, data, environment"] --> S
    C["context_constraints.md<br/>MUST / MUST NOT, markers"] --> S
    S --> X["+ any task prompt<br/>03.1 template, STAR, CLEAR, CRISP"]
    X --> O["Output marked with<br/>[NEEDS CLARIFICATION] / [ASSUMPTION]"]

    classDef guard fill:#fff3e0,stroke:#ef6c00,color:#e65100
    class C guard
```

**What each file holds**

| File | Fill in | Filled for VWO yet? |
|:-----|:--------|:-------------------:|
| `context_project.md` | Name, type, domain, tech stack, dev / staging / prod URLs, key constraints | ❌ Template |
| `context_feature.md` | Overview, user stories, acceptance criteria, API endpoints, UI elements, validation rules, error messages | ❌ Template |
| `context_testing.md` | In / out of scope, test data table, browser / device / OS, dependencies, known issues | ❌ Template |
| `context_constraints.md` | Use only provided documents, no invented errors, endpoints or validation, mark gaps and assumptions | ✅ Ready to use |

**Code sample:** `context_feature.md` filled for the VWO login page from the Chapter 03 requirements, followed by the constraints and a task. Rows with no source are deleted, not guessed.

```markdown
# Feature Context: VWO Login

## Overview
Login page at https://app.vwo.com/ for registered users.

## Acceptance Criteria
- [ ] Registered users can log in with valid credentials.
- [ ] Invalid credentials must not grant access and show an error.
- [ ] Email and password are mandatory.
- [ ] Successful login opens the authenticated dashboard.

## Error Messages
| Code | Message |
|------|---------|
| Not specified in requirements | Your email, password, IP address or location did not match |

# Constraints & Rules
(paste context_constraints.md here)

TASK: Generate 8 test cases for VWO Login using Template 1's format.
```

**What to check:** the empty-field message is not in the context, so those rows must say "Not specified in requirements" or "[NEEDS CLARIFICATION]", and every "[ASSUMPTION]" in the output is a question for the Product Owner.

---

### 04 · Jira Test Plan AI Agent (vibe-coded app)

**Concept:** A small web app built entirely from one RICE-POT prompt ([prompt_TP_Creator.md](Chapter_04_AI_Agents_Basics/VIBE_CODING/01_Intelligent_Test_Planning_AIAgent/02_Implementation/prompt_TP_Creator.md)), a wireframe ([00_design](Chapter_04_AI_Agents_Basics/VIBE_CODING/01_Intelligent_Test_Planning_AIAgent/00_design/image.png)) and a template ([TestPlan_Template.md](Chapter_04_AI_Agents_Basics/VIBE_CODING/01_Intelligent_Test_Planning_AIAgent/01_plan/TestPlan_Template.md)). You type a Jira ID, the backend reads the issue (read-only), Groq or Ollama fills the template, and the plan appears in the browser. Live at **https://ai5x-testplanaigent.vercel.app**.

**Why:** Chapters 00 to 03 give the model good prompts by hand. This chapter wraps the same idea in an app, so a tester only types `VWO-140` and gets a draft plan with the same sections every time.

**Q&A: why use this?**
- **Q: When do I reach for it?** A: When the requirement already lives in a Jira ticket and you want a first-draft plan in seconds. Anything the ticket does not say comes back as "Insufficient information to determine." and a question in the Gaps table.
- **Q: What does it replace?** A: Copying the ticket into a chat window and pasting the template by hand. The app also checks that every `##` section of the template is in the answer and warns if one is missing.
- **Q: What's the gotcha?** A: Output wording changes between runs even at temperature 0, and the model can still slip in an assumption. Every plan is a DRAFT behind the template's Human Review Gate. The hosted demo also uses the owner's Jira and Groq keys by default, so treat the link as private.

```mermaid
sequenceDiagram
    participant U as Tester (browser)
    participant A as Express API (Vercel)
    participant J as Jira Cloud
    participant L as Groq / Ollama
    U->>A: POST /api/generate { issueKey, config }
    A->>A: validate key, merge config over server defaults
    A->>J: GET /rest/api/3/issue/VWO-140 (read-only)
    J-->>A: summary, description (ADF), acceptance criteria, sprint
    A->>L: template + issue wrapped as data (jira_issue tags), temperature 0
    L-->>A: filled test plan (Markdown)
    A->>A: check all template sections present
    A-->>U: plan + source link + warnings
```

| Piece | Where | Note |
|:------|:------|:-----|
| Settings | Browser memory, sent per request | Paste or upload a `.env`; never stored in browser storage |
| Server defaults | Root `.env` (local) or Vercel env vars | API returns only masked hints like `t***@gmail.com` |
| Jira token safety | `resolveSettings()` | Server token is never sent to a URL the user typed |
| Tests | `npm test` | 16 mocked tests; live checks listed in the app README |

**Code sample:** the rule that keeps the server's Jira token away from a user-supplied URL ([config.js](Chapter_04_AI_Agents_Basics/VIBE_CODING/01_Intelligent_Test_Planning_AIAgent/02_Implementation/src/backend/config.js)).

```js
export function resolveSettings(input, defaults = serverDefaults) {
  const v = (k) => (input && typeof input[k] === 'string' ? input[k].trim() : '');
  const s = { ...defaults };

  if (v('jiraToken')) {
    // the user brought their own token: use their URL + email + token together
    s.jiraBaseUrl = trimUrl(v('jiraBaseUrl'));
    s.jiraEmail = v('jiraEmail');
    s.jiraToken = v('jiraToken');
    if (s.jiraBaseUrl && !JIRA_URL_RE.test(s.jiraBaseUrl)) {
      throw new HttpError(400, 'Jira URL must look like https://your-domain.atlassian.net (Jira Cloud).');
    }
  } else if ((v('jiraBaseUrl') && trimUrl(v('jiraBaseUrl')) !== defaults.jiraBaseUrl)
          || (v('jiraEmail') && v('jiraEmail') !== defaults.jiraEmail)) {
    throw new HttpError(400, 'You changed the Jira URL or email, so enter the matching Jira API token too.');
  }
  if (v('groqApiKey')) s.groqApiKey = v('groqApiKey');
  if (['groq', 'ollama'].includes(v('provider'))) s.provider = v('provider');
  return s;
}
```

**What to check:** generate a plan for a thin ticket (like a one-line bug) and confirm sections 7 and 8 say "Insufficient information to determine." instead of made-up names and dates. Full setup, verification and limits are in the [app README](Chapter_04_AI_Agents_Basics/VIBE_CODING/01_Intelligent_Test_Planning_AIAgent/02_Implementation/README.md).

---

### 05 · n8n Jira Test Plan Agent

**Concept:** [01_JIRAAIAgent.json](Chapter_05_AIAgents_n8n/01_JIRAAIAgent.json) is an n8n workflow export that does Chapter 04's job with no code: a **chat trigger** passes your message to an **AI Agent** node, which uses a **Groq** model (`openai/gpt-oss-120b`) and calls a **Jira tool** to fetch the issue before writing the plan.

**Why:** Chapter 04 hard-codes the steps (fetch, then generate). Here the agent decides when to call the Jira tool, which is the core idea of an AI agent: a model plus tools plus a goal.

**Q&A: why use this?**
- **Q: When do I reach for it?** A: When you want to change prompts, models or tools by clicking, or add steps (post to Slack, save to Drive) without writing code.
- **Q: What does it replace?** A: Chapter 04's backend. The `$fromAI('Issue_Key')` expression lets the model fill in the issue key from your chat message, so there is no input parsing code.
- **Q: What's the gotcha?** A: Credentials are not in the export. After import, attach your own "Groq account" and "Jira SW Cloud account" credentials. The chat trigger is set to `public: true`, so anyone with its URL can use your Jira and Groq; turn that off unless you mean to share it.

```mermaid
flowchart LR
    T["When chat message received<br/>chatTrigger"] --> A["AI Agent<br/>RICE-POT system message"]
    M["Groq Chat Model<br/>openai/gpt-oss-120b"] -. language model .-> A
    J["Get an issue in Jira Software<br/>jiraTool, operation: get"] -. tool .-> A
    A --> O["Test plan in the chat reply"]

    classDef guard fill:#fff3e0,stroke:#ef6c00,color:#e65100
    class J guard
```

| | Ch 04 app | Ch 05 n8n |
|:--|:--|:--|
| Who decides to call Jira | The code, always first | The agent, as a tool call |
| Change the prompt | Edit `prompt.js`, redeploy | Edit the AI Agent node |
| Template check / tests | Yes (section check, 16 tests) | No |

**Code sample:** the Jira tool node from the export. The model supplies `Issue_Key` at run time.

```json
{
  "name": "Get an issue in Jira Software",
  "type": "n8n-nodes-base.jiraTool",
  "parameters": {
    "operation": "get",
    "issueKey": "={{ $fromAI('Issue_Key', ``, 'string') }}",
    "additionalFields": {}
  }
}
```

**What to check:** send "Create a test plan for VWO-140" and open the execution log. The Jira tool should run once with `Issue_Key = VWO-140` before the agent answers.

---

## 🧠 Learnings

[learnings/](learnings/) holds one-page notes on how a non-trivial problem was solved: the approach, the judgment calls, and one reusable rule.

| Date | Note |
|:-----|:-----|
| 2026-10-25 | [Jira ticket to review-ready test plan PDF](learnings/2026-10-25-jira-ticket-to-test-plan-pdf.md) |
| 2026-11-01 | [Salesforce login Selenium framework from a RICE-POT prompt](learnings/2026-11-01-salesforce-login-selenium-from-rice-pot.md) |
| 2026-11-15 | [Jira 401 from a malformed API token in .env](learnings/2026-11-15-jira-401-malformed-token.md) |
| 2026-11-15 | [Moving a settings-page app to a public serverless host](learnings/2026-11-15-serverless-per-request-credentials.md) |
