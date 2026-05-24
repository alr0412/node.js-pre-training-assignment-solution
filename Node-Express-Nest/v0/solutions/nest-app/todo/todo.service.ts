import { Injectable } from '@nestjs/common';
import { Todo, TodoSearchFilters } from './types';

@Injectable()
export class TodoService {
  private todos: Todo[] = [];

  getAllTodos() {
    return this.todos;
  }

  getTodoById(id: number) {
    return this.todos.find(t => t.id === id);
  }

  addTodo(name: string, description: string) {
    const newId = this.todos.length > 0 ? Math.max(...this.todos.map(t => t.id)) + 1 : 1;
    const newTodo: Todo = {
      id: newId,
      name: name,
      description: description,
      completed: false
    }

    this.todos.push(newTodo);
    return newTodo;
  }

  searchTodos(filters: TodoSearchFilters) {
    return this.todos.filter(t => {
      return Object.keys(filters).every(key => {

        const filterValue = filters[key as keyof TodoSearchFilters];
        const dataValue = t[key as keyof Todo];

        console.log("Comparing " + filterValue + `(type ${typeof filterValue})` + " with " + dataValue + `(type ${typeof dataValue})`);

        if (filterValue === null || filterValue === undefined || filterValue === '') {
          console.log(true);
          return true;
        }

        if (typeof dataValue === 'string' && typeof filterValue === 'string') {
          return dataValue.includes(filterValue);
        } else {
          return dataValue === filterValue;
        }

      });
    });
  }
} 