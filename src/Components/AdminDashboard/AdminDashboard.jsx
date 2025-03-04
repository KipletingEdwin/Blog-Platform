import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  // ✅ Fetch Posts and Comments
  useEffect(() => {
    axios.get("http://localhost:3000/posts").then((res) => setPosts(res.data));
    axios.get("http://localhost:3000/comments").then((res) => setComments(res.data));
  }, []);

  // ✅ Delete Post
  const deletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await axios.delete(`http://localhost:3000/posts/${postId}`);
      setPosts(posts.filter((post) => post.id !== postId));
    }
  };

  // ✅ Delete Comment
  const deleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await axios.delete(`http://localhost:3000/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* 📌 Manage Posts Section */}
      <div className="dashboard-section">
        <h3>📄 Manage Posts</h3>
        {posts.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.category}</td>
                  <td className="action-buttons">
                    <button className="edit-btn">✏️ Edit</button>
                    <button className="delete-btn" onClick={() => deletePost(post.id)}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No posts available.</p>
        )}
      </div>

      {/* 💬 Manage Comments Section */}
      <div className="dashboard-section">
        <h3>💬 Manage Comments</h3>
        {comments.length > 0 ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Comment</th>
                <th>Post</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment.id}>
                  <td>{comment.text}</td>
                  <td>{comment.postTitle}</td>
                  <td className="action-buttons">
                    <button className="delete-btn" onClick={() => deleteComment(comment.id)}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No comments available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
