import { TodoApi } from './todo-api';
import { NewTodo, Todo, TodoStatus } from './types';

export class TodoService {
  constructor(private readonly api: TodoApi) {
    this.api = api;
  }

  async create(title: string, description = ''): Promise<Todo> {
    return this.api.add({
      title: title,
      description: description
    } as NewTodo);
  }

  async toggleStatus(id: number): Promise<Todo> {
    return this.api.update(id, { status: TodoStatus.COMPLETED });
  }

  async search(keyword: string): Promise<Todo[]> {
    const todos = await this.api.getAll();
    return todos.filter((t) => t.title.toLowerCase().includes(keyword.toLowerCase()));
  }
}
