import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  // ดึง username จาก localStorage เมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);  // useEffect จะทำงานแค่ครั้งเดียวเมื่อคอมโพเนนต์โหลด

  // ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    localStorage.removeItem('token');  // ลบ token
    localStorage.removeItem('username');  // ลบ username
    setUsername(null);  // ตั้งค่า username เป็น null
    navigate('/login');  // รีไดเรกต์ไปยังหน้า login
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">LOGO</div>

      <div className="navbar-links">
        <Link to="/">หน้าหลัก</Link>
        <Link to="/create">สร้างอีเวนต์</Link>
      </div>

      <div className="navbar-user">
        {username ? (
          <div className="flex items-center space-x-3">
            <FaUserCircle className="text-2xl" />
            <span>{username}</span>
            <button onClick={handleLogout} className="logout-button">
              ออกจากระบบ
            </button>
          </div>
        ) : (
          <Link to="/login" className="flex items-center space-x-2">
            <FaUserCircle className="text-2xl" />
            <span>เข้าสู่ระบบ</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

