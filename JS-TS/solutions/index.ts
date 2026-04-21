#!/usr/bin/env ts-node
import { TodoStatus } from "./types";
import { ToDoManager } from "./todo-manager";

// CLI entry for Task 10 – placeholder only
const manager = new ToDoManager();
console.log("CLI for to-do manager('help' to get command list)");
const args = process.argv.slice(2);

const command = args[0];
const params = args.slice(1);

switch (command) {
    case "help":
        console.log(
            "Commands:\ninit - initialize to-dos with demo data\nadd Title Description(optional)-add to-do\ncomplete ID-mark to-do as completed\nlist-display all todos",
        );
        break;
    case "init":
        manager
            .init()
            .then(() => console.log("To-dos initialized"))
            .catch((e) => {
                console.log("Error while creating initial to-dos: ", e);
            });
        break;
    case "add":
        console.log("Adding to-do...");
        manager
            .add(params[0], params[1] ? params[1] : "")
            .then(() => console.log("New to-do added"))
            .catch((e) => {
                console.log("Error while adding to-do: ", e);
            });
        break;
    case "complete":
        manager
            .complete(Number(params[0]))
            .then(() => console.log("To-do with id ", params[0], " marked complete"))
            .catch((e) => {
                console.log("Error while recieving to-dos information: ", e);
            });
        break;
    case "list":
        console.log("Getting to-dos information...");
        manager
            .list()
            .then((todos) => {
                todos.forEach((todo) =>
                    console.log(
                        `[${todo.id}] ${todo.title} (${todo.description}) - ${TodoStatus[todo.status]}`,
                    ),
                );
            })
            .catch((e) => {
                console.log("Error while recieving to-dos information: ", e);
            });
        break;
    default:
        console.log("There is no command: ", command);
}
