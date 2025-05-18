import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [favError, setFavError] = useState("");
  const [favLoading, setFavLoading] = useState(false);

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
    setFavError("");
    setFavLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setFavError("กรุณาเข้าสู่ระบบก่อนเพิ่มรายการโปรด");
        setFavLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3000/favorites/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/FavoritePage");
      } else {
        setFavError(data.message || "ไม่สามารถเพิ่มรายการโปรดได้");
      }
    } catch (err) {
      console.error(err);
      setFavError("เกิดข้อผิดพลาดในการเพิ่มรายการโปรด");
    } finally {
      setFavLoading(false);
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
      <p>
        📅 วันที่:{" "}
        {new Date(event.start_date).toLocaleDateString()} -{" "}
        {new Date(event.end_date).toLocaleDateString()}
      </p>
      <p>📍 สถานที่: {event.location || "ไม่ระบุ"}</p>
      <p>🎭 หมวดหมู่: {event.category || "ไม่ระบุ"}</p>
      <p>📄 รายละเอียด: {event.description || "ไม่มีรายละเอียดเพิ่มเติม"}</p>

      {/* แสดง error ของ favorite */}
      {favError && <p style={{ color: "red" }}>❌ {favError}</p>}

      {/* 🔴 ปุ่มชื่นชอบ */}
      <button
        onClick={handleFavorite}
        disabled={favLoading}
        className="favorite-btn"
        style={{
          marginTop: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          backgroundColor: "transparent",
          border: "1px solid red",
          padding: "0.5rem 1rem",
          cursor: favLoading ? "not-allowed" : "pointer",
          color: "red",
        }}
      >
        <FaHeart />
        <span>{favLoading ? "กำลังเพิ่ม..." : "เพิ่มในรายการชื่นชอบ"}</span>
      </button>
    </div>
  );
};

export default EventDetail;
