import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // นำเข้า axios
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");  // ค่าชื่อ
  const [email, setEmail] = useState(""); // ค่าของอีเมล
  const [password, setPassword] = useState(""); // ค่าของรหัสผ่าน
  const [errors, setErrors] = useState({}); // ใช้จัดการข้อผิดพลาด
  const [loading, setLoading] = useState(false); // ใช้จัดการสถานะการโหลด
  const navigate = useNavigate(); // ใช้เปลี่ยนเส้นทางไปหน้า login เมื่อสมัครสำเร็จ

  // ฟังก์ชันตรวจสอบข้อมูลก่อนส่ง
  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (name.trim().length < 3) {
      errors.name = "กรุณากรอกชื่อ - นามสกุลอย่างน้อย 3 ตัวอักษร";
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9]{10}$/;
    if (!emailPattern.test(email) && !phonePattern.test(email)) {
      errors.email = "กรุณากรอกอีเมลที่ถูกต้องหรือเบอร์โทรศัพท์ 10 หลัก";
      isValid = false;
    }

    if (password.length < 8) {
      errors.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  // ฟังก์ชันจัดการการส่งข้อมูลไปที่ Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // ส่งข้อมูลไปที่ Backend
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        {
          username: name,  // ส่งข้อมูล 'username' แทน 'name' ตามที่ Backend คาดหวัง
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json", // กำหนดเป็น JSON
          },
        }
      );

      alert("✅ สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
      navigate("/login"); // เปลี่ยนเส้นทางไปที่หน้า Login
    } catch (error) {
      if (error.response) {
        setErrors({ api: error.response.data.error || "เกิดข้อผิดพลาด" });
      } else {
        setErrors({ api: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-sidebar">
        <div className="register-logo-container">
          <div className="register-logo-text">LOGO</div>
        </div>
        <h1 className="register-sidebar-title">ยินดีต้อนรับสู่ Local Vibes!</h1>
        <p className="register-sidebar-description">
          มาค้นหาประสบการณ์ที่เป็นของคุณเอง ร่วมเดินทางไปกับเรา
          และสร้างช่วงเวลาที่พิเศษไม่เหมือนใคร
        </p>
      </div>

      <div className="register-form">
        <h2 className="register-form-title">สร้างบัญชีผู้ใช้</h2>

        {errors.api && <p className="error-message">{errors.api}</p>}

        <form onSubmit={handleSubmit}>
          <div className="register-form-group">
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

          <div className="register-form-group">
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

          <div className="register-form-group">
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

          <button className="register-button" type="submit" disabled={loading}>
            {loading ? "กำลังสมัคร..." : "สร้างบัญชี"}
          </button>
        </form>

        <div className="login-link">
          มีบัญชีอยู่แล้วใช่ไหม? <Link to="/login">ลงชื่อเข้าใช้</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
