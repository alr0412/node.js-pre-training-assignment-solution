const express = require("express");
const app = express();
const logger = require("../task-03");
const exeprionHandler = require("./middleware/exeptionHandler");

app.use(express.json());
app.use(logger);

let todos = [
  { id: 1, title: "Buy milk", completed: false },
  { id: 2, title: "Learn Express.js", completed: false },
  { id: 3, title: "Build a REST API", completed: true },
];

// TODO: Add routes and middleware here
app.get("/", (req, res) => {
  res.send("Express ToDo App Template");
});

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res, next) => {
  try {
    const { title } = req.body;

    if (!title) {
      const error = new Error("Title cant be empty");
      next(error);
      return;
    }

    const newTodo = {
      id: Date.now().toString(),
      title: title,
      completed: false,
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (e) {
    const error = new Error("Internal server error");
    next(error);
    return;
  }
});

app.get(`/todos/:id`, (req, res, next) => {
  const { id } = req.params;

  const searchTodo = todos.find((todo) => {
    return todo.id.toString() === id;
  });

  if (!searchTodo) {
    const error = new Error("No Todos with such ID");
    next(error);
    return;
  }

  res.status(200).json(searchTodo);
});

app.use(exeprionHandler);

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Express app listening on port ${PORT}`);
  });
}
