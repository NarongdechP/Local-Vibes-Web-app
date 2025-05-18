import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaHeart } from "react-icons/fa";

const Favorite = () => {
  const navigate = useNavigate();

  const handleFavoriteClick = async () => {
    try {
      const token = localStorage.getItem("token");

      // เรียก API เพื่อเพิ่มรายการโปรด (ถ้ามีข้อมูล event ให้ส่งด้วย)
      await axios.post(
        "http://localhost:3000/favorites/add",
        { eventId: "123" }, // ส่ง eventId จริงที่คุณต้องการบันทึก
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // หลังจากเรียก API สำเร็จ ให้ไปหน้า /favorites
      navigate("/favorites");
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการเพิ่มรายการโปรด:", error);
      alert("ไม่สามารถเพิ่มรายการโปรดได้");
    }
  };

  return (
    <button onClick={handleFavoriteClick} title="รายการโปรด">
      <FaHeart style={{ color: "red", fontSize: "1.5rem" }} />
    </button>
  );
};

export default Favorite;
