import groupPage from "./polPage.js"; // Изменено на import
import { assert } from "chai";

describe("Тест расписания", () => {
  const gp = new groupPage();

  before(async function () {
    this.timeout(100000);
    console.log("Открываю главную страницу...");
    await gp.open();
    console.log("Главная страница открыта.");
  });

  after(async function () {
    this.timeout(100000);
    await gp.closeBrowser();
  });

  it("Открывается страница на ссылку с расписанием", async () => {
    await gp.openPageToSchedule();
  });

  it("Открывается страница расписания", async () => {
    await gp.openSchedulePage();
  });

  it("Ввести номер группы", async () => {
    await gp.enterGroup();
  });

  it("Открывается страница расписания выбранной группы", async () => {
    await gp.toGroupSchedule();
  });

  it("Текущий день недели выделен цветом", async () => {
    assert.equal(await gp.colorCurrentDay(), true);
  });
});
