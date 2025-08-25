import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { EditUserDto } from './dtos';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UserController {
  constructor(private userService:UserService){}
  
  
  @Get('me')
  getMe(@GetUser('id') userId: string) {
    return this.userService.getMe(userId);
  }


  @Patch("edit-me")
  updateUser(@GetUser('id') userId:string,@Body() dto:EditUserDto){
    return this.userService.updateUser(userId,dto);
  }

  @Post("freeze-account")
  freeze(@GetUser("id") userId:string){
    return this.userService.freezeAccount(userId); 
  }

  @Post('delete-account')
  deleteAccount(@GetUser('id') userId:string){
    return this.userService.deleteAccount(userId);
  }
}
