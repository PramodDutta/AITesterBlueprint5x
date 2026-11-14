# Test Plan: VWO Login Module (Functional)

| Field | Value |
|---|---|
| **Test Plan ID** | TP-VWO-LOGIN-001 |
| **Title** | Functional Test Plan for the VWO Login Module |
| **Application URL** | https://app.vwo.com/ |
| **Version** | 0.1 (Draft for review) |
| **Prepared by** | QA Engineer |
| **Date** | 2026-11-14 |
| **Status** | Draft |

> **How to read this plan**
> - Items marked **Requires clarification** are behaviors the approved requirements do not define. They are tracked in [Section 11](#11-open-questions).
> - Items marked **(Recommendation)** are proposals from QA, not approved criteria. Confirm or edit them during review.

---

## Approved Requirements (Baseline)

This plan is based only on the requirements below. Each scenario traces back to one or more of these IDs.

| Req ID | Requirement |
|---|---|
| REQ-01 | Registered users can log in with valid credentials. |
| REQ-02 | Invalid credentials must not grant access and must show an error. |
| REQ-03 | Email and password are mandatory. |
| REQ-04 | Successful login opens the authenticated dashboard. |
| REQ-05 | Invalid login shows the error message: "Your email, password, IP address or location did not match" |

---

## 1. Test Plan

### 1.1 Objective

Verify that the VWO login module behaves as defined in REQ-01 to REQ-05:

- Registered users with valid credentials can log in and reach the authenticated dashboard.
- Invalid credentials never grant access and always show the approved error message.
- Email and password are enforced as mandatory fields.
- Gaps in the requirements are identified and raised as open questions before execution.

### 1.2 Scope

**In Scope**

| # | Area | Req |
|---|---|---|
| 1 | Login with valid credentials of a registered user | REQ-01 |
| 2 | Login attempts with invalid credentials (wrong password, unregistered email, mismatched account) | REQ-02, REQ-05 |
| 3 | Exact text of the invalid-login error message | REQ-05 |
| 4 | Mandatory field enforcement (empty email, empty password, both empty) | REQ-03 |
| 5 | Landing on the authenticated dashboard after successful login | REQ-04 |
| 6 | Unauthenticated users cannot reach the dashboard through the login flow | REQ-02, REQ-04 |

**Out of Scope**

| # | Area | Reason |
|---|---|---|
| 1 | Sign up / account registration | Not part of the login requirements |
| 2 | Forgot password / password reset | No requirement supplied |
| 3 | SSO, social login, SAML, 2FA | No requirement supplied |
| 4 | "Remember me" and session timeout behavior | No requirement supplied. Do not assume a timeout value |
| 5 | Password complexity / password rules | No requirement supplied. Password rules must not be invented |
| 6 | Dashboard features beyond confirming it opens | Belongs to dashboard test plan |
| 7 | Performance, load, and security / penetration testing | Non-functional, outside this functional plan |
| 8 | Accessibility and localization | No requirement supplied |

### 1.3 Inclusions

- Functional testing of the login page UI and its observable behavior in the browser.
- Positive, negative, and boundary scenarios where REQ-01 to REQ-05 support them.
- Verification of the exact error message text defined in REQ-05.
- Scenarios whose expected result is undefined are still listed, marked **Requires clarification**, and kept blocked until answered.

### 1.4 Test Environments

| Item | Detail |
|---|---|
| Application URL | https://app.vwo.com/ |
| Environment type | **Requires clarification** (production vs. staging/QA environment) |
| Browsers (Recommendation) | Latest stable Chrome, Firefox, Edge, Safari. Final list **requires clarification** |
| Operating systems (Recommendation) | Windows 11, macOS (latest) |
| Mobile / responsive | **Requires clarification** (not in requirements) |
| Network | Stable internet access. Note that REQ-05 mentions IP address and location, so the tester's IP/location may affect results (see Risk R-02) |

### 1.5 Test Data

> Real credentials must not be written in this document. Store them in the team's approved secrets store or test-data sheet and refer to them by ID.

| Data ID | Description | Used in |
|---|---|---|
| TD-01 | Registered, active user account (email + correct password) | TS-01, TS-02, TS-03, TS-14 |
| TD-02 | Second registered, active user account | TS-06 |
| TD-03 | Unregistered email address (e.g. a unique address on a test domain) | TS-05 |
| TD-04 | Incorrect password for TD-01 | TS-04, TS-14 |
| TD-05 | Malformed email strings (e.g. `plainaddress`, `user@`, `@domain.com`) | TS-07 |
| TD-06 | Whitespace-only strings for email and password | TS-11 |
| TD-07 | TD-01 email with leading/trailing spaces, and with changed letter case | TS-12, TS-13 |

### 1.6 Defect Reporting Procedure

1. Log each defect in the team's defect tracker (tool **requires clarification**, see Section 8).
2. Each defect must include: title, steps to reproduce, test data ID used, expected result, actual result, browser/OS, screenshot or recording, linked scenario ID (TS-xx) and requirement ID (REQ-xx).
3. Severity guide **(Recommendation)**:

| Severity | Example in this module |
|---|---|
| Critical | Invalid credentials grant access, or valid users cannot log in at all |
| High | Wrong or missing error message on invalid login; mandatory field not enforced |
| Medium | Dashboard does not open after successful login but user is authenticated |
| Low | Cosmetic issues on the login page |

4. Defects are triaged with the Dev lead and Product Owner. Re-test after fix and close only after verification.

---

## 2. Test Strategy (Test Approach)

| Aspect | Approach |
|---|---|
| Test type | Manual functional black-box testing of the login UI |
| Design techniques | Requirement-based testing, equivalence partitioning (valid / invalid / empty inputs), boundary analysis on input presence (empty vs. filled, whitespace), error message verification |
| Scenario categories | **Positive**: valid login, dashboard access. **Negative**: invalid credentials, empty fields, unauthenticated access. **Boundary**: whitespace-only input, leading/trailing spaces, letter case |
| Traceability | Every scenario maps to at least one REQ ID (see Section 2.2) |
| Undefined behavior | Scenario is written, marked **Requires clarification**, and not executed until the expected result is confirmed |
| Regression | Re-run all Positive and REQ-05 scenarios after each defect fix **(Recommendation)** |
| Automation | Candidate for automation after manual pass: TS-01, TS-04, TS-05, TS-08 to TS-10 **(Recommendation)** |

> **Note on length boundaries:** No minimum or maximum length is defined for email or password. Length-based boundary tests are therefore not designed and are listed as an open question (Q-03).

### 2.1 Test Scenarios

| ID | Scenario | Type | Req | Test Data | Expected Result |
|---|---|---|---|---|---|
| TS-01 | Log in with a registered email and its correct password | Positive | REQ-01, REQ-04 | TD-01 | Login succeeds and the authenticated dashboard opens |
| TS-02 | Confirm the page shown after successful login is the authenticated dashboard | Positive | REQ-04 | TD-01 | Authenticated dashboard is displayed. Which elements prove it is the dashboard: **Requires clarification** |
| TS-03 | After a failed attempt, log in with correct credentials | Positive | REQ-01 | TD-01, TD-04 | Second attempt succeeds and the dashboard opens (assumes no lockout after one failure, see Q-05) |
| TS-04 | Registered email with wrong password | Negative | REQ-02, REQ-05 | TD-01 email + TD-04 | No access. Error shown: "Your email, password, IP address or location did not match" |
| TS-05 | Unregistered email with any password | Negative | REQ-02, REQ-05 | TD-03 | No access. Same error message as TS-04 |
| TS-06 | Email of account A with password of account B | Negative | REQ-02, REQ-05 | TD-01 email + TD-02 password | No access. Same error message as TS-04 |
| TS-07 | Malformed email format with any password | Negative | REQ-02 | TD-05 | No access. Whether a format validation message or the REQ-05 message is shown: **Requires clarification** |
| TS-08 | Email empty, password filled | Negative / Boundary | REQ-03 | TD-01 password | Login is not completed, no access. Validation message text: **Requires clarification** |
| TS-09 | Email filled, password empty | Negative / Boundary | REQ-03 | TD-01 email | Login is not completed, no access. Validation message text: **Requires clarification** |
| TS-10 | Both email and password empty | Negative / Boundary | REQ-03 | None | Login is not completed, no access. Validation message text: **Requires clarification** |
| TS-11 | Whitespace-only email and/or password | Boundary | REQ-03 | TD-06 | No access. Whether whitespace counts as "empty": **Requires clarification** |
| TS-12 | Valid email with leading/trailing spaces, correct password | Boundary | REQ-01, REQ-02 | TD-07 | **Requires clarification** (are spaces trimmed?) |
| TS-13 | Valid email in different letter case, correct password | Boundary | REQ-01, REQ-02 | TD-07 | **Requires clarification** (is email case-insensitive?) |
| TS-14 | Correct password entered in different letter case | Negative | REQ-02 | TD-01, TD-04 | **Requires clarification** (password case sensitivity is not defined in requirements) |
| TS-15 | Open the dashboard URL directly without logging in | Negative | REQ-02, REQ-04 | None | Dashboard is not accessible to an unauthenticated user. Exact behavior (redirect to login, message): **Requires clarification** |
| TS-16 | Multiple consecutive failed login attempts | Negative | REQ-02 | TD-01 email + TD-04 | Every attempt is denied with the REQ-05 message. Lockout, CAPTCHA, or rate limit behavior: **Requires clarification** |

### 2.2 Requirement Traceability

| Req | Covered by |
|---|---|
| REQ-01 | TS-01, TS-03, TS-12, TS-13 |
| REQ-02 | TS-04, TS-05, TS-06, TS-07, TS-12, TS-13, TS-14, TS-15, TS-16 |
| REQ-03 | TS-08, TS-09, TS-10, TS-11 |
| REQ-04 | TS-01, TS-02, TS-15 |
| REQ-05 | TS-04, TS-05, TS-06, TS-16 |

---

## 3. Test Schedule

Dates are not defined in the supplied inputs. Durations below are a **(Recommendation)**; fill in dates once the release timeline is known.

| Activity | Duration (Recommendation) | Start | End |
|---|---|---|---|
| Plan review and clarification of open questions | 1 day | TBD | TBD |
| Test case detailing and test data setup | 1 day | TBD | TBD |
| Test execution (all browsers) | 1 to 2 days | TBD | TBD |
| Defect re-test and regression | 1 day | TBD | TBD |
| Test summary report | 0.5 day | TBD | TBD |

---

## 4. Test Deliverables

| Deliverable | Description |
|---|---|
| Test Plan | This document |
| Test Cases | Detailed steps for TS-01 to TS-16 |
| Test Data Sheet | TD-01 to TD-07, credentials stored securely |
| Requirement Traceability Matrix | Section 2.2, maintained through execution |
| Defect Reports | Logged in the defect tracker |
| Execution Evidence | Screenshots/recordings for failed and key passed scenarios |
| Clarification Log | Answers to Q-01 to Q-11 |
| Test Summary Report | Pass/fail counts, open defects, risks, sign-off recommendation |

---

## 5. Entry and Exit Criteria

All criteria below are **(Recommendation)** and need approval.

### 5.1 Entry Criteria

- REQ-01 to REQ-05 are approved and baselined.
- This test plan is reviewed and approved.
- Login page is deployed and reachable in the agreed test environment.
- Test accounts TD-01 and TD-02 are created, active, and shared securely.
- Open questions that block scenarios are either answered or those scenarios are marked blocked.

### 5.2 Exit Criteria

- 100% of executable scenarios are run.
- All Positive scenarios and all REQ-05 checks pass.
- No open Critical or High severity defects.
- Medium/Low defects are reviewed and accepted or deferred by the Product Owner.
- Scenarios still marked **Requires clarification** are documented as not executed, with reason.
- Test summary report is shared and signed off.

---

## 6. Test Execution

### 6.1 Entry Criteria (Recommendation)

- Section 5.1 entry criteria are met.
- Test cases are reviewed.
- Browsers and devices in Section 1.4 are available.
- Defect tracker access is set up for the team.

### 6.2 Exit Criteria (Recommendation)

- All executable test cases have a final status (Pass, Fail, Blocked).
- All failures are logged as defects with evidence.
- Fixed defects are re-tested and regression run on Positive scenarios.

---

## 7. Test Closure

### 7.1 Entry Criteria (Recommendation)

- Test execution exit criteria (6.2) are met.
- Defect status is final (Closed, Deferred, or Accepted).

### 7.2 Exit Criteria (Recommendation)

- Test summary report is approved by stakeholders.
- Test artifacts (cases, data sheet, evidence, RTM) are archived.
- Lessons learned and remaining open questions are recorded.

---

## 8. Tools

Tool choices are **(Recommendation)**; confirm with the team.

| Purpose | Tool |
|---|---|
| Test case management | Requires clarification (e.g. Jira + Xray, TestRail) |
| Defect tracking | Requires clarification (e.g. Jira) |
| Evidence capture | Browser screenshots / screen recorder |
| Browser dev tools | To inspect network calls and console errors during failures |
| Future automation | Playwright or Selenium for TS-01, TS-04, TS-05, TS-08 to TS-10 |

---

## 9. Risks and Mitigations

| ID | Risk | Impact | Mitigation |
|---|---|---|---|
| R-01 | Many expected results are undefined (validation messages, trimming, case sensitivity, lockout) | Scenarios blocked, coverage gaps | Raise Q-01 to Q-11 before execution; mark affected scenarios blocked until answered |
| R-02 | REQ-05 mentions IP address and location, so the system may block or reject logins based on network | Valid logins may fail during testing, false defects | Confirm IP/location rules (Q-07); use an allow-listed network or a known test location |
| R-03 | Testing against production (app.vwo.com) | Repeated failed attempts may lock real or test accounts, trigger security alerts | Use a dedicated QA environment if available (Q-01); use only dedicated test accounts |
| R-04 | Account lockout after repeated failures (if it exists) | TD-01 may become unusable mid-run | Run TS-16 last, keep a spare account, confirm unlock process |
| R-05 | Test credentials exposed in documents or screenshots | Security issue | Store credentials in a secrets store; mask passwords in evidence |
| R-06 | CAPTCHA or bot protection on the login page | Blocks future automation | Confirm whether a test bypass exists in the QA environment |

---

## 10. Approvals

| Role | Name | Signature | Date |
|---|---|---|---|
| QA Lead | | | |
| Dev Lead | | | |
| Product Owner | | | |

---

## 11. Open Questions

Each item below is **Requires clarification**. Answers will update the related scenarios.

| ID | Question | Affects |
|---|---|---|
| Q-01 | Which environment should be used: production (app.vwo.com) or a separate QA/staging environment? | Section 1.4, R-03 |
| Q-02 | What validation message (exact text) appears when email, password, or both are empty? Is it inline or on submit? | TS-08, TS-09, TS-10 |
| Q-03 | Are there minimum or maximum lengths for email and password? | Boundary coverage |
| Q-04 | Is a malformed email checked by format validation before submit, or does it return the REQ-05 message? | TS-07 |
| Q-05 | Is there an account lockout, CAPTCHA, or rate limit after failed attempts? After how many? | TS-03, TS-16, R-04 |
| Q-06 | Are leading/trailing spaces trimmed? Is whitespace-only input treated as empty? | TS-11, TS-12 |
| Q-07 | What IP address or location rules apply to login (as implied by the REQ-05 message)? | R-02 |
| Q-08 | Is email matching case-insensitive? Is password case-sensitive? | TS-13, TS-14 |
| Q-09 | Which page elements confirm the user is on the authenticated dashboard? What is the dashboard URL? | TS-02, TS-15 |
| Q-10 | What happens when an unauthenticated user opens the dashboard URL directly (redirect, message)? | TS-15 |
| Q-11 | Which browsers, OS versions, and devices (desktop/mobile) must be supported? | Section 1.4 |
