import { Injectable } from '@nestjs/common';
import { InjectBrowser } from 'nest-puppeteer';
import { Browser } from 'puppeteer';
import { encodeBase64 } from 'src/utils/base64';
import { clearBrowser } from 'src/utils/clear-browser';
import { LoginRequest, LoginResponse } from '../models/login.model';

@Injectable()
export class AccountService {
  constructor(@InjectBrowser() private readonly browser: Browser) {}

  async login(model: LoginRequest): Promise<LoginResponse> {
    const context = await this.browser.createIncognitoBrowserContext();
    const response = <LoginResponse>{};
    const page = await context.newPage();
    await clearBrowser(page);

    await page.goto('https://www.ov-chipkaart.nl/my-ov-chip.htm', {
      waitUntil: 'networkidle0',
    });

    await page.waitForNavigation();

    const usernameTxt = await page.waitForSelector('#username');
    await usernameTxt.type(model.username);

    const passwordTxt = await page.waitForSelector('#password');
    await passwordTxt.type(model.password);

    const rememberMe = await page.waitForSelector('#chkRemember');
    await rememberMe.click();

    await page.screenshot({
      path: 'screenshots/login-1.png',
    });

    const loginForm = await page.waitForSelector('#login-form');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    loginForm.evaluate((form) => form.submit());

    await page.waitForNavigation();

    const content = await page.content();

    const hasError = content.indexOf('alert alert-info') > -1;
    if (hasError) {
      response.error =
        content.indexOf(
          'De combinatie van gebruikersnaam en wachtwoord is niet bekend.',
        ) > -1
          ? 'Invalid username or password'
          : 'Your account was blocked. You need to check it';
    }

    response.isSuccess = !hasError;

    const cookies = await page.cookies();

    response.token = !hasError ? encodeBase64(JSON.stringify(cookies)) : '';

    await context.close();

    return response;
  }
}
