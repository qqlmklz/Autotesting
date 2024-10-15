import BasePage from "./basePage.js";
import { By, Key, until } from "selenium-webdriver";

const URL_POLYTECH = "https://mospolytech.ru/";
const URL_SCHEDULE = "https://rasp.dmami.ru/";
const XPATH_SCHEDULE = '//a[@title="Расписание"]';
const XPATH_SCHEDULE_PAGE = '//a[@href="https://rasp.dmami.ru/"]';
const XPATH_GROUP_INPUT = '//input[@class="groups"]';
const XPATH_GROUP_SCHEDULE = '//div[@id="221-322"]';
const XPATH_SCHEDULE_WEEK = '//div[@class="schedule-week"]/child::div';
const GROUP_NUMBER = "221-322";

class polytechPage extends BasePage {
  async open() {
    await this.goToUrl(URL_POLYTECH);
  }

  async openPageToSchedule() {
    await this.click(By.xpath(XPATH_SCHEDULE));
    await driver.wait(until.elementLocated(By.xpath(XPATH_SCHEDULE_PAGE)), 2000);
  }

  async openSchedulePage() {
    this.originalWindow = await driver.getWindowHandle();
    await this.click(By.xpath(XPATH_SCHEDULE_PAGE));
    await driver.sleep(1000);
  }

  async enterGroup() {
    const windows = await driver.getAllWindowHandles();
    for (const handle of windows) {
      if (handle !== this.originalWindow) {
        await driver.switchTo().window(handle);
      }
    }
    await this.enterText(By.xpath(XPATH_GROUP_INPUT), GROUP_NUMBER);
    await driver
      .findElement(By.xpath(XPATH_GROUP_INPUT))
      .sendKeys(Key.ENTER);
  }

  async toGroupSchedule() {
    await this.click(By.xpath(XPATH_GROUP_SCHEDULE));
  }

  async colorCurrentDay() {
    let days = await driver.findElements(By.xpath(XPATH_SCHEDULE_WEEK));
    let thisDayIndex = new Date().getDay() - 1;
    let thisDay = days[thisDayIndex];
    return (
      (await thisDay.getAttribute("class")) ===
      "schedule-day schedule-day_today"
    );
  }
}

export default polytechPage;
