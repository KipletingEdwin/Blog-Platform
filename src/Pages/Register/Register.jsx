import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = ({ setIsAuthenticated }) => {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Handle Input Changes
  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate input fields
    if (!userData.username || !userData.password || !userData.confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: userData.username,
          password: userData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful:", data);

        // ✅ Store token and auto-login
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", userData.username);

        setIsAuthenticated(true);

        // ✅ Redirect to home page
        navigate("/");

      } else {
        setError(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <h2>Create an Account</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" value={userData.username} onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" value={userData.password} onChange={handleChange} required />
        <input type="password" name="confirmPassword" placeholder="Confirm Password" value={userData.confirmPassword} onChange={handleChange} required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Register;
