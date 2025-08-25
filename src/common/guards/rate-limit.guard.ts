import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const requestMap = new Map<string, { count: number; lastTime: number }>();

@Injectable()
export class RateLimitGuard implements CanActivate {
  private limit: number;
  private ttl: number;

  constructor(private configService: ConfigService) {
    this.limit = Number(this.configService.get('RATE_LIMIT')) || 5;
    this.ttl = Number(this.configService.get('RATE_LIMIT_TTL')) || 60000;
  }

  canActivate(context: ExecutionContext): boolean {
    
    const request = context.switchToHttp().getRequest();
    let ip = (request.ip ||
      request.headers['x-forwarded-for'] ||
      request.connection.remoteAddress) as string;

    if (ip.startsWith('::ffff')) ip = ip.replace(':::fff:', '');

    const now = Date.now();
    const record = requestMap.get(ip) || { count: 0, lastTime: now };

    if (now - record.lastTime > this.ttl) {
      record.count = 1;
      record.lastTime = now;
    } else {
      record.count += 1;
      if (record.count > this.limit) {
        throw new HttpException(
          'Too many request, slow down dude',
          HttpStatus.TOO_MANY_REQUESTS,
        );
      }
    }
    
    requestMap.set(ip, record);
    
    return true;
  }
}
