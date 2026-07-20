import { Controller, Get, Post, Put, Body, Param, Query } from "@nestjs/common";
import { TodoService } from "./todo.service";
import { TodoSearchFilters } from "./types";
import { CreateTodoDto } from "./create-todo.dto";

@Controller("todos")
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  getAll() {
    return this.todoService.getAllTodos();
  }

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todoService.addTodo(
      createTodoDto.name,
      createTodoDto.description,
    );
  }

  @Get("search")
  search(
    @Query("name") name: string,
    @Query("description") description: string,
    @Query("completed") completed: string,
  ) {
    const searchFilters: TodoSearchFilters = {
      name: name || "",
      description: description || "",
      completed: completed === "true",
    };

    return this.todoService.searchTodos(searchFilters);
  }

  @Get(":id")
  getById(@Param("id") id: string) {
    return this.todoService.getTodoById(+id);
  }

  @Put(":id")
  markCompleted(@Param("id") id: string) {
    return this.todoService.completeTodo(+id);
  }
}
