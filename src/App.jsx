import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Home from './Pages/Home/Home';
import BlogPost from "./Components/BlogPost/BlogPost";
import CreatePost from "./Components/CreatePost/CreatePost";
import Login from "./Components/Login/Login";
import Register from './Pages/Register/Register';
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("user");

  useEffect(() => {
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";
    const storedRole = localStorage.getItem("userRole") || "user";

    console.log("Retrieved Auth from localStorage:", storedAuth);
    console.log("Retrieved Role from localStorage:", storedRole);

    setIsAuthenticated(storedAuth);
    setUserRole(storedRole);
  }, []);

  return (
    <>
      {/* ✅ Show Navbar only if authenticated */}
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}

      <Routes>
  <Route path="/" element={<Home />} /> 
  <Route path="/post/:id" element={<BlogPost />} />
  <Route path="/create" element={isAuthenticated ? <CreatePost /> : <Navigate to="/login" />} />
  <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
  <Route path="/register" element={<Register />} />
  <Route path="/admin" element={userRole === "admin" ? <AdminDashboard /> : <Navigate to="/" />} />
</Routes>


    </>
  );
}

export default App;
