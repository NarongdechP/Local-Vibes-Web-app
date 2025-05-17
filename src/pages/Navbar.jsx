import React, { useEffect, useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle } from "react-icons/fa";
import Favorite from './Favorite';  // ปุ่มหัวใจ

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUsername(null);
    navigate('/login');
  };

  return (
    <nav className="navbar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="navbar-logo">LOGO</div>

      <div className="navbar-links" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/">หน้าหลัก</Link>
        <Link to="/create">สร้างอีเวนต์</Link>
      </div>

      <div className="navbar-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {username ? (
          <>
            <FaUserCircle className="text-2xl" />
            <Link to="/edit-profile" className="text-blue-500 hover:underline">
              <span>{username}</span>
            </Link>

            {/* Favorite อยู่ตรงกลางระหว่างชื่อผู้ใช้กับปุ่มออกจากระบบ */}
            <Favorite />

            <button onClick={handleLogout} className="logout-button">
              ออกจากระบบ
            </button>
          </>
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
