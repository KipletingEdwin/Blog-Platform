import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [categories, setCategories] = useState(["All", "Technology", "Health", "Business"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [trendingPosts, setTrendingPosts] = useState([]); // Trending posts

  useEffect(() => {
    // Fetch blog posts from backend
    fetch("http://localhost:3000/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setFilteredPosts(data);
        setTrendingPosts(data.sort((a, b) => b.likes - a.likes).slice(0, 3)); // Top 3 most liked posts
      })
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "All") {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter((post) => post.category === category));
    }
  };

  return (
    <div className="home-container">
      <h1>Welcome to the Blog Platform</h1>
      <p>Select a blog post to read or create a new one.</p>

      {/* Trending Posts Section */}
      <section className="trending-section">
        <h2>🔥 Trending Posts</h2>
        <div className="trending-posts">
          {trendingPosts.map((post) => (
            <div key={post.id} className="trending-post">
              <h3>
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              </h3>
              <p>{post.description}</p>
              <span>👍 {post.likes} Likes</span>
            </div>
          ))}
        </div>
      </section>

      {/* Category Filtering */}
      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category}
            className={selectedCategory === category ? "active" : ""}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blog Posts */}
      <section className="blog-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <div key={post.id} className="blog-item">
              <h2>
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              </h2>
              <p>{post.description}</p>
              <span>📝 By {post.author} | 📅 {new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </section>
    </div>
  );
};

export default Home;
