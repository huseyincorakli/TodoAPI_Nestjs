import { ApiProperty } from "@nestjs/swagger"
import { IsOptional, IsString } from "class-validator"

export class EditUserDto{
    @ApiProperty()
    @IsString()
    @IsOptional()
    username?:string

    @ApiProperty()
    @IsString()
    @IsOptional()
    fullname?:string
}