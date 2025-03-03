import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setIsAuthenticated }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState(""); // For error handling
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);

        // ✅ Store authentication details in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userRole", data.user.role); // Save user role (admin/user)
        localStorage.setItem("username", data.user.username); // Store username

        setIsAuthenticated(true); // Update authentication state
        navigate("/"); // Redirect to Home page
      } else {
        setError("Invalid username or password"); // Show error message
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
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
    </div>
  );
};

export default Login;
