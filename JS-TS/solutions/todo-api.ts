import { InMemoryRepository } from './repository';
import { Todo, NewTodo } from './types';
import { createTodo } from './todo-factory'

export class TodoApi {
  private repo = new InMemoryRepository<Todo>();

  async getAll(): Promise<Todo[]> {
    return new Promise((resolve) => setTimeout(() => resolve(this.repo.findAll()), 600));
  }

  async add(newTodo: NewTodo): Promise<Todo> {
    return new Promise((resolve) => setTimeout(() => resolve(this.repo.add(createTodo(newTodo))), 500));
  }

  async update(id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {
    return new Promise((resolve) => setTimeout(() => resolve(this.repo.update(id, update)), 400));
  }

  async remove(id: number): Promise<void> {
    return new Promise((resolve) => setTimeout(() => resolve(this.repo.remove(id)), 300));
  }
}
