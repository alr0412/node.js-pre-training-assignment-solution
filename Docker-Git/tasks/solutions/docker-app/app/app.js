const http = require("node:http");

const server = http.createServer((req, res) => {
  res.end("Hello Docker!");
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
