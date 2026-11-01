package com.atb5x.salesforce.tests;

import com.atb5x.salesforce.base.BaseTest;
import com.atb5x.salesforce.exceptions.FrameworkException;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.Test;
import org.testng.asserts.SoftAssert;

@Epic("Salesforce CRM")
@Feature("Login")
public class ValidLoginTest extends BaseTest {

    private static final String LOGIN_PAGE_TITLE = "Login | Salesforce";
    private static final String WELL_FORMED_USERNAME = "atb5x.valid.format@example.com";
    private static final String INSUFFICIENT_INFORMATION = "Insufficient information to determine.";

    @Test(priority = 1, groups = {"smoke", "regression"}, description = "Login page loads with the expected title")
    @Story("Login page UI")
    @Severity(SeverityLevel.NORMAL)
    public void verifyLoginPageTitle() throws FrameworkException {
        Assert.assertEquals(loginPage.getPageTitle(), LOGIN_PAGE_TITLE, "Login page title mismatch");
    }

    @Test(priority = 2, groups = {"smoke", "regression"}, description = "Login page shows logo, username, Log In, Remember me and Forgot password")
    @Story("Login page UI")
    @Severity(SeverityLevel.CRITICAL)
    public void verifyLoginPageElementsAreDisplayed() {
        SoftAssert softAssert = new SoftAssert();
        softAssert.assertTrue(loginPage.isLogoDisplayed(), "Salesforce logo is not displayed");
        softAssert.assertTrue(loginPage.isUsernameFieldDisplayed(), "Username field is not displayed");
        softAssert.assertTrue(loginPage.isLoginButtonDisplayed(), "Log In button is not displayed");
        softAssert.assertTrue(loginPage.isRememberMeDisplayed(), "Remember me checkbox is not displayed");
        softAssert.assertTrue(loginPage.isForgotPasswordLinkDisplayed(), "Forgot Your Password link is not displayed");
        softAssert.assertAll();
    }

    @Test(priority = 3, groups = {"regression"}, description = "Remember me is unchecked by default and can be selected")
    @Story("Remember me")
    @Severity(SeverityLevel.NORMAL)
    public void verifyRememberMeCheckbox() throws FrameworkException {
        Assert.assertFalse(loginPage.isRememberMeSelected(), "Remember me should be unchecked by default");
        loginPage.clickRememberMe();
        Assert.assertTrue(loginPage.isRememberMeSelected(), "Remember me should be checked after clicking it");
    }

    @Test(priority = 4, groups = {"smoke", "regression"}, description = "Submitting a username reveals the password step for that username")
    @Story("Username step")
    @Severity(SeverityLevel.CRITICAL)
    public void verifyUsernameStepRevealsPasswordField() throws FrameworkException {
        loginPage.submitUsername(WELL_FORMED_USERNAME);
        Assert.assertTrue(loginPage.isPasswordFieldDisplayed(), "Password field is not displayed after submitting the username");
        Assert.assertEquals(loginPage.getIdentityCardText(), WELL_FORMED_USERNAME, "Identity card does not show the submitted username");
    }

    @Test(priority = 5, groups = {"smoke", "regression"}, description = "Valid credentials log the user in")
    @Story("Valid login")
    @Severity(SeverityLevel.BLOCKER)
    @Description("Requires -Dsf.username and -Dsf.password, or SF_USERNAME and SF_PASSWORD. Inference (low confidence): a successful login leaves the login form without an error.")
    public void verifyLoginWithValidCredentials() throws FrameworkException {
        String username = secret("sf.username", "SF_USERNAME").orElseThrow(() -> new SkipException(INSUFFICIENT_INFORMATION));
        String password = secret("sf.password", "SF_PASSWORD").orElseThrow(() -> new SkipException(INSUFFICIENT_INFORMATION));
        loginPage.doLogin(username, password);
        Assert.assertTrue(loginPage.isLoginFormDismissed(), "Login form is still displayed after submitting valid credentials");
        Assert.assertFalse(loginPage.isErrorMessageDisplayed(), "Login error is displayed after submitting valid credentials");
    }
}
