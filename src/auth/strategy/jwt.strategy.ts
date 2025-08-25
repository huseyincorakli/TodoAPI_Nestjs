import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { TokenService } from '../token.service';
import { TokenType } from '@prisma/client';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy,'jwt') {
  
  constructor(config: ConfigService,private prisma:PrismaService,private tokenService:TokenService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('SECRET_KEY')!,
    });


  }

  async validate(payload:any) {
    
   const user = await this.prisma.user.findUnique({where:{
      id:payload.sub
    }})

    if(!user) throw new UnauthorizedException("Unauthorized jwt")
    
    const isValid = await this.tokenService.validateToken(payload.jti,TokenType.ACCESS);
    
    if (!isValid) throw new UnauthorizedException('Token revoked or expired');
    

    const {hash,refreshToken,...result} = user
    
    
   return result;
  }
}