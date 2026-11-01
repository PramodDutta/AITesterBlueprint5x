package com.atb5x.salesforce.pages;

import com.atb5x.salesforce.exceptions.FrameworkException;
import io.qameta.allure.Allure;
import io.qameta.allure.Step;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class LoginPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    @FindBy(xpath = "//img[@id='logo']")
    private WebElement logo;

    @FindBy(xpath = "//input[@id='username']")
    private WebElement usernameInput;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement passwordInput;

    @FindBy(xpath = "//input[@id='Login']")
    private WebElement loginButton;

    @FindBy(xpath = "//input[@id='rememberUn']")
    private WebElement rememberMeCheckbox;

    @FindBy(xpath = "//a[@id='forgot_password_link']")
    private WebElement forgotPasswordLink;

    @FindBy(xpath = "//span[@id='idcard-identity']")
    private WebElement identityCard;

    @FindBy(xpath = "//div[@id='error']")
    private WebElement errorMessage;

    @FindBy(xpath = "//a[contains(@class,'gid-username-link')]")
    private WebElement logInWithUsernameLink;

    public LoginPage(WebDriver driver, Duration timeout) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, timeout);
        PageFactory.initElements(driver, this);
    }

    @Step("Open login page {url}")
    public LoginPage open(String url) throws FrameworkException {
        try {
            driver.get(url);
        } catch (WebDriverException e) {
            throw new FrameworkException("Unable to open login page " + url, e);
        }
        waitForEither(usernameInput, logInWithUsernameLink, "Username field or Log In with Username link");
        if (!isDisplayedNow(usernameInput)) {
            switchToUsernameLogin();
        }
        return this;
    }

    @Step("Switch from the email login variant to the username login form")
    public LoginPage switchToUsernameLogin() throws FrameworkException {
        click(logInWithUsernameLink, "Log In with Username link");
        waitForVisible(usernameInput, "Username field");
        return this;
    }

    @Step("Enter username {username}")
    public LoginPage enterUsername(String username) throws FrameworkException {
        type(usernameInput, "Username field", username);
        return this;
    }

    public LoginPage enterPassword(String password) throws FrameworkException {
        Allure.step("Enter password", () -> type(passwordInput, "Password field", password));
        return this;
    }

    @Step("Click Log In")
    public LoginPage clickLogin() throws FrameworkException {
        click(loginButton, "Log In button");
        return this;
    }

    @Step("Click Remember me")
    public LoginPage clickRememberMe() throws FrameworkException {
        click(rememberMeCheckbox, "Remember me checkbox");
        return this;
    }

    @Step("Submit username {username} to reach the password step")
    public LoginPage submitUsername(String username) throws FrameworkException {
        enterUsername(username);
        clickLogin();
        waitForVisible(passwordInput, "Password field");
        return this;
    }

    public LoginPage doLogin(String username, String password) throws FrameworkException {
        Allure.step("Log in as " + username, () -> {
            enterUsername(username);
            if (!isPasswordFieldDisplayed()) {
                clickLogin();
                waitForVisible(passwordInput, "Password field");
            }
            enterPassword(password);
            clickLogin();
        });
        return this;
    }

    @Step("Read login error message")
    public String getErrorMessage() throws FrameworkException {
        return readText(errorMessage, "Login error message");
    }

    @Step("Read identity card username")
    public String getIdentityCardText() throws FrameworkException {
        return readText(identityCard, "Identity card");
    }

    public String getPageTitle() throws FrameworkException {
        try {
            return driver.getTitle();
        } catch (WebDriverException e) {
            throw new FrameworkException("Unable to read the page title", e);
        }
    }

    public boolean isRememberMeSelected() throws FrameworkException {
        try {
            return waitForVisible(rememberMeCheckbox, "Remember me checkbox").isSelected();
        } catch (StaleElementReferenceException e) {
            throw new FrameworkException("Remember me checkbox became stale", e);
        }
    }

    @Step("Wait for the login form to be dismissed")
    public boolean isLoginFormDismissed() {
        try {
            return wait.until(ExpectedConditions.invisibilityOf(loginButton));
        } catch (TimeoutException e) {
            return false;
        }
    }

    public boolean isLogoDisplayed() {
        return isDisplayedWithinWait(logo);
    }

    public boolean isUsernameFieldDisplayed() {
        return isDisplayedWithinWait(usernameInput);
    }

    public boolean isLoginButtonDisplayed() {
        return isDisplayedWithinWait(loginButton);
    }

    public boolean isRememberMeDisplayed() {
        return isDisplayedWithinWait(rememberMeCheckbox);
    }

    public boolean isForgotPasswordLinkDisplayed() {
        return isDisplayedWithinWait(forgotPasswordLink);
    }

    public boolean isPasswordFieldDisplayed() {
        return isDisplayedNow(passwordInput);
    }

    public boolean isErrorMessageDisplayed() {
        return isDisplayedNow(errorMessage);
    }

    private void type(WebElement element, String name, String value) throws FrameworkException {
        WebElement field = waitForVisible(element, name);
        try {
            field.clear();
            field.sendKeys(value);
        } catch (WebDriverException e) {
            throw new FrameworkException("Unable to type into " + name, e);
        }
    }

    private void click(WebElement element, String name) throws FrameworkException {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(element)).click();
        } catch (TimeoutException e) {
            throw new FrameworkException(name + " was not clickable within the configured wait", e);
        } catch (WebDriverException e) {
            throw new FrameworkException("Unable to click " + name, e);
        }
    }

    private String readText(WebElement element, String name) throws FrameworkException {
        try {
            return waitForVisible(element, name).getText().trim();
        } catch (StaleElementReferenceException e) {
            throw new FrameworkException(name + " became stale while reading text", e);
        }
    }

    private WebElement waitForVisible(WebElement element, String name) throws FrameworkException {
        try {
            return wait.until(ExpectedConditions.visibilityOf(element));
        } catch (TimeoutException e) {
            throw new FrameworkException(name + " was not visible within the configured wait", e);
        }
    }

    private void waitForEither(WebElement first, WebElement second, String name) throws FrameworkException {
        try {
            wait.until(ExpectedConditions.or(ExpectedConditions.visibilityOf(first), ExpectedConditions.visibilityOf(second)));
        } catch (TimeoutException e) {
            throw new FrameworkException(name + " was not visible within the configured wait", e);
        }
    }

    private boolean isDisplayedWithinWait(WebElement element) {
        try {
            return wait.until(ExpectedConditions.visibilityOf(element)).isDisplayed();
        } catch (TimeoutException | StaleElementReferenceException e) {
            return false;
        }
    }

    private boolean isDisplayedNow(WebElement element) {
        try {
            return element.isDisplayed();
        } catch (NoSuchElementException | StaleElementReferenceException e) {
            return false;
        }
    }
}
