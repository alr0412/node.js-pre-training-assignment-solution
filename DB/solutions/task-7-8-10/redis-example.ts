import Redis from "ioredis";
import { AppDataSource } from "./src/config/data-source";
import { Todo } from "./src/entities/Todo";

const redis = new Redis();
const todoRepository = AppDataSource.getRepository(Todo);

const CACHE_TTL = 300;

const getCacheKey = (userId: number) => `todos:user:${userId}`;

export const TodoService = {
    async getUserTodos(userId: number): Promise<Todo[]> {
        const cacheKey = getCacheKey(userId);

        const cachedTodos = await redis.get(cacheKey);

        if (cachedTodos) {
            console.log("Found cached data");
            return JSON.parse(cachedTodos);
        }

        console.log("Cache is missing, fething from db");

        const todos = await todoRepository.findBy({ user_id: userId });

        await redis.set(cacheKey, JSON.stringify(todos), "EX", CACHE_TTL);

        return todos;
    },

    async invalidateCache(userId: number): Promise<void> {
        const cacheKey = getCacheKey(userId);
        await redis.del(cacheKey);
        console.log("Cache invalidated for user: ", userId);
    },

    async createTodo(userId: number, todoData: Partial<Todo>): Promise<Todo> {
        const newTodo = todoRepository.create({ ...todoData, user_id: userId });
        const savedTodo = await todoRepository.save(newTodo);

        await this.invalidateCache(userId);
        return savedTodo;
    },

    async updateTodo(userId: number, todoId: number, updateData: Partial<Todo>): Promise<void> {
        await todoRepository.update(todoId, updateData);

        await this.invalidateCache(userId);
    },

    async deleteTodo(userId: number, todoId: number): Promise<void> {
        await todoRepository.delete(todoId);

        await this.invalidateCache(userId);
    }
}

async function test() {
    await AppDataSource.initialize();
    console.log("Database connected");

    const userId = 42;

    console.log("Request without cache...");
    console.time("Request 1 time");

    const todosFirstTime = await TodoService.getUserTodos(userId);

    console.timeEnd("Request 1 time");
    console.log(`Number of todos: ${todosFirstTime.length}`);

    console.log("Request with cache...");
    console.time("Request 2 time");

    const todosSecondTime = await TodoService.getUserTodos(userId);

    console.timeEnd("Request 2 time");


    console.log("\n-Request 3 - creating todo...");
    await TodoService.createTodo(userId, {
        title: "Купить молоко",
        description: "Жирность 3.2%",
        status: "active"
    });


    console.log("Request 4 after mutation");
    console.time("Request 4 time");

    const todosAfterMutation = await TodoService.getUserTodos(userId);

    console.timeEnd("Request 4 time");
    console.log(`Number of todos after mutation: ${todosAfterMutation.length}`);

    await AppDataSource.destroy();
    console.log("Db disconnected");
    await redis.quit();
}

test();