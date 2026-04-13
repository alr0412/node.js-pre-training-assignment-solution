interface Todo {
    id: number;
    title: string;
    description?: string;
    status: TodoStatus;
    readonly createdAt: Date;
};

type NewTodo = {
    title: string;
    description?: string;
    status?: TodoStatus;
};

enum TodoStatus {
    PENDING,
    IN_PROGRESS,
    COMPLETED
};

export { Todo, TodoStatus, NewTodo };