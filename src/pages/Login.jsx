import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Login.css';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ลบ token และ redirect กลับ /login เพื่อ refresh state (ถ้ามี token อยู่)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      window.location.replace(`${window.location.origin}/Local-Vibes-Web-app/login`)
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email.trim()) {
      setError('กรุณากรอกชื่อผู้ใช้หรือเบอร์โทรศัพท์');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password
      });

      const { token, username } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      window.location.href = '/'; // กลับหน้าแรกหลัง login สำเร็จ
    } catch (error) {
      setLoading(false);
      if (error.response) {
        setError(error.response.data.error || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      } else {
        setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-sidebar">
        <h1 className="login-sidebar-title">ยินดีต้อนรับสู่ Local Vibes!</h1>
        <p className="login-sidebar-description">
          มาค้นหาประสบการณ์ที่เป็นของคุณเอง ร่วมเดินทางไปกับเรา และสร้างช่วงเวลาที่พิเศษไม่เหมือนใคร
        </p>
      </div>

      <div className="login-form">
        <h2 className="login-form-title">ยินดีต้อนรับกลับมา!</h2>
        <p className="login-form-subtitle">ขอให้เป็นวันที่ดี :-)</p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="login-form-group">
            <label htmlFor="email">ชื่อผู้ใช้หรือเบอร์โทรศัพท์</label>
            <input
              type="text"
              id="email"
              placeholder="กรอกชื่อผู้ใช้หรือเบอร์โทรศัพท์ของคุณ"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              placeholder="กรอกรหัสผ่านของคุณ"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-button" type="submit" disabled={loading}>
            {loading ? <div className="spinner" /> : 'ลงชื่อเข้าใช้'}
          </button>
        </form>

        <div className="signup-link">
          ยังไม่มีบัญชีใช่ไหม? <Link to="/register">สร้างบัญชี</Link>
        </div>
      </div>
    </div>
  
  );
};

export default Login;




