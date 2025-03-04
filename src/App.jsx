import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // ❌ Remove BrowserRouter here
import Navbar from "./Components/Navbar/Navbar";
import Home from "./Pages/Home/Home";
import BlogPost from "./Components/BlogPost/BlogPost";
import CreatePost from "./Components/CreatePost/CreatePost";
import Login from "./Pages/Login/Login";
import Register from "./Pages/Register/Register";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
    setUserRole(localStorage.getItem("userRole") || "user");
  }, []);

  return (
    <>
      {isAuthenticated && <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} userRole={userRole} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/post/:id" element={<BlogPost />} />
        <Route path="/create" element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/admin" element={userRole === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
