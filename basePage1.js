
import pkg from "selenium-webdriver";
const { until, Actions } = pkg;
export class BasePage {
  constructor(driver) {
    this.driver = driver;
  }

  async open(url) {
    await this.driver.get(url);
  }

  async click(locator) {
    await this.driver.findElement(locator).click();
  }

  async hover(locator) {
    let elementToHover = await this.driver.findElement(locator);
    await this.driver
      .actions({ bridge: true })
      .move({ origin: elementToHover })
      .perform();
  }

  async type(locator, text) {
    await this.driver.findElement(locator).sendKeys(text);
  }

  async waitForElement(locator, timeout = 100000) {
    await this.driver.wait(until.elementLocated(locator), timeout);
  }

  async getElement(locator) {
    return await this.driver.findElement(locator);
  }

  async getAllElements(locator) {
    return await this.driver.findElements(locator);
  }
}
