import { AppDataSource } from "./config/data-source";
import { User } from "./entities/User";
import { Todo } from "./entities/Todo";

async function seed() {
  try {
    await AppDataSource.initialize();
    console.log("Successfully connected to db");

    const userRepository = AppDataSource.getRepository(User);

    await userRepository.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE");

    const user1 = new User();
    user1.name = "Иван Иванов";
    user1.email = "ivan@example.com";

    const t1 = new Todo();
    t1.title = "Купить продукты";

    const t2 = new Todo();
    t2.title = "Помыть машину";

    const t3 = new Todo();
    t3.title = "Сдать лабораторную";

    user1.todos = [t1, t2, t3];

    const user2 = new User();
    user2.name = "Анна Петрова";
    user2.email = "anna@example.com";

    const t4 = new Todo();
    t4.title = "Подготовить отчет";

    const t5 = new Todo();
    t5.title = "Сходить на тренировку";

    const t6 = new Todo();
    t6.title = "Почитать книгу";

    user2.todos = [t4, t5, t6];

    await userRepository.save([user1, user2]);

    console.log("Successfully seeded db");
  } catch (error) {
    console.error("Error while seeding db: ", error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
