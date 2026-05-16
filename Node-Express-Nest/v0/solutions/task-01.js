// Express.js app with GET /todos endpoint
const express = require("express");
const app = express();

// TODO: implement todos storage and GET /todos logic
const PORT = 3000;

// Sample todo data
let todos = [
  { id: 1, title: "Buy milk", completed: false },
  { id: 2, title: "Learn Express.js", completed: false },
  { id: 3, title: "Build a REST API", completed: true },
];

// GET /todos endpoint
app.get("/todos", (req, res) => {
  res.json(todos);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

module.exports = app;
