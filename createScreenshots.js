const puppeteer = require("puppeteer");
const path = require("path");
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--window-size=1600,1600`],
  });
  for (let width of [300, 600, 960,1200]) {
    const [page] = await browser.pages();
    await page.setViewport({ width: width, height: width });
    await page.goto(process.env.PUBLIC_URL);
    await page.waitForResponse(`${process.env.PUBLIC_URL}/api/user`);
    await page.waitForResponse(`${process.env.PUBLIC_URL}/api/skills`);
    await page.waitForResponse(
      `${process.env.PUBLIC_URL}/api/projects?first=10`,
      {
        timeout: 5000,
      }
    );
    await page.waitForTimeout(1000);
    await page.screenshot({
      type: "png",
      path: path.join(process.cwd(), "public", `preview-${width}.png`),
    });
  }
  await browser.close();
})();
