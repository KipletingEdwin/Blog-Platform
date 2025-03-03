import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import './Login.css'

const Login = ({setIsAuthenticated}) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const navigate = useNavigate(); // ✅ Initialize navigate function

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

        // ✅ Store token and authentication status
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAuthenticated", "true"); 

        setIsAuthenticated(true);

        // ✅ Redirect AFTER updating localStorage
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
        <input type="text" name="username" placeholder="Username" value={credentials.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={credentials.password} onChange={handleChange} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
