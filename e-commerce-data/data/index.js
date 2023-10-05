const puppeteer = require("puppeteer");

const URL = "https://www.thegioididong.com/laptop-msi";

const getQuotes = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  // Open a new page
  const page = await browser.newPage();

  // On this new page:
  await page.goto(URL, {
    waitUntil: "domcontentloaded",
  });

  // Get page data
  const products = await page.evaluate(() => {
    // Fetch the first element with class "quote"
    const productsList = document.querySelectorAll(".__cate_44");

    return Array.from(productsList).map((product) => {
      const name = product.querySelector("a > h3").innerText;
      const price = product.querySelector("a > strong").innerText;
      return { name, price };
    });
  });

  // Display the quotes
  console.log(products);

  await page.click(".container-productbox > .view-more > a");

  // Close the browser
  // await browser.close();
};

// Start the scraping
getQuotes();
