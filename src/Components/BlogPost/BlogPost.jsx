import React, { useEffect, useState } from "react";
import './BlogPost.css';
import { useParams } from "react-router-dom";
import axios from "axios";
import CommentSection from "./CommentSection";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/posts/${id}`).then((res) => setPost(res.data));
  }, [id]);

  if (!post) return <p>Loading...</p>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>Category: {post.category}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
      <CommentSection postId={id} />
    </div>
  );
};

export default BlogPost;
