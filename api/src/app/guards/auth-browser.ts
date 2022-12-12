import { Page, Cookie } from 'playwright';
import { decodeBase64 } from 'src/utils/base64';

export const setTokenToBrowser = async (
  token: string,
  page: Page,
): Promise<void> => {
  const cookies: Cookie[] = JSON.parse(decodeBase64(token));
  await page.context().addCookies(cookies);
};
