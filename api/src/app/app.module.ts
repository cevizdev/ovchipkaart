import { Module } from '@nestjs/common';
import { BalanceController } from './controllers/balance.controller';
import { BalanceService } from './services/balance.service';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';
import { CardsController } from './controllers/cards.controller';
import { CardsService } from './services/cards.service';
import { HistoryController } from './controllers/history.controller';
import { HistoryService } from './services/history.service';
import { PlaywrightModule } from 'nestjs-playwright';

@Module({
  imports: [
    PlaywrightModule.forRoot({
      headless: true,
      isGlobal: true,
      executablePath: process.env.CHROME_BIN,
    }),
    PlaywrightModule.forFeature(),
  ],
  controllers: [
    AccountController,
    BalanceController,
    CardsController,
    HistoryController,
  ],
  providers: [AccountService, BalanceService, CardsService, HistoryService],
})
export class AppModule {}
