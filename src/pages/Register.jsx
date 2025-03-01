import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("สมัครสมาชิกสำเร็จ!");
  };

  return (
    <div className="register-container">
      {/* Sidebar */}
      <div className="register-sidebar">
        <div className="logo-container">
          <div className="logo-text">LOGO</div>
        </div>
        <h1 className="sidebar-title">ยินดีต้อนรับสู่ Local Vibes!</h1>
        <p className="sidebar-description">
          มาค้นหาประสบการณ์ที่เป็นของคุณเอง ร่วมเดินทางไปกับเรา
          และสร้างช่วงเวลาที่พิเศษไม่เหมือนใคร
        </p>
      </div>

      {/* Register Form */}
      <div className="register-form">
        <h2 className="form-title">สร้างบัญชีผู้ใช้</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>ชื่อ - นามสกุล</label>
            <input
              type="text"
              placeholder="กรอกชื่อของคุณ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>อีเมลหรือเบอร์โทรศัพท์</label>
            <input
              type="text"
              placeholder="กรอกอีเมลหรือเบอร์โทรศัพท์ของคุณ"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>รหัสผ่าน</label>
            <input
              type="password"
              placeholder="กรอกรหัสผ่านของคุณ"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="register-button" type="submit">สร้าง</button>
        </form>

        <div className="login-link">
          มีบัญชีอยู่แล้วใช่ไหม? <Link to="/login">ลงชื่อเข้าใช้</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
