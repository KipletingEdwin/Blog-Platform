import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./BlogPost.css";

const BlogPost = ({ isAuthenticated }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Fetch the post
    fetch(`http://localhost:3000/posts/${id}`)
      .then((res) => res.json())
      .then((data) => setPost(data))
      .catch((err) => console.error("Error fetching post:", err));

    // Fetch comments
    fetch(`http://localhost:3000/posts/${id}/comments`)
      .then((res) => res.json())
      .then((data) => setComments(data))
      .catch((err) => console.error("Error fetching comments:", err));
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const token = localStorage.getItem("token"); // Get JWT token

    try {
      const response = await fetch(`http://localhost:3000/posts/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token in header
        },
        body: JSON.stringify({ comment: { text: newComment } }),
      });

      if (response.ok) {
        const commentData = await response.json();
        setComments([...comments, commentData]); // Update comment list
        setNewComment(""); // Clear input
      } else {
        console.error("Error submitting comment:", await response.json());
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  return (
    <div className="blogpost-container">
      {post ? (
        <>
          <h1>{post.title}</h1>
          <p>{post.content}</p>
          <p><strong>Category:</strong> {post.category}</p>

          {/* Comments Section */}
          <div className="comments-section">
            <h2>Comments</h2>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <p>{comment.text}</p>
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}

            {/* Comment Form (Only if logged in) */}
            {isAuthenticated ? (
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
