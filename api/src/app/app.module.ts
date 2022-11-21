import { Module } from '@nestjs/common';
import { BalanceController } from './controllers/balance.controller';
import { BalanceService } from './services/balance.service';
import { PuppeteerModule } from 'nest-puppeteer';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';
import { CardsController } from './controllers/cards.controller';
import { CardsService } from './services/cards.service';

@Module({
  imports: [
    PuppeteerModule.forRoot(
      {
        pipe: true,
        ignoreDefaultArgs: ['--proxy-server=socks5://127.0.0.1:9050'],
      }, // optional, any Puppeteer launch options here or leave empty for good defaults */,
    ),
    PuppeteerModule.forFeature(),
  ],
  controllers: [AccountController, BalanceController, CardsController],
  providers: [AccountService, BalanceService, CardsService],
})
export class AppModule {}
