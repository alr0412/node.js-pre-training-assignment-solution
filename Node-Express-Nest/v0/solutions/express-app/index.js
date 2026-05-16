const express = require("express");
const app = express();
const logger = require("../task-03");

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

app.post("/todos", (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      res.status(400).json({ error: "Title cant be empty" });
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
    res
      .status(500)
      .json({ error: "Internal server error", details: e.message });
  }
});

app.get(`/todos/:id`, (req, res) => {
  const { id } = req.params;

  const searchTodo = todos.find((todo) => {
    return todo.id.toString() === id;
  });

  if (!searchTodo) {
    res.status(400).json({ error: "No Todos with such ID" });
    return;
  }

  res.status(200).json(searchTodo);
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Express app listening on port ${PORT}`);
  });
}
