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
    // const quotes = document.querySelectorAll(".list-quotes li");

    return Array.from(quotes).map((quote) => {
      const text = quote.querySelector("p").innerText;
      const author = quote.querySelector("div.author").innerText;
      return { text, author };
    });
  });
  return context;
};

// app.get("/savePara", async (req, res) => {
//   const url = "https://www.azquotes.com/top_quotes.html";

//   try {
//     const content = await webScrape(url);
//     const quotesArray = content.map((quote) => ({
//       // Create a new Paragraph instance and save to MongoDB
//       text: quote.text,
//       author: quote.author,
//     }));
//     // console.log(quotesArray[0]);
//     const para = new Paragraph({
//       genre: {
//         quotes: quotesArray,
//       },
//     });

//     await para.save();
//     res.status(200).json({ message: "Saved on database" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: "Error during web scraping" });
//   }
// });
