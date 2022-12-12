import { Injectable } from '@nestjs/common';
import { InjectBrowser } from 'nestjs-playwright';
import { Browser } from 'playwright';
import { setTokenToBrowser } from '../guards/auth-browser';
import { Card } from '../models/card.model';
import { History } from '../models/history.model';

@Injectable()
export class HistoryService {
  constructor(@InjectBrowser() private readonly browser: Browser) {}

  async getHistory(number: string, token: string): Promise<History[]> {
    const context = await this.browser.newContext();
    const page = await context.newPage();

    await setTokenToBrowser(token, page);

    await page.goto(
      'https://www.ov-chipkaart.nl/my-ov-chip/my-travel-history.htm',
      {
        waitUntil: 'networkidle',
      },
    );

    const cardListEl = await page.waitForSelector('#ol_cardselector');
    const cards = await cardListEl.evaluate(() =>
      Array.from(
        document.querySelectorAll('li > div > div > span.cs-card-number'),
        (el) =>
          <Card>{
            id: el.getAttribute('data-hashed'),
            number: el.textContent.trim(),
          },
      ),
    );

    const selectedCard = cards.filter((c) => c.number === number)[0];

    await page.goto(
      `https://www.ov-chipkaart.nl/my-ov-chip/my-travel-history.htm?mediumid=${selectedCard.id}#selected-card`,
      {
        waitUntil: 'networkidle',
      },
    );

    const table = await page.waitForSelector(
      '#content > div > div.transaction-overview > table > tbody',
    );

    const histories = await table.evaluate(() =>
      Array.from(
        document.querySelectorAll('.known-transaction'),
        (el) =>
          <History>{
            id: el
              .querySelector('td:nth-child(4) > input')
              .getAttribute('transactionid'),
            date: el.querySelector('td:nth-child(1)').textContent,
            transactionDetail: el.querySelector('td:nth-child(2)').textContent,
            fare: el.querySelector('td:nth-child(3)').textContent,
          },
      ),
    );

    await context.close();

    return histories;
  }
}
