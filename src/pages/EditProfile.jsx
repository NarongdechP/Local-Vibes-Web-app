import React, { useState } from 'react';
import './EditProfile.css';

function EditProfile() {
  // ข้อมูลผู้ใช้จาก localStorage
  const [user, setUser] = useState({
    username: localStorage.getItem('username') || '',
    lastname: '',
    phone: '',
    email: localStorage.getItem('email') || '',
    address: ''
  });

  // สถานะสำหรับการเปลี่ยนอีเมลและรหัสผ่าน
  const [activeForm, setActiveForm] = useState('profile'); // 'profile', 'email', 'password'
  const [newEmail, setNewEmail] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('username', user.username);
    localStorage.setItem('email', user.email);
    alert('บันทึกข้อมูลเรียบร้อย!');
  };

  const handleSaveNewEmail = (e) => {
    e.preventDefault();
    setUser(prev => ({ ...prev, email: newEmail }));
    localStorage.setItem('email', newEmail);
    setActiveForm('profile');
    alert('อีเมลถูกเปลี่ยนเรียบร้อย!');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    // เพิ่ม logic ตรวจสอบรหัสผ่านและเปลี่ยนรหัสที่นี่
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('รหัสผ่านใหม่ไม่ตรงกัน!');
      return;
    }
    alert('เปลี่ยนรหัสผ่านเรียบร้อย!');
    setActiveForm('profile');
  };

  return (
    <div className="edit-profile-container">
      {/* เมนูด้านซ้าย */}
      <div className="sidebar">
        <h3>บัญชี</h3>
        <ul>
          <li 
            className={activeForm === 'profile' ? 'active' : ''}
            onClick={() => setActiveForm('profile')}
          >
            ข้อมูลส่วนตัว
          </li>
          <li 
            className={activeForm === 'email' ? 'active' : ''}
            onClick={() => {
              setActiveForm('email');
              setNewEmail(user.email);
            }}
          >
            เปลี่ยนอีเมล
          </li>
          <li 
            className={activeForm === 'password' ? 'active' : ''}
            onClick={() => {
              setActiveForm('password');
              setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
              });
            }}
          >
            เปลี่ยนรหัสผ่าน
          </li>
        </ul>
      </div>

      {/* เนื้อหาหลัก */}
      <div className="profile-content">
        {activeForm === 'profile' ? (
          <>
            <h1>ข้อมูลส่วนตัว</h1>
            <h3>ข้อมูลผู้ใช้</h3>

            <div className="profile-image">
              <div className="image-placeholder" />
              <p>เปลี่ยนรูปโปรไฟล์</p>
            </div>

            <form onSubmit={handleSave}>
              <div className="form-row">
                <input
                  name="username"
                  type="text"
                  placeholder="ชื่อ"
                  value={user.username}
                  onChange={handleInputChange}
                />
                <input
                  name="lastname"
                  type="text"
                  placeholder="นามสกุล"
                  value={user.lastname}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <input
                  name="phone"
                  type="text"
                  placeholder="หมายเลขโทรศัพท์"
                  value={user.phone}
                  onChange={handleInputChange}
                />
                <div className="email-display">
                </div>
              </div>

              <div className="form-row">
                <input
                  name="address"
                  type="text"
                  placeholder="ที่อยู่"
                  value={user.address}
                  onChange={handleInputChange}
                  className="address-input"
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="button-confirm">บันทึก</button>
                <button type="button" className="button-cancel">ยกเลิก</button>
              </div>
            </form>
          </>
        ) : activeForm === 'email' ? (
          <div className="email-change-form">
            <h2>เปลี่ยนอีเมล</h2>
            <form onSubmit={handleSaveNewEmail}>
              <div className="form-group">
                <label>อีเมลปัจจุบัน</label>
                <input 
                  type="email" 
                  value={user.email} 
                  disabled 
                />
              </div>
              
              <div className="form-group">
                <label>อีเมลใหม่</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="button-confirm">ยืนยัน</button>
                <button 
                  type="button" 
                  className="button-cancel"
                  onClick={() => setActiveForm('profile')}
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="password-change-form">
            <h2>เปลี่ยนรหัสผ่าน</h2>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>รหัสผ่านปัจจุบัน</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>รหัสผ่านใหม่</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>ยืนยันรหัสผ่านใหม่</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="button-confirm">ยืนยัน</button>
                <button 
                  type="button" 
                  className="button-cancel"
                  onClick={() => setActiveForm('profile')}
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditProfile;