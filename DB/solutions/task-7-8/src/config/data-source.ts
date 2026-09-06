import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Todo } from "../entities/Todo";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "333495550",
    database: process.env.DB_NAME || "postgres",
    synchronize: true,
    logging: true,
    entities: [User, Todo],
    migrations: ["src/migrations/*.ts"],
});
