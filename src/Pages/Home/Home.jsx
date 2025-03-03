import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/posts") // Adjust this based on your API
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero">
        <h1>Welcome to the Blog Platform</h1>
        <p>Discover and share amazing stories.</p>
      </header>

      {/* Blog Posts Section */}
      <section className="blog-list">
        <h2>Recent Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="blog-post">
              <h3>{post.title}</h3>
              <p>{post.description.substring(0, 100)}...</p>
              <Link to={`/post/${post.id}`} className="read-more">Read More</Link>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </section>

      {/* CTA Section */}
      <div className="cta">
        <Link to="/create" className="cta-button">Write a Post</Link>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Blog Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
