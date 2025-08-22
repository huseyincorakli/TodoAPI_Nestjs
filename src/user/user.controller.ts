import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { ApiBearerAuth } from '@nestjs/swagger';


@UseGuards(JwtGuard)
@Controller('user')
@ApiBearerAuth('JWT-auth')
export class UserController {

    @Get()
    test(){
        return "protected data"
    }
}
