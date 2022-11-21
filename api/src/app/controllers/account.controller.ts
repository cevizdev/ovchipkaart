import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequest, LoginResponse } from '../models/login.model';
import { AccountService } from '../services/account.service';

@Controller('v1/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post('login')
  async login(@Body() loginRequest: LoginRequest): Promise<LoginResponse> {
    return await this.accountService.login(loginRequest);
  }
}
