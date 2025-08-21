import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto,SignInDto } from './dtos';
import * as argon from 'argon2'

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signUp(dto:SignUpDto){
    const _hash = await argon.hash(dto.password);
   try {
     const {hash,...user} = await this.prisma.user.create({
      data:{
        hash:_hash,
        username:dto.username,
        fullname:dto.fullname
      }
    })
    return user;

   } catch (error) {
    if(error.code =='P2002'){
      throw new ForbiddenException('Credentials taken')
    }
    throw new BadRequestException('CREATE USER ERROR')            
   }
  }


  async signIn(dto:SignInDto){
    const user = await this.prisma.user.findUnique({
      where:{username:dto.username}
    })

    if(!user) throw new ForbiddenException('Credentials incorrect');
    
    const passwordMatch = await argon.verify(user.hash,dto.password);
    if(!passwordMatch) throw new ForbiddenException('Credentials incorrect');

    const {hash,..._user} = user;
    
    return _user;
  }
}
