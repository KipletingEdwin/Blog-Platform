import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = ({ isAuthenticated }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setPosts([]); // Set to empty for now
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to the Blog Platform</h1>
      <p className="home-subtitle">Select a blog post to read or create a new one.</p>

      {/* Trending Section */}
      <div className="trending-section">
        <h2 className="trending-title">🔥 Trending Posts</h2>
      </div>

      {/* Categories */}
      <div className="category-filters">
        <button className="category-btn active">All</button>
        <button className="category-btn">Technology</button>
        <button className="category-btn">Health</button>
        <button className="category-btn">Business</button>
      </div>

      {/* Blog Posts */}
      <div className="posts-container">
        {loading ? (
          // Skeleton Loader
          <>
            <div className="post-skeleton"></div>
            <div className="post-skeleton"></div>
            <div className="post-skeleton"></div>
          </>
        ) : posts.length === 0 ? (
          // Call-to-Action When No Posts Exist
          <div className="no-posts">
            <p>No posts yet! Be the first to create an awesome blog post. 🚀</p>
            {isAuthenticated && (
              <Link to="/create" className="create-post-btn">
                Create Post
              </Link>
            )}
          </div>
        ) : (
          // Render Blog Posts Here (Currently Empty)
          posts.map((post) => <div key={post.id} className="post-card">{post.title}</div>)
        )}
      </div>
    </div>
  );
};

export default Home;
