// Express.js app with POST /todos endpoint
const express = require("express");
const app = express();
app.use(express.json());

// TODO: implement todos storage and POST /todos logic
let todos = [
  { id: 1, title: "Buy milk", completed: false },
  { id: 2, title: "Learn Express.js", completed: false },
  { id: 3, title: "Build a REST API", completed: true },
];

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

module.exports = app;
