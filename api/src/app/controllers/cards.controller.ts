import { Controller, Get, UseGuards } from '@nestjs/common';
import { Token } from '../decorators/token.decorator';
import { AuthGuard } from '../guards/auth.guard';
import { CardsService } from '../services/cards.service';

@Controller('v1/cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getCards(@Token() token: string) {
    return this.cardsService.getCardList(token);
  }
}
