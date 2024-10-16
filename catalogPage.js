import { By } from "selenium-webdriver";
import { BasePage } from "./basePage1.js";

export class CatalogPage extends BasePage {
  constructor(driver) {
    super(driver);
    this.productTitles = By.xpath('//span[@data-auto="snippet-title"]');
    this.productPrices = By.xpath(
      '//span[@data-auto="snippet-price-current"]/span[1]'
    );
    this.inputPriceFrom = By.xpath(
      '//div[@data-auto="filter-range-glprice"]/div/div[1]/span/div/div/input'
    );
    this.inputPriceTo = By.xpath(
      '//div[@data-auto="filter-range-glprice"]/div/div[2]/span/div/div/input'
    );
  }

  async getProductNamesAndPrices(limit = 5) {
    const titles = await this.getAllElements(this.productTitles);
    const prices = await this.getAllElements(this.productPrices);
    const products = [];

    for (let i = 0; i < Math.min(limit, titles.length, prices.length); i++) {
      const titleText = await titles[i].getText();
      const priceText = await prices[i].getText();
      products.push({ title: titleText, price: priceText });
    }

    return products;
  }

  async setPriceRange(minPrice, maxPrice) {
    console.log(this.elements);
    await this.type(this.inputPriceFrom, minPrice);
    await this.type(this.inputPriceTo, maxPrice);
  }
}