import { Builder, By } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { path as chromedriverPath } from 'chromedriver';
import { strict as assert } from 'assert';

async function waitForElement(driver, locator) {
  await driver.wait(async () => {
    const elements = await driver.findElements(locator);
    return elements.length > 0;
  }, 20000);
}

const locators = {
  pageTitle: By.xpath("//title"),
  remainingTasks: By.xpath("//*[text()='5 of 5 remaining']"),
  inputBoxes: By.xpath("//li/span[@class='done-false']/preceding::input"),
  newItemInput: By.xpath("//input[@id='sampletodotext']"),
  addItemButton: By.xpath("//input[@id='addbutton']"),
  updatedRemainingTasks: By.xpath("//*[text()='1 of 6 remaining']"),
  newItemCheckbox: By.xpath("//li[last()]/input[@type='checkbox']")
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('LambdaTest Sample To-Do App', function () {
  let driver;

  before(async function () {
    const serviceBuilder = new chrome.ServiceBuilder(chromedriverPath);
    driver = await new Builder().forBrowser('chrome').setChromeService(serviceBuilder).build();
  });

  after(async function () {
    await driver.quit();
  });

  it('should load the LambdaTest sample to-do app and verify the title', async function () {
    await driver.get('https://lambdatest.github.io/sample-todo-app/');
    await sleep(200);

    await waitForElement(driver, locators.pageTitle);
    const title = await driver.getTitle();
    assert.equal(title, 'Sample page - lambdatest.com', 'Page title is incorrect');
    console.log('Success correct page title:', title);
  });

  it('should verify that there are 5 tasks remaining and mark them as complete', async function () {
    await sleep(200);

    await waitForElement(driver, locators.remainingTasks);
    console.log('Success 5 of 5 remaining text');

    await sleep(200);

    const inputBoxes = await driver.findElements(locators.inputBoxes);
    assert.equal(inputBoxes.length, 5, 'Failed to get all 5 checkboxes');
    console.log('Success getting all 5 input boxes:', inputBoxes.length);

    for (let i = 0; i < inputBoxes.length; ++i) {
      await inputBoxes[i].click();
      console.log(`Clicked checkbox number ${i + 1}`);

      await sleep(200);

      await waitForElement(driver, By.xpath(`//li[${i + 1}]/span[@class='done-true']`));
      console.log(`Checkbox ${i + 1} marked successfully`);

      await waitForElement(driver, By.xpath(`//*[text()='${5 - 1 - i} of 5 remaining']`));
      console.log(`Remaining tasks updated correctly to ${5 - 1 - i}`);
    }
  });

  it('should add a new task and verify the remaining tasks updated', async function () {
    await sleep(200);

    await waitForElement(driver, locators.newItemInput);
    await driver.findElement(locators.newItemInput).sendKeys("New item");
    console.log('Success entering new item');

    await driver.findElement(locators.addItemButton).click();
    console.log('Success adding new item');

    await sleep(200);

    await waitForElement(driver, locators.updatedRemainingTasks);
    console.log('Success checking if number of elements increased');

    const newItemCheckbox = await driver.findElement(locators.newItemCheckbox);
    await newItemCheckbox.click();
    console.log('Success clicking on checkbox for new item');
  });
});
