import { Page } from 'puppeteer';

export const clearBrowser = async (page: Page) => {
  const client = await page.target().createCDPSession();
  await client.send('Network.clearBrowserCookies');
  await client.send('Network.clearBrowserCache');
};
