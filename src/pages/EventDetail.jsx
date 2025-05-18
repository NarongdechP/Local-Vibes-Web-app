import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:3000/events/${id}`);
        const data = await response.json();

        if (response.ok) {
          setEvent(data.event);
        } else {
          setErrorMsg(data.error || "ไม่สามารถโหลดข้อมูลได้");
        }
      } catch (error) {
        setErrorMsg("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/favorites/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: id }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/favorites");
      } else {
        alert(data.error || "ไม่สามารถเพิ่มรายการโปรดได้");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการเพิ่มรายการโปรด");
    }
  };

  if (loading) return <div>⏳ กำลังโหลดข้อมูลอีเวนต์...</div>;
  if (errorMsg) return <div style={{ color: "red" }}>❌ {errorMsg}</div>;
  if (!event) return <div>ไม่พบข้อมูล</div>;

  return (
    <div className="event-detail">
      <h2>{event.event_name}</h2>
      <img
        src={event.event_image_url || "/placeholder-image.jpg"}
        alt={event.event_name}
        style={{ width: "100%", maxWidth: "500px", marginBottom: "1rem" }}
      />
      <p>📅 วันที่: {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}</p>
      <p>📍 สถานที่: {event.location || "ไม่ระบุ"}</p>
      <p>🎭 หมวดหมู่: {event.category || "ไม่ระบุ"}</p>
      <p>📄 รายละเอียด: {event.description || "ไม่มีรายละเอียดเพิ่มเติม"}</p>

      {/* 🔴 ปุ่มชื่นชอบ */}
      <button onClick={handleFavorite} className="favorite-btn" style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'transparent', border: '1px solid red', padding: '0.5rem 1rem', cursor: 'pointer', color: 'red' }}>
        <FaHeart />
        <span>เพิ่มในรายการชื่นชอบ</span>
      </button>
    </div>
  );
};

export default EventDetail;
