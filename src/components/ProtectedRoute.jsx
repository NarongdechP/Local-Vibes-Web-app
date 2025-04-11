import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // ถ้าไม่มี token ให้ redirect ไปหน้า login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ถ้ามี token แล้วให้แสดง children (component ที่อยู่ข้างใน route)
  return children;
};

export default ProtectedRoute;
