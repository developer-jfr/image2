const puppeteer = require("puppeteer-extra");
const fs = require("fs");
let investors_json = require("./data/job1.json");
const path = require("path");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

let scrape = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 10,
  });

  const page = await browser.newPage();

  let results;
  for (let i = 0, total_urls = investors_json.length; i < total_urls; i++) {
    try {
      await page.goto(investors_json[i].URL);
      let image = await page?.evaluate(
        () =>
        document.querySelector('#work > div:nth-child(4) > div.container.product-header > div > div.col-sm-7.left-col > div.product-image-holder > div.product-image > div.product-img-carousel.as-carousel > ul > li.active > div > img')?.src
      ) || '';

      let results = {
        SKU: investors_json[i].SKU,
        Artist: investors_json[i].Artist,
        Title: investors_json[i].Title,
        URL: investors_json[i].URL,
        "Image Link": image ,
      };

      let data = JSON.parse(await fs.readFileSync("./data/job2.json"));

      data.push(results);

      fs.writeFileSync("./data/job2.json", JSON.stringify(data, null, 2));
    } catch (e) {
      console.log(e);
    }
  }

  return results;
};

scrape().then((value) => {
  console.log(value);
});
