import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EventDetail = () => {
  const { id } = useParams(); // รับ id จาก URL
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
    </div>
  );
};

export default EventDetail;

