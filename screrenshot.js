import fs from "fs";

export async function takeScreenshot(driver, testName) {
  let screenshot = await driver.takeScreenshot();
  let filename = `${testName}-${new Date().toISOString().replace(/:/g, "-")}.png`;
  fs.writeFileSync(filename, screenshot, "base64");
}
