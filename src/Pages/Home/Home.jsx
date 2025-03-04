import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  // ✅ Fetch posts when component mounts
  useEffect(() => {
    fetch("http://localhost:3000/posts")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setTrendingPosts(data.filter((post) => post.isTrending)); // Trending posts
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  // ✅ Filter posts by category
  const filteredPosts = selectedCategory === "All" ? posts : posts.filter((post) => post.category === selectedCategory);

  return (
    <div className="home-container">
      <h1>Welcome to the Blog Platform</h1>
      <p>Select a blog post to read or create a new one.</p>

      {/* 🚀 Show login & sign-up buttons when NOT logged in */}
      {!isAuthenticated && (
        <div className="auth-buttons">
          <Link to="/login" className="btn login-btn">Login</Link>
          <Link to="/register" className="btn signup-btn">Sign Up</Link>
        </div>
      )}

      {/* 🔥 Trending Posts */}
      <div className="trending-section">
        <h2>🔥 Trending Posts</h2>
        {trendingPosts.length > 0 ? (
          trendingPosts.map((post) => (
            <div key={post.id} className="trending-post">
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            </div>
          ))
        ) : (
          <p>No trending posts available.</p>
        )}
      </div>

      {/* 📌 Category Filters */}
      <div className="category-filters">
        {["All", "Technology", "Health", "Business"].map((category) => (
          <button key={category} className={selectedCategory === category ? "active" : ""} onClick={() => setSelectedCategory(category)}>
            {category}
          </button>
        ))}
      </div>

      {/* 📝 Recent Blog Posts */}
      <div className="post-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <h3>{post.title}</h3>
              <p>{post.description}</p>
              <Link to={`/post/${post.id}`} className="read-more">
                Read More
              </Link>
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;
