import React from 'react';
import './Login.css';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-sidebar">
        <div className="logo-container">
          <div className="logo-text">LOGO</div>
        </div>
        <h1 className="sidebar-title">ยินดีต้อนรับสู่ Local Vibes!</h1>
        <p className="sidebar-description">มาค้นหาประสบการณ์ที่เป็นของคุณเอง ร่วมเดินทางไปกับเรา และสร้างช่วงเวลาที่พิเศษไม่เหมือนใคร</p>
      </div>
      
      <div className="login-form">
        <h2 className="form-title">ยินดีต้อนรับกลับมา!</h2>
        <p className="form-subtitle">ขอให้เป็นวันที่ดี :-) </p>
        
        <div className="form-group">
          <label htmlFor="email">ชื่อผู้ใช้หรือเบอร์โทรศัพท์</label>
          <input type="text" id="email" placeholder="กรอกชื่อผู้ใช้หรือเบอร์โทรศัพท์ของคุณ" />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">รหัสผ่าน</label>
          <input type="password" id="password" placeholder="กรอกรหัสผ่านของคุณ" />
        </div>
        
        <button className="login-button">ลงชื่อเข้าใช้</button>
        
        <div className="signup-link">
          ยังไม่มีบัญชีใช่ไหม? <a href="#">สร้างบัญชี</a>
        </div>
      </div>
    </div>
  );
};

export default Login;