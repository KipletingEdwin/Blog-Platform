import React, { useState, useEffect } from "react";
import "./CommentSection.css";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState({});
  const [expandedComments, setExpandedComments] = useState({});
  const [newCommentId, setNewCommentId] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/posts/${postId}/comments`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, [postId]);

  const handleAddComment = () => {
    if (newComment.trim() === "") return;

    const newCommentData = {
      id: Date.now(),
      username: "You",
      content: newComment,
      replies: [],
      created_at: new Date().toISOString(),
    };

    setComments((prev) => [newCommentData, ...prev]);
    setNewCommentId(newCommentData.id);
    setNewComment("");

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

  const handleAddReply = (parentId) => {
    if (newReply[parentId]?.trim() === "") return;

    const replyData = {
      id: Date.now(),
      username: "You",
      content: newReply[parentId],
      created_at: new Date().toISOString(),
    };

    setComments((prev) =>
      prev.map((comment) =>
        comment.id === parentId ? { ...comment, replies: [...comment.replies, replyData] } : comment
      )
    );

    setNewCommentId(replyData.id);
    setNewReply((prev) => ({ ...prev, [parentId]: "" }));

    fetch(`http://localhost:3000/comments/${parentId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newReply[parentId] }),
    })
      .then((response) => response.json())
      .then((savedReply) => {
        setComments((prev) =>
          prev.map((comment) =>
            comment.id === parentId
              ? {
                  ...comment,
                  replies: comment.replies.map((r) => (r.id === replyData.id ? savedReply : r)),
                }
              : comment
          )
        );
      })
      .catch((error) => console.error("Error adding reply:", error));
  };

  const toggleReplies = (commentId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  return (
    <div className="comment-section">
      <h2>Comments</h2>
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className={`comment ${comment.id === newCommentId ? "fade-in" : ""}`}>
            <p><strong>{comment.username}</strong>: {comment.content}</p>
            <button onClick={() => toggleReplies(comment.id)}>
              {expandedComments[comment.id] ? "Hide Replies" : "Show Replies"} ({comment.replies.length})
            </button>

            {expandedComments[comment.id] && (
              <div className="replies">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className={`reply ${reply.id === newCommentId ? "fade-in" : ""}`}>
                    <p><strong>{reply.username}</strong>: {reply.content}</p>
                  </div>
                ))}

                <textarea
                  value={newReply[comment.id] || ""}
                  onChange={(e) => setNewReply({ ...newReply, [comment.id]: e.target.value })}
                  placeholder="Write a reply..."
                />
                <button onClick={() => handleAddReply(comment.id)}>Reply</button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No comments yet.</p>
      )}

      {/* Add New Comment */}
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
