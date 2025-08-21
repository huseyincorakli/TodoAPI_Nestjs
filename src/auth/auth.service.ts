import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async testdb() {
    return await this.prisma.user.create({
      data: {
        username: 'test_db',
        hash: '123',
        fullname: 'test_db_username',
      },
    });
  }
}
