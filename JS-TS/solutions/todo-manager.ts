import { TodoService } from './todo-service';
import { TodoApi } from './todo-api';
import { Todo } from './types';

export class ToDoManager {
  private service = new TodoService(new TodoApi());

  async init(): Promise<void> {
    this.service.create("Initial 1");
    this.service.create("Initial 2");
    this.service.create("Initial 3");
  }

  async add(title: string, description = ''): Promise<void> {
    this.service.create(title, description);
  }

  async complete(id: number): Promise<void> {
    this.service.toggleStatus(id);
  }

  async list(): Promise<Todo[]> {
    return this.service.search("");
  }
}
