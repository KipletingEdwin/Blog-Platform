import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/posts").then((res) => setPosts(res.data));
    axios.get("http://localhost:3000/comments").then((res) => setComments(res.data));
  }, []);

  const deletePost = async (postId) => {
    await axios.delete(`http://localhost:3000/posts/${postId}`);
    setPosts(posts.filter((post) => post.id !== postId));
  };

  const deleteComment = async (commentId) => {
    await axios.delete(`http://localhost:3000/comments/${commentId}`);
    setComments(comments.filter((comment) => comment.id !== commentId));
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <h3>Manage Posts</h3>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <button onClick={() => deletePost(post.id)}>Delete</button>
        </div>
      ))}
      <h3>Manage Comments</h3>
      {comments.map((comment) => (
        <div key={comment.id}>
          <p>{comment.text}</p>
          <button onClick={() => deleteComment(comment.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
