import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // ✅ Import Link for navigation
import "./Login.css";

const Login = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", data.role || "user");
        setIsAuthenticated(true);
        navigate("/home");
      } else {
        alert("Login failed: " + data.error);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>

      {/* 📝 Sign Up Link */}
      <p className="signup-text">
        Don't have an account? <Link to="/register" className="signup-link">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
