import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // รีเซ็ตข้อความแจ้งเตือนก่อนตรวจสอบ
    setError('');

    // ตรวจสอบช่องกรอกข้อมูล
    if (!email.trim()) {
      setError('กรุณากรอกชื่อผู้ใช้หรือเบอร์โทรศัพท์');
      return;
    }

    if (password.length < 8) {
      setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      return;
    }

    // ถ้าข้อมูลถูกต้อง ส่งไปยังระบบ Login (ในที่นี้แค่แสดง alert)
    alert('เข้าสู่ระบบสำเร็จ!');
  };

  return (
    <div className="login-container">
      <div className="login-sidebar">
        <div className="logo-container">
          <div className="logo-text">LOGO</div>
        </div>
        <h1 className="sidebar-title">ยินดีต้อนรับสู่ Local Vibes!</h1>
        <p className="sidebar-description">
          มาค้นหาประสบการณ์ที่เป็นของคุณเอง ร่วมเดินทางไปกับเรา และสร้างช่วงเวลาที่พิเศษไม่เหมือนใคร
        </p>
      </div>

      <div className="login-form">
        <h2 className="form-title">ยินดีต้อนรับกลับมา!</h2>
        <p className="form-subtitle">ขอให้เป็นวันที่ดี :-)</p>

        {/* แสดงข้อความแจ้งเตือนถ้ามีข้อผิดพลาด */}
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">ชื่อผู้ใช้หรือเบอร์โทรศัพท์</label>
            <input
              type="text"
              id="email"
              placeholder="กรอกชื่อผู้ใช้หรือเบอร์โทรศัพท์ของคุณ"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              type="password"
              id="password"
              placeholder="กรอกรหัสผ่านของคุณ"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-button" type="submit">ลงชื่อเข้าใช้</button>
        </form>
        <div className="signup-link">
            ยังไม่มีบัญชีใช่ไหม? <Link to="/register">สร้างบัญชี</Link>
        </div>
        <div/>
        </div>
      </div>
  );
};

export default Login;
