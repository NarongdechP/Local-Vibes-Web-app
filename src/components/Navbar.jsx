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
      <FaUserCircle className="text-2xl" />
    </nav>
  );
};

export default Navbar;
