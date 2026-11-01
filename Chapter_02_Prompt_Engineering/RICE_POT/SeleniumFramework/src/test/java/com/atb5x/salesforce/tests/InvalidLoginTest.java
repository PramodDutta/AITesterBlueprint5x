package com.atb5x.salesforce.tests;

import com.atb5x.salesforce.base.BaseTest;
import com.atb5x.salesforce.exceptions.FrameworkException;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

@Epic("Salesforce CRM")
@Feature("Login")
public class InvalidLoginTest extends BaseTest {

    private static final String UNKNOWN_USERNAME = "atb5x.unknown.user@example.com";
    private static final String EMPTY_USERNAME_ERROR = "Error: Please enter your username.";
    private static final String EMPTY_PASSWORD_ERROR = "Error: Please enter your password.";
    private static final String INVALID_CREDENTIALS_ERROR =
            "Error: Please check your username and password. If you still can't log in, contact your Salesforce administrator.";

    @DataProvider(name = "invalidCredentials")
    public Object[][] invalidCredentials() {
        return new Object[][]{
                {UNKNOWN_USERNAME, "WrongPass@123"},
                {"atb5x.qa.invalid@example.org", "Inv@lid#2026"}
        };
    }

    @Test(priority = 1, groups = {"regression", "negative"}, description = "Empty username shows the username required error")
    @Story("Invalid login")
    @Severity(SeverityLevel.CRITICAL)
    public void verifyErrorForEmptyUsername() throws FrameworkException {
        loginPage.enterUsername("").clickLogin();
        Assert.assertEquals(loginPage.getErrorMessage(), EMPTY_USERNAME_ERROR, "Empty username error mismatch");
        Assert.assertFalse(loginPage.isPasswordFieldDisplayed(), "Password step must not open without a username");
    }

    @Test(priority = 2, groups = {"regression", "negative"}, description = "Empty password shows the password required error")
    @Story("Invalid login")
    @Severity(SeverityLevel.CRITICAL)
    public void verifyErrorForEmptyPassword() throws FrameworkException {
        loginPage.submitUsername(UNKNOWN_USERNAME).enterPassword("").clickLogin();
        Assert.assertEquals(loginPage.getErrorMessage(), EMPTY_PASSWORD_ERROR, "Empty password error mismatch");
    }

    @Test(priority = 3, groups = {"regression", "negative"}, dataProvider = "invalidCredentials", description = "Invalid credentials show the credentials error and keep the user on the login page")
    @Story("Invalid login")
    @Severity(SeverityLevel.BLOCKER)
    public void verifyErrorForInvalidCredentials(String username, String password) throws FrameworkException {
        loginPage.doLogin(username, password);
        Assert.assertEquals(loginPage.getErrorMessage(), INVALID_CREDENTIALS_ERROR, "Invalid credentials error mismatch");
        Assert.assertTrue(loginPage.isLoginButtonDisplayed(), "User must remain on the login page after invalid credentials");
    }
}
