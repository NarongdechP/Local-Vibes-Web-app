import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    // ตรวจสอบชื่อ - นามสกุล (ต้องมีอักขระอย่างน้อย 2 ตัว)
    if (name.trim().length < 3) {
      errors.name = "กรุณากรอกชื่อ - นามสกุลอย่างน้อย 3 ตัวอักษร";
      isValid = false;
    }

    // ตรวจสอบอีเมลหรือเบอร์โทรศัพท์
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;
    if (!emailPattern.test(email) && !phonePattern.test(email)) {
      errors.email = "กรุณากรอกอีเมลที่ถูกต้องหรือเบอร์โทรศัพท์ 10 หลัก";
      isValid = false;
    }

    // ตรวจสอบรหัสผ่าน 
    if (password.length < 8) {
      errors.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("สมัครสมาชิกสำเร็จ!");
    }
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
            {errors.name && <p className="error-message">{errors.name}</p>}
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
            {errors.email && <p className="error-message">{errors.email}</p>}
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
            {errors.password && <p className="error-message">{errors.password}</p>}
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
