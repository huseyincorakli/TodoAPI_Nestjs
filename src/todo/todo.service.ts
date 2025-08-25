import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto, CreateTodosDto } from './dtos/create-todo.dto';
import { EditTodoDto } from './dtos/edit-todo.dto';
import { cleanDtoHelper } from '../common';
import { TodoStatus } from '@prisma/client';

@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  async getUserAllTodos(
    userId: string,
    page: number,
    size: number,
    status?: TodoStatus,
  ) {
    const skip = (page - 1) * size;

    const where: any = { userId };
    if (status) {
      where.status = status; 
    }
    const todos = await this.prisma.todo.findMany({
      where,
      orderBy: { createAt: 'desc' },
      skip,
      take: size,
    });

    return todos;
  }

  async addTodo(userId: string, dto: CreateTodoDto) {
    await this.prisma.todo.create({
      data: { userId, ...dto },
    });
  }

  async addTodos(userId: string, dto: CreateTodosDto) {
    const todoData = dto.todos.map((todo) => ({
      ...todo,
      userId,
    }));

    await this.prisma.todo.createMany({
      data: todoData,
    });
  }

  async getUserTodoById(userId: string, todoId: string) {
    return await this.prisma.todo.findFirst({
      where: { userId, id: todoId },
    });
  }

  async deleteSelectedTodos(userId: string, selectedTodos: string[]) {
    await this.prisma.todo.deleteMany({
      where: {
        id: { in: selectedTodos },
        userId,
      },
    });
  }

  async deleteTodo(userId: string, todoId: string) {
    await this.prisma.todo.delete({
      where: { id: todoId, userId },
    });
  }

  async updateTodo(userId: string, dto: EditTodoDto, todoId: string) {
    const updataData = cleanDtoHelper(dto);

    await this.prisma.todo.update({
      where: {
        id: todoId,
        userId,
      },
      data: {
        ...updataData,
      },
    });
  }
}
