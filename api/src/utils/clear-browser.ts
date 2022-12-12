import { Page } from 'playwright';

export const clearBrowser = async (page: Page) => {
  const client = await page.context().newCDPSession(page);
  await client.send('Network.clearBrowserCookies');
  await client.send('Network.clearBrowserCache');
};
