import { randomBytes } from "crypto";
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const { title } = req.body;

  const id = randomBytes(4).toString("hex");

  posts[id] = { id, title };

  await axios.post("http://event-bus-srv:4005/events", {
    type: "post_created",
    data: posts[id],
  });

  res.status(201).send(posts[id]);
});

app.post("/events", (req, res) => {
  res.json();
});

app.listen(4000, () => console.log("Listening on port: 4000"));
