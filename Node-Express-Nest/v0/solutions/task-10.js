// Express.js GET /todos/search endpoint with query params
// TODO: implement
module.exports = {
    app.get("/todos/search", (req, res, next) => {
  const { id, title, completed } = req.query;

  let filteredTodos = todos;

  if (id) {
    filteredTodos = filteredTodos.filter((todo) =>
      todo.id.toString().includes(id),
    );
  }

  if (title) {
    filteredTodos = filteredTodos.filter((todo) =>
      todo.title.toLowerCase().includes(title.toLowerCase()),
    );
  }

  if (completed) {
    const isCompleted = completed === "true";
    filteredTodos = filteredTodos.filter(
      (todo) => todo.completed == isCompleted,
    );
  }

  if (filteredTodos.length < 1) {
    const error = new Error("No todos with specified parameters found");
    return next(error);
  }

  res.status(200).json(filteredTodos);
});
}; 