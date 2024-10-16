const { Builder, By } = require('selenium-webdriver');
const assert = require('assert');

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
  updatedRemainingTasks: By.xpath("//*[text()='1 of 6 remaining']")
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function lambdaTest() {
  const driver = await new Builder().forBrowser('chrome').build();

  try {
    await driver.get('https://lambdatest.github.io/sample-todo-app/');

    await sleep(200);

    await waitForElement(driver, locators.pageTitle);
    const title = await driver.getTitle();
    assert.equal(title, 'Sample page - lambdatest.com', 'Page title is incorrect');
    console.log('Success correct page title');

    await sleep(200);

    await waitForElement(driver, locators.remainingTasks);
    console.log('Success 5 of 5 remaining text');

    await sleep(200);

    await waitForElement(driver, locators.inputBoxes);
    const inputBoxes = await driver.findElements(locators.inputBoxes);
    assert.equal(inputBoxes.length, 5, 'Failed getting uncrossed checkboxes');
    console.log('Success getting all 5 input boxes');
    await sleep(200);

    for (let i = 0; i < inputBoxes.length; ++i) {
      await inputBoxes[i].click();
      console.log(`Success clicking on checkbox number ${i + 1}`);

      await sleep(200);

      await waitForElement(driver, By.xpath(`//li[${i + 1}]/span[@class='done-true']/preceding::input`));
      console.log('Success checking if the clicked element is crossed');

      await sleep(200);

      await waitForElement(driver, By.xpath(`//*[text()='${5 - 1 - i} of 5 remaining']`));
      console.log('Success checking if number decreased');
    }

    await sleep(200);
    await waitForElement(driver, locators.newItemInput);
    await driver.findElement(locators.newItemInput).sendKeys("New item");
    console.log('Success adding new list item');
    await sleep(200);

    await driver.findElement(locators.addItemButton).click();
    console.log('Success submitting new item');

    await sleep(200);

    await waitForElement(driver, locators.updatedRemainingTasks);
    console.log('Success checking if number of elements increased');

  } catch (error) {
    await driver.takeScreenshot().then(function(image) {
      require('fs').writeFileSync('screenshot_error.png', image, 'base64');
    });
    console.error(error);
  } finally {
    console.log('Closing browser');
    await driver.quit();
  }
}

lambdaTest();