import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./BlogPost.css";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    fetch(`http://localhost:3000/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => console.error("Error fetching post:", err));
  
    fetch(`http://localhost:3000/posts/${id}/comments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Attach token
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch comments: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("🔍 Comments API Response:", data);
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
  
    const token = localStorage.getItem("token"); // ✅ Retrieve token
    if (!token) {
      console.error("Unauthorized: No token found");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ Send token in request
        },
        body: JSON.stringify({ text: newComment }), // Ensure key matches backend
      });
  
      if (response.ok) {
        const commentData = await response.json();
        setComments([...comments, commentData]); // ✅ Update comment list
        setNewComment(""); // ✅ Clear input
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
      const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: { text: editedCommentText } }),
      });

      if (response.ok) {
        const updatedComment = await response.json();
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId ? updatedComment : comment
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

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(`http://localhost:3000/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`, // ✅ Include authentication token
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
                      <p>{comment.text}</p>
                      <button onClick={() => handleEditComment(comment.id, comment.text)}>Edit</button>
                      <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
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
