import React, { useState } from 'react'; 
import axios from 'axios';  // เพิ่ม axios
import './Login.css';
import { Link} from 'react-router-dom';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // สถานะการโหลด

  const handleSubmit = async (e) => {
    e.preventDefault();

    // รีเซ็ตข้อความแจ้งเตือนก่อนตรวจสอบ
    setError('');
    setLoading(true);  // เริ่มโหลด

    // ตรวจสอบช่องกรอกข้อมูล
    if (!email.trim()) {
      setError('กรุณากรอกชื่อผู้ใช้หรือเบอร์โทรศัพท์');
      setLoading(false);  // หยุดโหลด
      return;
    }

    if (password.length < 8) {
      setError('รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร');
      setLoading(false);  // หยุดโหลด
      return;
    }

    try {
      // ส่งข้อมูลเข้าสู่ระบบไปยัง Backend
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password
      });

      // ถ้าสำเร็จ
      alert('เข้าสู่ระบบสำเร็จ!');
      setLoading(false);  // หยุดโหลด

      // คุณสามารถเก็บ token หรือข้อมูลการเข้าสู่ระบบอื่นๆ ใน LocalStorage หรือ State ได้
      // localStorage.setItem('token', response.data.token);
      
    } catch (error) {
      setLoading(false);  // หยุดโหลด

      // ตรวจสอบ error ที่ได้รับจาก Backend
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
        <div className="login-logo-container">
          <div className="login-logo-text">LOGO</div>
        </div>
        <h1 className="login-sidebar-title">ยินดีต้อนรับสู่ Local Vibes!</h1>
        <p className="login-sidebar-description">
          มาค้นหาประสบการณ์ที่เป็นของคุณเอง ร่วมเดินทางไปกับเรา และสร้างช่วงเวลาที่พิเศษไม่เหมือนใคร
        </p>
      </div>

      <div className="login-form">
        <h2 className="login-form-title">ยินดีต้อนรับกลับมา!</h2>
        <p className="login-form-subtitle">ขอให้เป็นวันที่ดี :-)</p>

        {/* แสดงข้อความแจ้งเตือนถ้ามีข้อผิดพลาด */}
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
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'ลงชื่อเข้าใช้'}
          </button>
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
