const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  
  console.log('Navigating to http://localhost:5173/...');
  await page.goto('http://localhost:5173/');
  
  console.log('Waiting a bit for React to render...');
  await page.waitForTimeout(2000);
  
  console.log('Scrolling down to trigger the PrototypeSection in-view animations...');
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  await page.waitForTimeout(2000);
  console.log('Done.');
  
  await browser.close();
})();
