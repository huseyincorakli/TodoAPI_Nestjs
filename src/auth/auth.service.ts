import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto, SignInDto } from './dtos';
import * as argon from 'argon2';
import { TokenService } from './token.service';
import { TokenType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private tokenService: TokenService,
  ) {}

  async signUp(dto: SignUpDto) {
    const _hash = await argon.hash(dto.password);
    try {
      const { hash, ...user } = await this.prisma.user.create({
        data: {
          hash: _hash,
          username: dto.username,
          fullname: dto.fullname,
        },
      });
      return user;
    } catch (error) {
      if (error.code == 'P2002') {
        throw new ForbiddenException('Credentials taken');
      }
      throw new BadRequestException('CREATE USER ERROR');
    }
  }

  async signIn(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: dto.username },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const passwordMatch = await argon.verify(user.hash, dto.password);
    if (!passwordMatch) throw new ForbiddenException('Credentials incorrect');

    const { hash, ..._user } = user;
    const tokens = await this.tokenService.signToken(_user.id, _user.username);
    await this.updateRtHash(_user.id, tokens.refreshToken);
    return tokens;
  }

  async refresh(refreshToken: string) {
    
    try {
      const payload = await this.tokenService.verifyToken(
        refreshToken,
        TokenType.REFRESH,
      );
      
     const tokenRecord= await this.prisma.token.findFirst({
        where: {
          jti: payload.jti,
          type: TokenType.REFRESH,
          revoked: false,
          expiresAt: {
            gt: new Date(),
          },
        },
        include:{
          user:{
            select:{
              id:true,
              username:true
            }
          }
        }
      });
      
      if (!tokenRecord) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      await this.prisma.token.updateMany({
        where: {
          userId: tokenRecord.userId,
          type: TokenType.ACCESS,
          revoked: false,
        },
        data: {
          revoked: true,
        },
      });
      
       const accessToken = this.tokenService.signToken(tokenRecord.userId,tokenRecord.user.username)

       return accessToken;

      

    } catch (error) {
      console.log(error);
      
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async updateRtHash(userId: string, rt: string) {
    const hash = await argon.hash(rt);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: hash,
      },
    });
  }

  async logout(userId: string) {
   return await this.tokenService.revokeUserToken(userId);
  }
}
