import React, { useState, useEffect } from "react";
import "./CommentSection.css";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [votes, setVotes] = useState({});
  const [newCommentId, setNewCommentId] = useState(null); // Track the latest comment

  useEffect(() => {
    fetch(`http://localhost:3000/posts/${postId}/comments`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));

        // Initialize votes from backend
        const initialVotes = {};
        data.forEach((comment) => {
          initialVotes[comment.id] = {
            upvoted: false,
            downvoted: false,
            upvotes: comment.upvotes || 0,
            downvotes: comment.downvotes || 0,
          };
        });
        setVotes(initialVotes);
      })
      .catch((error) => console.error("Error fetching comments:", error));
  }, [postId]);

  const handleVote = (commentId, type) => {
    setVotes((prev) => {
      const updatedVotes = { ...prev };

      if (type === "upvote") {
        updatedVotes[commentId] = {
          upvoted: !prev[commentId]?.upvoted,
          downvoted: false,
          upvotes: prev[commentId]?.upvoted ? prev[commentId].upvotes - 1 : prev[commentId].upvotes + 1,
          downvotes: prev[commentId].downvoted ? prev[commentId].downvotes - 1 : prev[commentId].downvotes,
        };
      } else {
        updatedVotes[commentId] = {
          upvoted: false,
          downvoted: !prev[commentId]?.downvoted,
          upvotes: prev[commentId].upvoted ? prev[commentId].upvotes - 1 : prev[commentId].upvotes,
          downvotes: prev[commentId].downvoted ? prev[commentId].downvotes - 1 : prev[commentId].downvotes + 1,
        };
      }
      return updatedVotes;
    });

    // Send vote to backend
    fetch(`http://localhost:3000/comments/${commentId}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    }).catch((error) => console.error("Error voting:", error));
  };

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    const newCommentData = {
      id: Date.now(), // Temporary ID for animation
      username: "You", // Placeholder until backend response
      content: newComment,
      upvotes: 0,
      downvotes: 0,
      created_at: new Date().toISOString(),
    };

    setComments((prev) => [newCommentData, ...prev]); // Add to UI instantly
    setNewCommentId(newCommentData.id); // Set latest comment ID for animation
    setNewComment("");

    // Send to backend
    fetch(`http://localhost:3000/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newComment }),
    })
      .then((response) => response.json())
      .then((savedComment) => {
        setComments((prev) =>
          prev.map((comment) => (comment.id === newCommentData.id ? savedComment : comment))
        );
      })
      .catch((error) => console.error("Error adding comment:", error));
  };

  return (
    <div className="comment-section">
      <h2>Comments</h2>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment.id}
            className={`comment ${comment.id === newCommentId ? "fade-in" : ""}`}
          >
            <p><strong>{comment.username}</strong>: {comment.content}</p>
            <div className="comment-actions">
              <button
                className={`vote-btn upvote ${votes[comment.id]?.upvoted ? "active" : ""}`}
                onClick={() => handleVote(comment.id, "upvote")}
              >
                👍 <span className="vote-count">{votes[comment.id]?.upvotes}</span>
              </button>
              <button
                className={`vote-btn downvote ${votes[comment.id]?.downvoted ? "active" : ""}`}
                onClick={() => handleVote(comment.id, "downvote")}
              >
                👎 <span className="vote-count">{votes[comment.id]?.downvotes}</span>
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}

      {/* Add Comment */}
      <div className="add-comment">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleAddComment}>Post Comment</button>
      </div>
    </div>
  );
};

export default CommentSection;
