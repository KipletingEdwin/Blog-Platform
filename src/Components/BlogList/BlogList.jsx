import React, { useEffect, useState } from "react";
import './BlogLis.css'
import axios from "axios";
import { Link } from "react-router-dom";

const BlogList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/posts").then((res) => setPosts(res.data));
  }, []);

  return (
    <div>
      <h2>All Blog Posts</h2>
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
