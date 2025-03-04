import React, { useState, useEffect } from "react";
import "./CommentSection.css";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState({});
  const [editingComment, setEditingComment] = useState(null);
  const [editingReply, setEditingReply] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [expandedComments, setExpandedComments] = useState({});

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

  const handleDeleteComment = (commentId) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));

    fetch(`http://localhost:3000/comments/${commentId}`, {
      method: "DELETE",
    }).catch((error) => console.error("Error deleting comment:", error));
  };

  const handleEditComment = (commentId) => {
    setEditingComment(commentId);
    const comment = comments.find((c) => c.id === commentId);
    setEditedText(comment.content);
  };

  const handleUpdateComment = (commentId) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, content: editedText } : comment
      )
    );
    setEditingComment(null);

    fetch(`http://localhost:3000/comments/${commentId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editedText }),
    }).catch((error) => console.error("Error updating comment:", error));
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
          <div key={comment.id} className="comment">
            {editingComment === comment.id ? (
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
            ) : (
              <p>
                <strong>{comment.username}</strong>: {comment.content}
              </p>
            )}

            {editingComment === comment.id ? (
              <button onClick={() => handleUpdateComment(comment.id)}>Save</button>
            ) : (
              <>
                <button onClick={() => handleEditComment(comment.id)}>Edit</button>
                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
              </>
            )}

            <button onClick={() => toggleReplies(comment.id)}>
              {expandedComments[comment.id] ? "Hide Replies" : "Show Replies"} ({comment.replies.length})
            </button>

            {expandedComments[comment.id] && (
              <div className="replies">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="reply">
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
