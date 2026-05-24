export type Todo = {
    id: number;
    name: string;
    description: string;
    completed: boolean;
}

export type TodoSearchFilters = {
    name: string;
    description: string;
    completed: boolean;
}