
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class IpLoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const { method, originalUrl, ip } = req;
    console.log(`[${new Date().toISOString()}] ${method} ${originalUrl} - IP: ${ip?.replace('::ffff:','')}`);
    
    
    next();
  }
}
