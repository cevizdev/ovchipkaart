import { Injectable } from '@nestjs/common';
import { InjectBrowser } from 'nest-puppeteer';
import { Browser } from 'puppeteer';
import { setTokenToBrowser } from '../guards/auth-browser';
import { Card } from '../models/card.model';

@Injectable()
export class CardsService {
  constructor(@InjectBrowser() private readonly browser: Browser) {}
  async getCardList(token: string): Promise<Card[]> {
    const context = await this.browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    await setTokenToBrowser(token, page);

    await page.goto('https://www.ov-chipkaart.nl/my-ov-chip/my-cards.htm', {
      waitUntil: 'networkidle2',
    });

    await page.screenshot({
      path: 'screenshots/cards-1.png',
    });

    const table = await page.waitForSelector('#kaartenoverzicht');

    const cardNames = await table.evaluate(() =>
      Array.from(
        document.querySelectorAll('#kaartenoverzicht > tbody > tr'),
        (el) => el.querySelector('.alias').textContent,
      ),
    );

    const cardNumbers = await table.evaluate(() =>
      Array.from(
        document.querySelectorAll('#kaartenoverzicht > tbody > tr'),
        (el) => el.querySelector('.mediumid').textContent,
      ),
    );

    const cardTypes = await table.evaluate(() =>
      Array.from(
        document.querySelectorAll('#kaartenoverzicht > tbody > tr'),
        (el) => el.querySelector('.profile').textContent,
      ),
    );

    const cards = cardNumbers.map(
      (c, i) =>
        <Card>{
          name: cardNames[i].trim(),
          number: c.trim(),
          type: cardTypes[i].trim(),
        },
    );

    await page.screenshot({
      path: 'screenshots/cards-1.png',
    });

    await context.close();

    return cards;
  }
}
