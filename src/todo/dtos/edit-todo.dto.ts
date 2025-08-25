import { ApiProperty } from "@nestjs/swagger";
import { TodoStatus } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class EditTodoDto{
    @ApiProperty()
    @IsString()
    @IsOptional()
    title?:string;
    
    @ApiProperty()
    @IsOptional()
    @IsString()
    description?:string;

    @ApiProperty({enum:TodoStatus,enumName:'TodoStatus'})
    @IsEnum(TodoStatus)
    @IsOptional()
    status?:TodoStatus
}