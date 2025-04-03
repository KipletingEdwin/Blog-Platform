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

  const categories = ["Technology", "Health", "Business", "Education", "Entertainment"];

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem("token"); // ✅ Retrieve token from localStorage
  
    try {
      const response = await axios.post(
        "https://blogpost-api-h8mq.onrender.com/posts",
        { title, content, category },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Include the token in the request headers
          },
        }
      );
  
      console.log("Post created successfully:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error.response?.data || error.message);
    }
  };
  

  return (
    <div>
      <h2>Create New Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />

         {/* ✅ Dropdown for Category Selection */}
         <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>


        <ReactQuill value={content} onChange={setContent} />
        <button type="submit">Publish</button>
      </form>
    </div>
  );
};

export default CreatePost;
