import { randomBytes } from "crypto";
import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const comments_by_post_id = {};

app.get("/posts/:id/comments", (req, res) => {
  const { id: post_id } = req.params;

  res.json(comments_by_post_id[post_id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const { id: post_id } = req.params;
  const { content } = req.body;

  const id = randomBytes(4).toString("hex");

  const comments = comments_by_post_id[post_id] || [];

  comments.push({ id, content, status: "pending" });

  comments_by_post_id[post_id] = comments;

  await axios.post("http://event-bus-srv:4005/events", {
    type: "comment_created",
    data: { id, content, status: "pending", post_id },
  });

  res.status(201).json(comments);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  switch (type) {
    case "comment_moderated": {
      const { id, status, post_id } = data;

      const comments = comments_by_post_id[post_id];

      comments.find((comment) => comment.id == id).status = status;

      await axios.post("http://event-bus-srv:4005/events", {
        type: "comment_updated",
        data,
      });

      break;
    }
  }

  res.json();
});

app.listen(4001, () => console.log("Listening on port: 4001"));
