import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3000/categories").then((res) => setCategories(res.data));
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = () => {
    axios.get(`http://localhost:3000/posts?category=${selectedCategory}`).then((res) => setPosts(res.data));
  };

  return (
    <div>
      <h2>All Blog Posts</h2>
      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>
      {posts.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.category}</p>
          <Link to={`/post/${post.id}`}>Read More</Link>
        </div>
      ))}
    </div>
  );
};

export default BlogList;
