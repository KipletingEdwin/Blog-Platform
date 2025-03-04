import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ isAuthenticated, setIsAuthenticated, userRole }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "Guest"; // Store username in localStorage

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">My Blog</Link>
      </div>

      {/* Burger Menu for Mobile */}
      <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>

        {isAuthenticated ? (
          <>
            <li><Link to="/create" onClick={() => setMenuOpen(false)}>Create Post</Link></li>
            {userRole === "admin" && <li><Link to="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link></li>}

            {/* User Profile */}
            <li className="profile-section">
              <span className="username">👤 {username}</span>
            </li>

            <li>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="auth-btn">Login</Link></li>
            <li><Link to="/register" className="auth-btn signup-btn">Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
