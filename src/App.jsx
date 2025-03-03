import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // ❌ No BrowserRouter here!
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";

function App() {

  const[isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(()=>{

    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);

  },[localStorage.getItem("isAuthenticated")]);

  return (
    <>
      {/* ✅ Show Navbar only after login */}
      {isAuthenticated && <Navbar setIsAuthenticated={setIsAuthenticated} />}

      <Routes>
        <Route path="/" element={isAuthenticated ? <Navigate to="/home" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/home" element={isAuthenticated ? <Home setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
