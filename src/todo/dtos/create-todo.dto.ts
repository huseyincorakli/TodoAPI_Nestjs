import { ApiProperty } from "@nestjs/swagger"
import { TodoStatus } from "@prisma/client"
import { IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator"

export class CreateTodoDto{
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    title:string

    @ApiProperty()
    @IsOptional()
    @IsString()
    description?:string
    
    @ApiProperty({enum:TodoStatus,enumName:'TodoStatus'})
    @IsEnum(TodoStatus)
    @IsNotEmpty()    
    status:TodoStatus
}

export class CreateTodosDto{
    @ApiProperty({type:CreateTodoDto,isArray:true})
    @IsArray()
    @IsNotEmpty()
    todos:CreateTodoDto[]
}