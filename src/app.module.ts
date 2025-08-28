import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IpLoggerMiddleware } from './common/middlewares/ip-logger.middleware';
import {  ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { RateLimitGuard } from './common';

@Module({
  imports: [
    TodoModule,
    UserModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    ThrottlerModule.forRootAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>[{
        limit:config.get('RATE_LIMIT')!,
        ttl:config.get('RATE_LIMIT_TTL')!
      }]
    }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IpLoggerMiddleware).forRoutes('*');
  }
}
