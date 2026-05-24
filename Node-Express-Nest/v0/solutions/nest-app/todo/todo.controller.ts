import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoSearchFilters } from './types';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) { }

  @Get()
  getAll() {
    console.log("get all todos");
    return this.todoService.getAllTodos();
  }

  @Post()
  create(@Body('name') name: string, @Body('description') description: string) {
    return this.todoService.addTodo(name, description);
  }

  @Get('search')
  search(@Query('name') name: string, @Query('description') description: string, @Query('completed') completed: string) {
    const searchFilters: TodoSearchFilters = {
      name: name || '',
      description: description || '',
      completed: completed === 'true'
    }

    console.log(searchFilters);
    return this.todoService.searchTodos(searchFilters);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.todoService.getTodoById(+id);
  }
} 