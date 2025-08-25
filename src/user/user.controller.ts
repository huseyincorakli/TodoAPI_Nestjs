import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { EditUserDto } from './dtos';
import { UserService } from './user.service';
import { ClientIp } from './decorator';

@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getMe(@ClientIp() ip, @GetUser('id') userId: string) {
    const user = await this.userService.getMe(userId);

    return {
       ...user,
      ip,
    };
  }

  @Patch('edit-me')
  updateUser(@GetUser('id') userId: string, @Body() dto: EditUserDto) {
    return this.userService.updateUser(userId, dto);
  }

  @Post('freeze-account')
  freeze(@GetUser('id') userId: string) {
    return this.userService.freezeAccount(userId);
  }

  @Post('delete-account')
  deleteAccount(@GetUser('id') userId: string) {
    return this.userService.deleteAccount(userId);
  }
}
