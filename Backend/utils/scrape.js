const puppeteer = require("puppeteer");

exports.webScrape = async (url) => {
  const browser = await puppeteer.launch({
    // headless: false,
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });
  // await page.waitForSelector("div.Body section  ");
  // console.log("Stills loaded");
  // const context = await page.$eval("ul.list-quotes li", (el) => el.innerText);
  const context = await page.evaluate(() => {
    const quotes = document.querySelectorAll(".list-quotes li");

    return Array.from(quotes).map((quote) => {
      const text = quote.querySelector("p").innerText;
      const author = quote.querySelector("div.author").innerText;
      return { text, author };
    });
    // const quotesArray = Array.from(quotes.children);
    // const quotesText = quotesArray.map((quote) => quote.innerText);
  });
  // const strippedContext = context.replace(/\s+/g, " ").trim();
  return context;
  // return strippedContext;
  // await page.screenshot({ path: "screenshot.png" });
  // await browser.close();
};
