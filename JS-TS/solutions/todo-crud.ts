import { Todo } from './types';

export function addTodo(state: Todo[], todo: Todo): Todo[] {
  return [...state, todo];
}

export function updateTodo(state: Todo[], id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Todo[] {
  if (id <= state.length && id > 0) {
    return state.map(task => task.id === id ? { ...task, ...update } : task);
  } else {
    throw new Error("Error: Invalid id");
  }
}

export function removeTodo(state: Todo[], id: number): Todo[] {
  if (id <= state.length && id > 0) {
    return state.filter(task => task.id != id);
  } else {
    throw new Error("Error: Invalid id");
  }
}

export function getTodo(state: Todo[], id: number): Todo | undefined {
  return state[id - 1];
}
