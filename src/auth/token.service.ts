import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuid } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { TokenType } from '@prisma/client';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TokenService {
   private readonly logger = new Logger(TokenService.name);
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  async signToken(userId: string, username: string) {
    await this.revokeUserToken(userId)
    const accessJti = uuid();
    const refreshJti = uuid();
    const now = new Date();
    const accessExpiresAt = new Date(now.getTime() + 15 * 60 * 1000);
    const refreshExpiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, username, jti: accessJti,type:'access' },
      {
        expiresIn: '15m',
        secret: this.config.get('SECRET_KEY'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, username, jti: refreshJti,type:'refresh'  },
      {
        expiresIn: '7d',
        secret: this.config.get('RT_SECRET_KEY'),
      },
    );

     await this.prisma.token.createMany({
      data: [
        {
          jti: accessJti,
          userId,
          type: TokenType.ACCESS,
          expiresAt: accessExpiresAt,
        },
        {
          jti: refreshJti,
          userId,
          type: TokenType.REFRESH,
          expiresAt: refreshExpiresAt,
        },
      ],
    });


    return { accessToken, refreshToken };
  }


  async validateToken(jti:string,type:TokenType){
    const token = await this.prisma.token.findFirst({
      where:{
        jti,
        type,
        revoked:false,
        expiresAt:{
          gt:new Date()
        }
      }
    })
    
    return token!=null;
  }

    async revokeUserToken(userId: string) {
     await this.prisma.token.updateMany({
      where: {
        userId: userId,
      },
      data: {
        revoked: true,
      },
    });

    await this.prisma.token.deleteMany({
      where:{AND:[{userId},{revoked:true}]},
    })
  }


  async verifyToken(token:string,type:TokenType){
    let secret="";
    if(type==TokenType.ACCESS){
      secret= this.config.get('SECRET_KEY')!
    }
    else{
      secret= this.config.get('RT_SECRET_KEY')!
    }

    
    
   return await this.jwtService.verify(token,{
      secret
    })
  }


  async cleanExpiredAndRevokedTokens(){
  const nowUTC = new Date().toISOString();
   await this.prisma.token.deleteMany({
    where: {
      OR: [
        {
          expiresAt: {
            lt: nowUTC
          }
        },
        {
          revoked: true
        }
      ]
    }
  });
  }

   @Cron('*/1 * * * *')
  async handleCron() {
   try {
   await this.cleanExpiredAndRevokedTokens()
   this.logger.log('EXPIRED AND REVOKED TOKENS REMOVED')
   } catch (error) {
   this.logger.log('ERROR WHILE EXPIRED AND REVOKED TOKENS REMOVING')
    
   }
  }

}
