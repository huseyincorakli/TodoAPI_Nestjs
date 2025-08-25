import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ClientIp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
     let ip =(
      request.ip ||
      request.headers['x-forwarded-for']?.split(',')[0] ||
      request.connection?.remoteAddress )as string;

      if (ip.startsWith('::ffff:')) {
        ip= ip.replace('::ffff:','')
      }
      
      
    return ip;
  },
);
