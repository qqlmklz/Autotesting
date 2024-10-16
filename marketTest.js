import { Builder, By } from "selenium-webdriver";
import { expect } from "chai";
import { HomePage } from "./homePage.js";
import { CatalogPage } from "./catalogPage.js";
import { takeScreenshot } from "./screrenshot.js";
import mocha from "mocha";
const { it, describe, after, before } = mocha;

describe("Yandex Market Test", function () {
  this.timeout(120000);
  let driver;
  let homePage;
  let catalogPage;

  before(async function () {
    driver = await new Builder()
      .forBrowser('chrome')
      .build();
    await driver.manage().window().maximize();
    homePage = new HomePage(driver);
    catalogPage = new CatalogPage(driver);
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it("should open Yandex Market homepage", async function () {
    const testName = this.test.fullTitle();
    try {
      await homePage.open("https://market.yandex.ru");
      await driver.sleep(10000);
      const title = await driver.getTitle();
      console.log("Opened Yandex Market homepage.");
      expect(title).to.include("Яндекс Маркет");
    } catch (error) {
      await takeScreenshot(driver, testName);
      throw error;
    }
  });

  it("should navigate to Notebooks section", async function () {
    const testName = this.test.fullTitle();

    try {
      await homePage.clickCatalogButton();
      console.log("Clicked on Catalog button.");
      await driver.sleep(3000);
      await homePage.waitForElement(homePage.electronicsLink);
      console.log("Electronics link is mounted.");
      await homePage.hoverElectronicsLink();
      console.log("Hovered over Electronics link.");
      await homePage.waitForElement(homePage.notebooksLink);
      await homePage.clickNotebooksLink();
      console.log("Clicked on Notebooks link.");
      await catalogPage.waitForElement(catalogPage.productTitles);
      const title = await driver.getTitle();
      console.log("Opened Notebooks section.");
      expect(title).to.include("Ноутбуки");
    } catch (error) {
      await takeScreenshot(driver, testName);
      throw error;
    }
  });

  it("should log first 5 products with their prices", async function () {
    const testName = this.test.fullTitle();

    try {
      const products = await catalogPage.getProductNamesAndPrices();
      console.log("First 5 products:");
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.title} - ${product.price}`);
      });
    } catch (error) {
      await takeScreenshot(driver, testName);
      throw error;
    }
  });

  it("should filter products by price range and verify", async function () {
    const testName = this.test.fullTitle();

    try {
      const minPrice = 60000;
      const maxPrice = 110000;
      await catalogPage.waitForElement(catalogPage.inputPriceFrom);
      await catalogPage.waitForElement(catalogPage.inputPriceTo);
      await catalogPage.setPriceRange(minPrice, maxPrice);
      console.log(`Set price range from ${minPrice} to ${maxPrice}.`);

      await driver.sleep(3000);

      const products = await catalogPage.getProductNamesAndPrices();
      console.log("Filtered products:");
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.title} - ${product.price}`);
        const price = parseInt(product.price.replace(/\D/g, ""));
        expect(price).to.be.at.least(minPrice);
        expect(price).to.be.at.most(maxPrice);
      });
    } catch (error) {
      await takeScreenshot(driver, testName);
      throw error;
    }
  });
});
