import { TodoService } from '../JS-TS/solutions/todo-service';
import { TodoApi } from '../JS-TS/solutions/todo-api';

describe('Task 9: test `TodoService` and the repository', () => {
    jest.setTimeout(10000);
    const api = new TodoApi();
    const service = new TodoService(api);

    it('successful creation of a todo', async () => {
        const createdFirst = await service.create('First item');
        const createdSecond = await service.create('Second item');
        expect(createdFirst.title).toBe('First item');
        expect(createdSecond.title).toBe('Second item');
    });

    it('toggling status', async () => {
        const [todo] = await service.search('FIRST');
        const toggled = await service.toggleStatus(todo.id);
        expect(toggled.status).not.toBe(todo.status);
    });

    it('search should be case-insensitive', async () => {
        const list = await service.search('SECOND');
        expect(list[0].title).toBe('Second item');
    });
})