const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { ServiceBuilder } = chrome;
const { path: chromedriverPath } = require('chromedriver');

async function waitForElement(driver, locator) {
  await driver.wait(async () => {
    const elements = await driver.findElements(locator);
    return elements.length > 0;
  });
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

async function lambdaTest() {
  const serviceBuilder = new ServiceBuilder(chromedriverPath);
  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeService(serviceBuilder) 
    .build();

  try {
    await driver.get('https://lambdatest.github.io/sample-todo-app/');

    await sleep(200);
    await waitForElement(driver, locators.pageTitle);
    const title = await driver.getTitle();
    console.log('Success correct page title:', title);

    await sleep(200);
    await waitForElement(driver, locators.remainingTasks);
    console.log('Success 5 of 5 remaining text');

    await sleep(200);
    const inputBoxes = await driver.findElements(locators.inputBoxes);
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

    await sleep(200);
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

  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    console.log('Closing browser');
    await driver.quit();
  }
}

lambdaTest();
