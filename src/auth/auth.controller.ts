import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dtos';
import { RefreshDto } from './dtos/refresh.dto';
import { GetUser } from './decorator/get-user.decorator';
import { JwtGuard } from './guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
   signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  signIn(@Body() dto:SignInDto){
    return this.authService.signIn(dto);
  }

   @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto:RefreshDto) {
    return this.authService.refresh(dto.refreshToken)
  }


  @Get('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT-auth')
  async logout(@GetUser("id") userId:string){
   return await this.authService.logout(userId)
  }
  
}
