import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { Module } from '@nestjs/common';
import { JwtStrategy } from './strategy';
import { TokenService } from './token.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [JwtModule.register({}),ScheduleModule.forRoot()],
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy,TokenService],
})
export class AuthModule {}
