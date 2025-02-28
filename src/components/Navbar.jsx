import React from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">LOGO</div>
      <div className="navbar-links">
        <Link to="/">หน้าหลัก</Link>
        <Link to="/create">สร้างอีเวนต์</Link>
      </div>
      <Link to="/login" className="flex items-center space-x-2">
        <FaUserCircle className="text-2xl" /> 
        <span>Login</span> 
      </Link>
    </nav>
  );
};

export default Navbar;
