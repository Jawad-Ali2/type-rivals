const puppeteer = require("puppeteer");

exports.webScrape = async (url) => {
  const browser = await puppeteer.launch({
    // headless: false,
  });
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });
  const context = await page.evaluate(() => {
    const quotes = document.querySelectorAll(".list-quotes li");

    return Array.from(quotes).map((quote) => {
      const text = quote.querySelector("p").innerText;
      const author = quote.querySelector("div.author").innerText;
      return { text, author };
    });
  });
  return context;
};
