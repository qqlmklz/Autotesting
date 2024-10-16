import { By } from "selenium-webdriver";
import { BasePage } from "./basePage1.js";

export class HomePage extends BasePage {
  constructor(driver) {
    super(driver);
    this.catalogButton = By.xpath('//div[@data-zone-name="catalog"]');
    this.electronicsLink = By.xpath(
      '//li[@data-zone-data=\'{"id":"97009095"}\']'
    );
    this.notebooksLink = By.xpath(
      '//a[@href="/catalog--noutbuki/26895412/list?hid=91013"]'
    );
  }

  async clickCatalogButton() {
    await this.click(this.catalogButton);
  }
  async hoverElectronicsLink() {
    await this.hover(this.electronicsLink);
  }
  async clickNotebooksLink() {
    await this.click(this.notebooksLink);
  }
}