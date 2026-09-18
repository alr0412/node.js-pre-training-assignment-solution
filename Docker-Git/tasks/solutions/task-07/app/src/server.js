import express from "express";

const app = express();
const PORT = 3000;

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/data", (req, res) => {
  res.json({ data: ["apple", "banana", "orange"] });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Serever is running on port: ", PORT);
});
