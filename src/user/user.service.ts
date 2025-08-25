import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dtos';
import { cleanDtoHelper } from '../common';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { hash, refreshToken, ..._user } = user;

    return _user;
  }

  async updateUser(userId: string, dto: EditUserDto) {
    const updataData = cleanDtoHelper(dto);

    try {
      const { hash, refreshToken, ...user } = await this.prisma.user.update({
      where: { id: userId },
      data: { ...updataData },
    });

    return user;

    } catch (error) {
      if (error.code == 'P2002') {
              throw new ForbiddenException('Credentials taken');
            }
            throw new BadRequestException('CREATE USER ERROR');
    }
  }
}
