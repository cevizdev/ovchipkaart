import { Injectable } from '@nestjs/common';
import { InjectBrowser } from 'nest-puppeteer';
import { Browser } from 'puppeteer';
import { clearBrowser } from 'src/utils/clear-browser';
import { setTokenToBrowser } from '../guards/auth-browser';
import { Card } from '../models/card.model';

@Injectable()
export class CardsService {
  constructor(@InjectBrowser() private readonly browser: Browser) {}
  async getCardList(token: string): Promise<Card[]> {
    const context = await this.browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await clearBrowser(page);

    await setTokenToBrowser(token, page);

    await page.goto('https://www.ov-chipkaart.nl/my-ov-chip/my-cards.htm', {
      waitUntil: 'networkidle0',
    });

    const table = await page.waitForSelector('#kaartenoverzicht');

    const cards = await table.evaluate(() =>
      Array.from(
        document.querySelectorAll('#kaartenoverzicht > tbody > tr'),
        (el) =>
          <Card>{
            name: el.querySelector('.alias').textContent.trim(),
            number: el.querySelector('.mediumid').textContent.trim(),
            type: el.querySelector('.profile').textContent.trim(),
          },
      ),
    );

    await context.close();

    return cards;
  }
}
