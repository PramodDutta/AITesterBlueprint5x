package com.atb5x.salesforce.base;

import com.atb5x.salesforce.exceptions.FrameworkException;
import com.atb5x.salesforce.pages.LoginPage;
import io.qameta.allure.Allure;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebDriverException;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;
import org.testng.ITestResult;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeTest;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;
import java.util.Locale;
import java.util.Optional;
import java.util.Properties;

public abstract class BaseTest {

    private static final ThreadLocal<WebDriver> DRIVER = new ThreadLocal<>();
    private static final Properties CONFIG = new Properties();

    protected LoginPage loginPage;

    @BeforeTest(alwaysRun = true)
    public void loadConfiguration() throws FrameworkException {
        try (InputStream stream = BaseTest.class.getClassLoader().getResourceAsStream("config.properties")) {
            if (stream == null) {
                throw new FrameworkException("config.properties was not found on the test classpath");
            }
            CONFIG.load(stream);
        } catch (IOException e) {
            throw new FrameworkException("Unable to read config.properties", e);
        }
    }

    @BeforeMethod(alwaysRun = true)
    public void setUp() throws FrameworkException {
        boolean headless = Boolean.parseBoolean(config("headless"));
        DRIVER.set(createDriver(config("browser"), headless));
        try {
            getDriver().manage().timeouts().pageLoadTimeout(Duration.ofSeconds(Long.parseLong(config("page.load.timeout.seconds"))));
            if (!headless) {
                getDriver().manage().window().maximize();
            }
        } catch (WebDriverException e) {
            throw new FrameworkException("Unable to configure the browser session", e);
        }
        loginPage = new LoginPage(getDriver(), Duration.ofSeconds(Long.parseLong(config("explicit.wait.seconds"))));
        try {
            loginPage.open(config("base.url"));
        } catch (FrameworkException e) {
            attachFailureEvidence(getDriver(), "setUp");
            throw e;
        }
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown(ITestResult result) {
        WebDriver driver = DRIVER.get();
        if (driver == null) {
            return;
        }
        try {
            if (result.getStatus() == ITestResult.FAILURE) {
                attachFailureEvidence(driver, result.getMethod().getMethodName());
            }
        } finally {
            try {
                driver.quit();
            } catch (WebDriverException e) {
                Allure.addAttachment("Driver quit failure", e.getMessage());
            } finally {
                DRIVER.remove();
            }
        }
    }

    protected WebDriver getDriver() {
        return DRIVER.get();
    }

    protected String config(String key) throws FrameworkException {
        String value = System.getProperty(key, CONFIG.getProperty(key));
        if (value == null || value.isBlank()) {
            throw new FrameworkException("Missing configuration value for " + key);
        }
        return value.trim();
    }

    protected Optional<String> secret(String propertyKey, String environmentKey) {
        return Optional.ofNullable(System.getProperty(propertyKey))
                .or(() -> Optional.ofNullable(System.getenv(environmentKey)))
                .map(String::trim)
                .filter(value -> !value.isEmpty());
    }

    private WebDriver createDriver(String browser, boolean headless) throws FrameworkException {
        try {
            return switch (browser.toLowerCase(Locale.ROOT)) {
                case "chrome" -> {
                    ChromeOptions options = new ChromeOptions();
                    options.addArguments("--window-size=1920,1080");
                    if (headless) {
                        options.addArguments("--headless=new");
                    }
                    yield new ChromeDriver(options);
                }
                case "firefox" -> {
                    FirefoxOptions options = new FirefoxOptions();
                    options.addArguments("--width=1920", "--height=1080");
                    if (headless) {
                        options.addArguments("-headless");
                    }
                    yield new FirefoxDriver(options);
                }
                case "edge" -> {
                    EdgeOptions options = new EdgeOptions();
                    options.addArguments("--window-size=1920,1080");
                    if (headless) {
                        options.addArguments("--headless=new");
                    }
                    yield new EdgeDriver(options);
                }
                default -> throw new FrameworkException("Unsupported browser: " + browser);
            };
        } catch (WebDriverException e) {
            throw new FrameworkException("Unable to start " + browser + " browser session", e);
        }
    }

    private void attachFailureEvidence(WebDriver driver, String name) {
        try {
            byte[] screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BYTES);
            Allure.addAttachment(name + " failure screenshot", "image/png", new ByteArrayInputStream(screenshot), "png");
            Allure.addAttachment(name + " failure URL", driver.getCurrentUrl());
            Allure.addAttachment(name + " failure page source", "text/html", driver.getPageSource(), "html");
        } catch (WebDriverException e) {
            Allure.addAttachment(name + " evidence capture failure", e.getMessage());
        }
    }
}
