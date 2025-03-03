import React, { useEffect, useState } from "react";
import axios from "axios";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [reply, setReply] = useState({});

  useEffect(() => {
    axios.get(`http://localhost:3000/posts/${postId}/comments`).then((res) => setComments(res.data));
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    await axios.post(`http://localhost:3000/posts/${postId}/comments`, { text: newComment });
    setNewComment("");
  };

  const handleReplySubmit = async (parentId) => {
    await axios.post(`http://localhost:3000/posts/${postId}/comments`, { text: reply[parentId], parent_id: parentId });
    setReply({ ...reply, [parentId]: "" });
  };

  return (
    <div>
      <h3>Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id} style={{ marginLeft: comment.parent_id ? "20px" : "0" }}>
          <p>{comment.text}</p>
          <button onClick={() => setReply({ ...reply, [comment.id]: "" })}>Reply</button>
          {reply[comment.id] !== undefined && (
            <div>
              <input
                type="text"
                value={reply[comment.id]}
                onChange={(e) => setReply({ ...reply, [comment.id]: e.target.value })}
                placeholder="Write a reply..."
              />
              <button onClick={() => handleReplySubmit(comment.id)}>Submit</button>
            </div>
          )}
        </div>
      ))}
      <form onSubmit={handleCommentSubmit}>
        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." />
        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default CommentSection;
