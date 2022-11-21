import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      return '';
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return '';
    }
    return token;
  },
);
