import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [editPost, setEditPost] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  // ✅ Fetch Posts and Comments
  useEffect(() => {
    axios.get("https://blogpost-api-h8mq.onrender.com/posts").then((res) => setPosts(res.data));
    axios.get("https://blogpost-api-h8mq.onrender.com/comments").then((res) => setComments(res.data));
  }, []);

  // ✅ Delete Post
  const deletePost = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await axios.delete(`https://blogpost-api-h8mq.onrender.com/posts/${postId}`);
      setPosts(posts.filter((post) => post.id !== postId));
    }
  };

  // ✅ Delete Comment
  const deleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await axios.delete(`https://blogpost-api-h8mq.onrender.com/comments/${commentId}`);
      setComments(comments.filter((comment) => comment.id !== commentId));
    }
  };

  // ✅ Open Edit Modal with Selected Post Data
  const openEditModal = (post) => {
    setEditPost(post);
    setEditModalOpen(true);
  };

  // ✅ Handle Post Update Submission
  const handleUpdatePost = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(`https://blogpost-api-h8mq.onrender.com/posts/${editPost.id}`, editPost);
      setPosts(posts.map((post) => (post.id === editPost.id ? response.data : post)));
      setEditModalOpen(false);
    } catch (error) {
      console.error("Error updating post:", error);
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
                    <button className="edit-btn" onClick={() => openEditModal(post)}>✏️ Edit</button>
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

      {/* 📝 Edit Post Modal */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Edit Post</h3>
            <form onSubmit={handleUpdatePost}>
              <label>Title:</label>
              <input
                type="text"
                value={editPost.title}
                onChange={(e) => setEditPost({ ...editPost, title: e.target.value })}
                required
              />

              <label>Category:</label>
              <input
                type="text"
                value={editPost.category}
                onChange={(e) => setEditPost({ ...editPost, category: e.target.value })}
                required
              />

              <label>Description:</label>
              <textarea
                value={editPost.description}
                onChange={(e) => setEditPost({ ...editPost, description: e.target.value })}
                required
              />

              <button type="submit" className="save-btn">💾 Save Changes</button>
              <button type="button" className="cancel-btn" onClick={() => setEditModalOpen(false)}>❌ Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
