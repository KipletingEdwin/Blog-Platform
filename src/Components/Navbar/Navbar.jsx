import React from 'react'
import './Navbar.css'
import { Link, useNavigate } from 'react-router-dom'

const Navbar = ({setIsAuthenticated}) => { 
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");

    setIsAuthenticated(false);  // �� Update isAuthenticated state after logout to false

    navigate('/');
  };


  return (
    <nav className='navbar'>
      <Link to="/home">Home</Link> 
      <button onClick={handleLogout}>Logout</button>

    </nav>
  )
}

export default Navbar