const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const app = express();
const port = 3000;

app.use(express.json());

const url = "mongodb://database:27017";
const client = new MongoClient(url, { useUnifiedTopology: true });

MongoClient.connect(url, function (err, db) {
  if (err) throw err;
  const dbo = db.db("test");
  dbo.createCollection("clients", function (err, res) {
    if (err) throw err;
    console.log("Collection created!");
    db.close();
  });
});

app.get("/clients", async (req, res) => {
  await client.connect();
  const users = await client.db("test").collection("clients").find().toArray();
  console.log(users);
  res.send(users);
});

app.post("/clients", async (req, res) => {
  await client.connect();
  const { name, surname } = req.body;
  const result = await client
    .db("test")
    .collection("clients")
    .insertOne({ name: name, surname: surname });
  console.log(result);
  res.send(result);
});

app.delete("/clients", async (req, res) => {
  await client.connect();
  const { name, surname } = req.body;
  const result = await client
    .db("test")
    .collection("clients")
    .deleteOne({ name: name, surname: surname });
  console.log(result);
  res.send(result);
});

app.put("/clients", async (req, res) => {
  await client.connect();
  const { name, surname, newName, newSurname } = req.body;
  const result = await client
    .db("test")
    .collection("clients")
    .updateOne(
      { name: name, surname: surname },
      { $set: { name: newName, surname: newSurname } }
    );
  console.log(result);
  res.send(result);
});

app.get("/live", (req, res) => {
  res.status(200).send("Status: Live");
});

app.get("/ready", async (req, res) => {
  try {
    await client.connect();
    res.status(200).send("Status: Ready");
  } catch (error) {
    res.status(500).send("Status: Not Ready");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
