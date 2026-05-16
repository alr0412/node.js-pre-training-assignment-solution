// Express.js app with GET /todos/:id endpoint
const express = require("express");
const app = express();

// TODO: implement todos storage and GET /todos/:id logic
let todos = [
  { id: 1, title: "Buy milk", completed: false },
  { id: 2, title: "Learn Express.js", completed: false },
  { id: 3, title: "Build a REST API", completed: true },
];

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
