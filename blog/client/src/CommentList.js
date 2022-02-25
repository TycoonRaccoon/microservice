import React from "react";

const CommentList = ({ comments }) => {
  const rendered_comments = Object.values(comments).map((comment) => {
    let content;

    switch (comment.status) {
      case "approved":
        content = comment.content;
        break;

      case "rejected":
        content = "This comment has been rejected";
        break;

      case "pending":
        content = "This comment is awaiting moderation";
        break;

      default:
        break;
    }

    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{rendered_comments}</ul>;
};

export default CommentList;
