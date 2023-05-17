const express = require("express");
const Redis = require("ioredis");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;

const app = express();
app.use(express.json());

const redisClient = new Redis({
  host: "redis",
  port: 6379,
});

const url = "mongodb://mongodb:27017";
const mongoClient = new MongoClient(url, { useUnifiedTopology: true });

(async () => {
  (await redisClient.get("counter"))
    ? null
    : await redisClient.set("counter", 0);

  await mongoClient.connect();
  const db = mongoClient.db("test");
  const collections = await db.listCollections().toArray();
  if (!collections.some((collection) => collection.name === "tasks")) {
    await db.createCollection("tasks");
  }
})();

app.get("/", async (req, res) => {
  const counter = await redisClient.get("counter");
  res.send(counter);
});

app.get("/tasks", async (req, res) => {
  await mongoClient.connect();
  const db = mongoClient.db("test");
  const tasks = await db.collection("tasks").find().toArray();
  res.send(tasks);
});

app.post("/tasks", async (req, res) => {
  await mongoClient.connect();
  const db = mongoClient.db("test");
  await db.collection("tasks").insertOne(req.body);
  res.send(req.body);
});

app.put("/tasks/:id", async (req, res) => {
  await mongoClient.connect();
  const db = mongoClient.db("test");
  const task = await db
    .collection("tasks")
    .findOne({ _id: new ObjectId(req.params.id) });
  const status = task?.status;
  await db
    .collection("tasks")
    .updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: !status } }
    );
  await redisClient.incr("counter");
  task !== null ? res.send("updated") : res.send("no task with such id");
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
