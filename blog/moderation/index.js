import express from "express";
import axios from "axios";

const app = express();

app.use(express.json());

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  switch (type) {
    case "comment_created": {
      data.status = data.content.includes("orange") ? "rejected" : "approved";

      await axios.post("http://event-bus-srv:4005/events", {
        type: "comment_moderated",
        data,
      });
      break;
    }
  }

  res.json();
});

app.listen(4003, () => console.log("Listening on port: 4003"));
