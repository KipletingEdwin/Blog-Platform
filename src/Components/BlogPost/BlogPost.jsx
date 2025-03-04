import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./BlogPost.css";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    // Fetch the blog post
    fetch(`http://localhost:3000/posts/${id}`)
      .then((response) => response.json())
      .then((data) => setPost(data))
      .catch((error) => console.error("Error fetching post:", error));

    // Fetch comments for this post
    fetch(`http://localhost:3000/posts/${id}/comments`)
      .then((response) => response.json())
      .then((data) => setComments(data))
      .catch((error) => console.error("Error fetching comments:", error));
  }, [id]);

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const commentData = { content: newComment, post_id: id };

    fetch(`http://localhost:3000/posts/${id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(commentData),
    })
      .then((response) => response.json())
      .then((data) => {
        setComments([...comments, data]); // Update comment list
        setNewComment(""); // Clear input field
      })
      .catch((error) => console.error("Error adding comment:", error));
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="blog-post-container">
      <h1>{post.title}</h1>
      <p className="post-meta">By {post.author} | {new Date(post.created_at).toLocaleDateString()}</p>
      <div className="post-content">{post.content}</div>

      {/* Like & Dislike */}
      <div className="likes-section">
        <button>👍 {post.likes} Likes</button>
        <button>👎 {post.dislikes} Dislikes</button>
      </div>

      {/* Comments Section */}
      <div className="comments-section">
        <h2>Comments</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <p><strong>{comment.username}</strong>: {comment.content}</p>
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
          <button onClick={handleCommentSubmit}>Post Comment</button>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
