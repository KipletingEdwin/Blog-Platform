import './CommentSection.css';
import React, { useEffect, useState } from "react";
import axios from "axios";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:3000/posts/${postId}/comments`).then((res) => setComments(res.data));
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:3000/posts/${postId}/comments`, { text: newComment });
    setNewComment("");
  };

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment) => (
        <p key={comment.id}>{comment.text}</p>
      ))}
      <form onSubmit={handleSubmit}>
        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CommentSection;
