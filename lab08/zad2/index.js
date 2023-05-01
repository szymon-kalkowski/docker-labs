const express = require("express");
const Redis = require("ioredis");

const app = express();
app.use(express.json());

const client = new Redis({
  host: "redis",
  port: 6379,
});
client.on("error", (err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/message", async (req, res) => {
  const message = req.body.message;
  await client.rpush("messages", message);
  res.send("Message sent");
});

app.get("/message", async (req, res) => {
  const messages = await client.lrange("messages", 0, -1);
  res.send(messages);
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
