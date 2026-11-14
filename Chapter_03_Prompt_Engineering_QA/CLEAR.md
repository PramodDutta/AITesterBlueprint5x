**Context:**  
I need functional test cases for https://app.vwo.com/. For this exercise, the approved requirements state:
- Valid registered credentials allow login.
- Invalid credentials are rejected.
- Email and password are mandatory.
- Successful login opens the authenticated dashboard.

**Limits:**  
- Create exactly 10 test cases.
- Use only the requirements supplied above.
- Use placeholders for credentials; never include real passwords.
- Do not invent exact validation messages or password policies.
- Set execution status to “Not Run.”
- If an expected result depends on missing requirements, mark it “Requires clarification.”

**Examples:**  
Use this filled example as the format:

Test Case ID: VWO-LOGIN-TC-001  
Summary: Verify login with valid registered credentials  
Preconditions: An active registered test account is available; the user is logged out.  
Test Data: <registered_email>, <valid_password>  
Steps:
1. Open https://app.vwo.com/.
2. Enter the registered email.
3. Enter the valid password.
4. Submit the login form.  
Expected Result: Login succeeds and the authenticated dashboard opens.  
Priority: High  
Test Type: Positive  
Status: Not Run

**Action:**  
Generate 10 distinct test cases covering valid login, incorrect password, unregistered email, empty fields, and access control before and after login. Write numbered steps and observable expected results.

**Review:**  
Check that:
- Every test case traces to a supplied requirement.
- Test cases are distinct.
- Expected results describe observable behavior.
- No test is marked Passed or Failed without execution.
- Unknown behavior is clearly identified.

Return a table using these columns:
Test Case ID, Requirement, Summary, Preconditions, Test Data, Steps, Expected Result, Priority, Test Type, Status.

Treat this as a Jira-style table. Exact import compatibility requires the Jira project and test-management app’s field mapping.