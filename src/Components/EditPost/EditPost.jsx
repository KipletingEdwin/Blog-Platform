// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "./EditPost.css";

// const EditPost = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [post, setPost] = useState({ title: "", content: "", category: "" });

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     fetch(`http://localhost:3000/posts/${id}`)
//       .then((res) => res.json())
//       .then((data) => setPost(data))
//       .catch((err) => console.error("Error fetching post:", err));
//   }, [id]);

//   // ✅ Handle Update
//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");

//     try {
//       const response = await fetch(`http://localhost:3000/posts/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(post),
//       });

//       if (response.ok) {
//         alert("Post updated successfully!");
//         navigate(`/post/${id}`); // Redirect after update
//       } else {
//         console.error("Error updating post:", await response.json());
//       }
//     } catch (err) {
//       console.error("Network error:", err);
//     }
//   };

//   return (
//     <div className="editpost-container">
//       <h2>Edit Post</h2>
//       <form onSubmit={handleUpdate}>
//         <input
//           type="text"
//           placeholder="Title"
//           value={post.title}
//           onChange={(e) => setPost({ ...post, title: e.target.value })}
//           required
//         />
//         <textarea
//           placeholder="Content"
//           value={post.content}
//           onChange={(e) => setPost({ ...post, content: e.target.value })}
//           required
//         />
//         <input
//           type="text"
//           placeholder="Category"
//           value={post.category}
//           onChange={(e) => setPost({ ...post, category: e.target.value })}
//           required
//         />
//         <button type="submit">Update Post</button>
//       </form>
//     </div>
//   );
// };

// export default EditPost;
