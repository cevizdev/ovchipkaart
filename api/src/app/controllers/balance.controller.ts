import { Controller, Get, Query } from '@nestjs/common';
import { Token } from '../decorators/token.decorator';
import { BalanceService } from '../services/balance.service';

@Controller('v1/balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get('check')
  async checkBalance(
    @Token() token: string,
    @Query('number') number: string,
  ): Promise<{ value: string }> {
    return await this.balanceService.getBalance(
      this.balanceService.formatCardNumber(number),
      token,
    );
  }
}
