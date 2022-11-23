import { Controller, Get, Param } from '@nestjs/common';
import { Token } from '../decorators/token.decorator';
import { HistoryService } from '../services/history.service';

@Controller('v1/history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}
  @Get(':number')
  async getHistory(@Param('number') number: string, @Token() token: string) {
    return await this.historyService.getHistory(number, token);
  }
}
