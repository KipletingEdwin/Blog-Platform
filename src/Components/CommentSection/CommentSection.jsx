import React, { useState, useEffect } from "react";
import "./CommentSection.css";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const token = localStorage.getItem("token"); // ✅ Retrieve token

  useEffect(() => {
    fetch(`http://localhost:3000/posts/${postId}/comments`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, [postId]);

  // ✅ Handle Adding a Comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:3000/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (response.ok) {
        const savedComment = await response.json();
        setComments([...comments, savedComment]); // Add to UI
        setNewComment(""); // Clear input
      } else {
        console.error("Error submitting comment:", await response.json());
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  // ✅ Handle Deleting a Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setComments(comments.filter((comment) => comment.id !== commentId)); // Remove from UI
      } else {
        console.error("Error deleting comment:", await response.json());
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  // ✅ Handle Editing a Comment
  const handleEditComment = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditedCommentText(currentText);
  };

  // ✅ Handle Updating a Comment
  const handleUpdateComment = async (commentId) => {
    if (!editedCommentText.trim()) return;

    try {
      const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editedCommentText }),
      });

      if (response.ok) {
        setComments(
          comments.map((comment) =>
            comment.id === commentId ? { ...comment, text: editedCommentText } : comment
          )
        );
        setEditingCommentId(null); // Exit edit mode
      } else {
        console.error("Error updating comment:", await response.json());
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  return (
    <div className="comment-section">
      <h2>Comments</h2>
      
      {/* List Comments */}
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            {editingCommentId === comment.id ? (
              <textarea
                value={editedCommentText}
                onChange={(e) => setEditedCommentText(e.target.value)}
              />
            ) : (
              <p><strong>{comment.username}</strong>: {comment.text}</p>
            )}

            {editingCommentId === comment.id ? (
              <button onClick={() => handleUpdateComment(comment.id)}>Save</button>
            ) : (
              <>
                <button onClick={() => handleEditComment(comment.id, comment.text)}>Edit</button>
                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
              </>
            )}
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
