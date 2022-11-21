import { Page, Protocol } from 'puppeteer';
import { decodeBase64 } from 'src/utils/base64';

export const setTokenToBrowser = async (
  token: string,
  page: Page,
): Promise<void> => {
  const cookies: Protocol.Network.Cookie[] = JSON.parse(decodeBase64(token));
  const allPromises = cookies.map((cookie) => page.setCookie(cookie));
  await Promise.all(allPromises);
};
