import type { Browser } from 'puppeteer';
import { Injectable } from '@nestjs/common';
import { InjectBrowser } from 'nest-puppeteer';
import { clearBrowser } from 'src/utils/clear-browser';
import { setTokenToBrowser } from '../guards/auth-browser';

@Injectable()
export class BalanceService {
  constructor(@InjectBrowser() private readonly browser: Browser) {}

  async getBalance(number: string, token: string): Promise<{ value: string }> {
    const context = await this.browser.createIncognitoBrowserContext();

    const page = await context.newPage();
    await clearBrowser(page);

    if (token) {
      await setTokenToBrowser(token, page);
    }

    await page.goto('https://www.ov-chipkaart.nl/home.htm#/', {
      waitUntil: 'networkidle0',
    });

    const inputEl = await page.waitForSelector('#mediumInput');
    await inputEl.type(number);

    const formEl = await page.waitForSelector(
      '#saldocheckerlink > div > div > div > div > form',
    );

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await formEl.evaluate((el) => el.submit());

    await page.waitForNavigation({
      waitUntil: 'networkidle0',
    });

    const priceEl = await page.waitForSelector(
      '#saldochecker > div > div > div > div > div.flex-row.main.wrap > div.flex-row-cell.f1.left > div.creditInformationView > div.flex-row.amount > div > div > span',
    );

    const value = await priceEl.evaluate((el) => el.textContent);
    await page.screenshot({
      path: 'screenshots/balance-1.png',
    });
    await context.close();

    return { value };
  }

  formatCardNumber(number: string): string {
    number = number.trim().replace(/ /g, '');
    return `${number.substring(0, 4)} ${number.substring(
      4,
      8,
    )} ${number.substring(8, 12)} ${number.substring(12, 16)}`;
  }
}
