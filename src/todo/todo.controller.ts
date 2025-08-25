import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guard';
import { ApiBearerAuth, ApiProperty, ApiQuery } from '@nestjs/swagger';
import { GetUser } from '../auth/decorator/get-user.decorator';
import { EditTodoDto } from './dtos/edit-todo.dto';
import { TodoService } from './todo.service';
import { CreateTodosDto, CreateTodoDto } from './dtos/create-todo.dto';
import { TodoStatus } from '@prisma/client';
import { ClampIntPipe } from '../common';

@Controller('todos')
@UseGuards(JwtGuard)
@ApiBearerAuth('JWT-auth')
export class TodoController {
  constructor(private todoService: TodoService) {}

  @Get()
  @ApiQuery({ name: 'status', required: false, enum: TodoStatus })
  @ApiQuery({ name: 'page', required: false, type: Number, default: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, default: 10 })
  async getAllUserTodos(
    @GetUser('id') userId: string,
    @Query('page', ParseIntPipe,ClampIntPipe) page: number = 1,
    @Query('size', ParseIntPipe,ClampIntPipe) size: number = 10,
    @Query('status') status?: TodoStatus,
  ) {
    return await this.todoService.getUserAllTodos(userId, page, size, status);
  }

  @Post()
  async addTodo(@GetUser('id') userId: string, @Body() dto: CreateTodoDto) {
    return await this.todoService.addTodo(userId, dto);
  }

  @Post('addTodos')
  async addTodos(@GetUser('id') userId: string, @Body() dto: CreateTodosDto) {
    return await this.todoService.addTodos(userId, dto);
  }

  @Get(':id')
  async getUserTodoById(
    @GetUser('id') userId: string,
    @Param('id') todoId: string,
  ) {
    return await this.todoService.getUserTodoById(userId, todoId);
  }

  @Patch(':id')
  async updateUserTodo(
    @GetUser('id') userId: string,
    @Body() dto: EditTodoDto,
    @Param('id') todoId: string,
  ) {
    return await this.todoService.updateTodo(userId, dto, todoId);
  }

  @Delete()
  async deleteSelectedTodos(
    @GetUser('id') userId: string,
    @Body() selectedTodos: string[],
  ) {
    return await this.todoService.deleteSelectedTodos(userId, selectedTodos);
  }

  @Delete(':id')
  async deleteTodo(@GetUser('id') userId: string, @Param('id') todoId: string) {
    return await this.todoService.deleteTodo(userId, todoId);
  }
}
