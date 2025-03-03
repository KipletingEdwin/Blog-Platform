import React, { useState } from "react";
import './CreatePost.css'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:3000/posts", { title, content, category });

    navigate("/");
  };

  return (
    <div>
      <h2>Create New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
        <ReactQuill value={content} onChange={setContent} />
        <button type="submit">Publish</button>
      </form>
    </div>
  );
};

export default CreatePost;
