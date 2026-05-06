import React, { useState } from "react";
import { Todo } from "../../types";

/**
 * Task 5: FilteredToDoList Component
 *
 * Theory: Derived State and Computed Values
 *
 * In React, you often need to compute values based on your state. These are called "derived state"
 * or "computed values" and should be calculated during render rather than stored in state.
 *
 * Why Use Derived State:
 * 1. Avoids state synchronization issues
 * 2. Reduces complexity by having a single source of truth
 * 3. Automatically updates when source data changes
 * 4. Prevents stale state bugs
 *
 * Common Derived State Patterns:
 *
 * Filtering:
 * - const activeTodos = todos.filter(todo => !todo.completed)
 * - const completedTodos = todos.filter(todo => todo.completed)
 *
 * Searching:
 * - const filteredTodos = todos.filter(todo =>
 *     todo.title.toLowerCase().includes(searchTerm.toLowerCase())
 *   )
 *
 * Sorting:
 * - const sortedTodos = [...todos].sort((a, b) => a.title.localeCompare(b.title))
 *
 * Aggregations:
 * - const completedCount = todos.filter(todo => todo.completed).length
 * - const totalCount = todos.length
 *
 * Multiple Filters:
 * - Use multiple filter conditions or combine them
 * - Consider using useMemo for expensive computations
 *
 * Key Concepts:
 * - Calculate derived values during render
 * - Don't store computed values in state
 * - Use useMemo for expensive calculations
 * - Keep state minimal and derive the rest
 */
export const FilteredToDoList: React.FC = () => {
  // TODO: Implement the FilteredToDoList component
  //
  // Requirements:
  // 1. Display a list of todos with add functionality
  // 2. Add filter buttons: "All", "Active", "Completed"
  // 3. Filter todos based on selected filter
  // 4. Use derived state for filtered results
  // 5. Add complete functionality for todos
  //
  // Example implementation:
  // const [todos, setTodos] = useState<Todo[]>([]);
  // const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  //
  // const filteredTodos = todos.filter(todo => {
  //   if (filter === 'active') return !todo.completed;
  //   if (filter === 'completed') return todo.completed;
  //   return true; // 'all' case
  // });
  type Filters = "all" | "active" | "completed";

  const [inputValue, setInputValue] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filters>("all");

  const filters: Filters[] = ["all", "active", "completed"];
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true; // 'all' case
  });

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue === "") return;

    const newTodo: Todo = {
      id: Date.now(),
      title: inputValue,
      completed: false,
    };
    setTodos((todos) => [...todos, newTodo]);

    setInputValue("");
  };

  const handleChangeTodo = (todo: Todo) => {
    const newTodo: Todo = { ...todo, completed: !todo.completed };
    setTodos((todos) => todos.map((t) => (t.id === todo.id ? newTodo : t)));
  };

  return (
    <div>
      <h4>Add ToDo Component</h4>
      <form onSubmit={handleAddTodo}>
        <label>
          TO-DO Title:
          <input
            type="text"
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
            }}
            placeholder="add todo"
          />
        </label>
        <button type="submit">add</button>
      </form>
      <select
        onChange={(e) => {
          setFilter(e.target.value as Filters);
        }}
      >
        <option value={filters[0]}>all</option>
        <option value={filters[1]}>active</option>
        <option value={filters[2]}>completed</option>
      </select>
      <ul>
        {filteredTodos.map((todo) => (
          <li key={todo.id}>
            <div style={{ display: "flex" }}>
              <p
                className={`todo-item ${todo.completed ? "completed" : "active"}`}
              >
                {todo.title} - {todo.completed ? "Completed" : "Not Completed"}
                <input
                  type="checkbox"
                  defaultChecked={todo.completed}
                  onChange={() => handleChangeTodo(todo)}
                ></input>
              </p>
            </div>
          </li>
        ))}
      </ul>
      <p>Implement useState and form handling here</p>
    </div>
  );
};
