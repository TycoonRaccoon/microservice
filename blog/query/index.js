import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
  switch (type) {
    case "post_created": {
      const { id, title } = data;

      posts[id] = { id, title, comments: [] };
      break;
    }

    case "comment_created": {
      const { id, content, status, post_id } = data;

      posts[post_id].comments.push({ id, content, status });
      break;
    }

    case "comment_updated": {
      const { id, content, status, post_id } = data;

      const comment = posts[post_id].comments.find(
        (comment) => comment.id == id
      );

      comment.content = content;
      comment.status = status;
      break;
    }
  }
};

app.get("/posts", (req, res) => {
  res.json(posts);
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.json();
});

app.listen(4002, async () => {
  try {
    const res = await axios.get("http://event-bus-srv:4005/events");

    for (const event of res.data) {
      console.log("Processing event:", event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    console.log("Listening on port: 4002");
  }
});
