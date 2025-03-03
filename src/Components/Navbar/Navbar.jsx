import React from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({setIsAuthenticated}) => { 
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
  
    setIsAuthenticated(false); // ✅ Update state immediately
    window.dispatchEvent(new Event("storage")); // ✅ Notify other components
    navigate("/login"); // ✅ Redirect to login page
  };
  


  return (
    <nav className='navbar'>
      <Link to="/home">Home</Link> 
      <button onClick={handleLogout}>Logout</button>

    </nav>
  )
}

export default Navbar