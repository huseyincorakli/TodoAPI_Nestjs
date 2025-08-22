import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto,SignInDto } from './dtos';
import * as argon from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService,private jwtService:JwtService,private config :ConfigService) {}

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
    
    const payload ={
      sub:_user.id,
      username:_user.username,
    }
    const token =  await this.jwtService.signAsync(payload,{
      secret:this.config.get('SECRET_KEY'),
      expiresIn:'15m'
    })
    return {access_token : token};


  }

  
}
