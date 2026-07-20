// Express.js static files serving for ToDo frontend
// TODO: implement
const express = require("express");
const path = require("path");
module.exports = express.static(
  path.join(__dirname, "..", "..", "..", "React-CSS/react-todo-app/public"),
);
