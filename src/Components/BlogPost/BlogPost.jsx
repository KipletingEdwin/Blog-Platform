import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import "./BlogPost.css";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
    // const navigate = useNavigate();

  // ✅ Get Logged-in User from localStorage
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};


  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`https://blogpost-api-h8mq.onrender.com/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => console.error("Error fetching post:", err));

    fetch(`https://blogpost-api-h8mq.onrender.com/posts/${id}/comments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch comments: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // console.log("🔍 Comments API Response:", data);
        setComments(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error fetching comments:", err);
        setComments([]);
      });
  }, [id]);

  // ✅ Handle Comment Submission
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Unauthorized: No token found");
      return;
    }

    try {
      const response = await fetch(`https://blogpost-api-h8mq.onrender.com/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      if (response.ok) {
        const commentData = await response.json();
        setComments([...comments, commentData]);
        setNewComment("");
      } else {
        console.error("Error submitting comment:", await response.json());
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  // ✅ Handle Edit Comment
  const handleEditComment = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditedCommentText(currentText);
  };

  // ✅ Handle Update Comment
  const handleUpdateComment = async (commentId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`https://blogpost-api-h8mq.onrender.com/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editedCommentText }),
      });

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId ? { ...comment, text: editedCommentText } : comment
          )
        );
        setEditingCommentId(null);
      } else {
        console.error("Error updating comment:", await response.json());
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  // ✅ Handle Delete Comment
  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`https://blogpost-api-h8mq.onrender.com/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setComments((prev) => prev.filter((comment) => comment.id !== commentId));
      } else {
        const errorData = await response.json();
        console.error("Error deleting comment:", errorData.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="blogpost-container">
      {post ? (
        <>
          <h1>{post.title}</h1>
          <p dangerouslySetInnerHTML={{ __html: post.content }}></p>
          <p><strong>Category:</strong> {post.category}</p>

          
                    {/* ✅ Show Edit/Delete buttons only if user is the author */}
                    {currentUser && post.user_id === currentUser.id && (
            <div className="post-actions">
              {/* <button className="edit-btn" onClick={handleCommentPost}>Edit</button>
              <button className="delete-btn" onClick={handleDeletePost}>Delete</button> */}
            </div>
          )
          }
  

          {/* ✅ Comments Section */}
          <div className="comments-section">
            <h2>Comments</h2>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  {editingCommentId === comment.id ? (
                    <div>
                      <textarea
                        value={editedCommentText}
                        onChange={(e) => setEditedCommentText(e.target.value)}
                      />
                      <button onClick={() => handleUpdateComment(comment.id)}>Save</button>
                      <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <>
                      <p><strong>{comment.username}</strong> {comment.text}</p>

                      {/* ✅ Show Edit & Delete only for the comment author */}
                      {currentUser.id === comment.user_id && (
                        <div className="comment-actions">
                          <button className="edit-btn" onClick={() => handleEditComment(comment.id, comment.text)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}

            {/* ✅ Comment Form (Only if logged in) */}
            {localStorage.getItem("token") ? (
              <form onSubmit={handleCommentSubmit} className="comment-form">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                />
                <button type="submit">Post Comment</button>
              </form>
            ) : (
              <p><a href="/login">Login</a> to leave a comment.</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading post...</p>
      )}
    </div>
  );
};

export default BlogPost;
