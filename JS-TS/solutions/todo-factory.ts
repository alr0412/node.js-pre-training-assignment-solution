import { Todo, NewTodo, TodoStatus } from './types';

let nextId = 1;

export function createTodo(input: NewTodo): Todo {
  nextId++;
  return {
    id: nextId - 1,
    title: input.title,
    description: input.description,
    status: (input.status ? input.status : TodoStatus.PENDING),
    createdAt: new Date()
  } as Todo;
}
