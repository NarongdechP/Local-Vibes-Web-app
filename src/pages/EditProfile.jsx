import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './EditProfile.css';

function EditProfile() {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState({
    username: '',
    email: '',
    phone: '',
    address: ''
  });
  const [activeForm, setActiveForm] = useState('profile');
  const [newEmail, setNewEmail] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [emailChangeSuccess, setEmailChangeSuccess] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
        setNewEmail(''); // เริ่มต้นให้ว่างไว้
      } catch (error) {
        console.error('ไม่สามารถดึงข้อมูลผู้ใช้ได้', error);
        alert('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
      }
    };

    fetchUserProfile();
  }, [token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        'http://localhost:3000/auth/profile',
        {
          username: user.username,
          phone: user.phone,
          address: user.address
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      alert('บันทึกข้อมูลเรียบร้อย!');
    } catch (error) {
      console.error(error);
      alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    }
  };

  const handleSaveNewEmail = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        'http://localhost:3000/auth/change-email',
        { newEmail },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUser(prev => ({ ...prev, email: newEmail }));
      setEmailChangeSuccess(true);
      alert('อีเมลถูกเปลี่ยนเรียบร้อย!');
      setActiveForm('profile');
    } catch (error) {
      console.error(error);
      alert('ไม่สามารถเปลี่ยนอีเมลได้');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('รหัสผ่านใหม่ไม่ตรงกัน!');
      return;
    }

    try {
      await axios.post(
        'http://localhost:3000/auth/change-password',
        {
          oldPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('เปลี่ยนรหัสผ่านเรียบร้อย!');
      setActiveForm('profile');
    } catch (error) {
      console.error(error);
      alert('ไม่สามารถเปลี่ยนรหัสผ่านได้');
    }
  };

  return (
    <div class="edit-profile-container">
      <div class="sidebar">
        <h3>  </h3>
        
        <ul>
          <li class={activeForm === 'profile' ? 'active' : ''} onClick={() => setActiveForm('profile')}>
            ข้อมูลส่วนตัว
          </li>
          <li class={activeForm === 'email' ? 'active' : ''} onClick={() => {
            setActiveForm('email');
            setNewEmail(''); // ให้ช่องอีเมลใหม่ว่าง
            setEmailChangeSuccess(false);
          }}>
            เปลี่ยนอีเมล
          </li>
          <li className={activeForm === 'password' ? 'active' : ''} onClick={() => {
            setActiveForm('password');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
          }}>
            เปลี่ยนรหัสผ่าน
          </li>
        </ul>
      </div>

      <div className="profile-content">
        {activeForm === 'profile' && (
          <>
            <h1>ข้อมูลส่วนตัว</h1>
            <h3 className='h3-subtitle'>ข้อมูลผู้ใช้</h3>
            <form onSubmit={handleSave}>
              <div className="form-row">
                <input name="username" type="text" placeholder="ชื่อ" value={user.username} onChange={handleInputChange} />
                <input name="phone" type="text" placeholder="หมายเลขโทรศัพท์" value={user.phone} onChange={handleInputChange} />
              </div>
              <div className="form-row">
                <input name="address" type="text" placeholder="ที่อยู่" value={user.address} onChange={handleInputChange} className="address-input" />
              </div>
              <div className="form-buttons">
                <button type="submit" className="button-confirm">บันทึก</button>
              </div>
            </form>
          </>
        )}

        {activeForm === 'email' && (
          <div className="email-change-form">
            <h2>เปลี่ยนอีเมล</h2>
            <form onSubmit={handleSaveNewEmail}>
              <div className="form-group">
                <label>อีเมลปัจจุบัน</label>
                <input type="email" value={user.email} disabled />
              </div>
              <div className="form-group">
                <label>อีเมลใหม่</label>
                <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
              </div>
              {emailChangeSuccess && <p className="success-text">เปลี่ยนอีเมลสำเร็จ</p>}
              <div className="form-buttons">
                <button type="submit" className="button-confirm">ยืนยัน</button>
              </div>
            </form>
          </div>
        )}

        {activeForm === 'password' && (
          <div className="password-change-form">
            <h2>เปลี่ยนรหัสผ่าน</h2>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>รหัสผ่านปัจจุบัน</label>
                <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
              </div>
              <div className="form-group">
                <label>รหัสผ่านใหม่</label>
                <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
              </div>
              <div className="form-group">
                <label>ยืนยันรหัสผ่านใหม่</label>
                <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} required />
              </div>
              <div className="form-buttons">
                <button type="submit" className="button-confirm">ยืนยัน</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditProfile;

