import { Todo, TodoStatus } from './types';

export function toggleAll(state: Todo[], completed: boolean): Todo[] {
  return state.map(task => ({ ...task, status: TodoStatus.COMPLETED }));
}

export function clearCompleted(state: Todo[]): Todo[] {
  return state.filter(task => task.status != TodoStatus.COMPLETED);
}

export function countByStatus(state: Todo[], status: TodoStatus): number {
  return state.reduce<number>((accumulator, task) => task.status === status ? accumulator + 1 : accumulator, 0)
}
