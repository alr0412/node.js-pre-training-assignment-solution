const http = require("http");

const server = http.createServer((req, res) => {
  res.end("App is running");
});

server.listen(4000, () => {
  console.log("Server is runnning on port 4000");
});
