import React, { useState } from "react";
import axios from "axios";
import "./Create_Event.css";

const CreateEvent = () => {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [eventImageUrl, setEventImageUrl] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const eventData = {
      event_name: eventName,
      description: description,
      start_date: startDate,
      end_date: endDate,
      location: location,
      category: category,
      event_image_url: eventImageUrl,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/events/create",
        eventData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage(response.data.message);  // แสดงข้อความจาก server
      setError(null);

      // แสดงข้อความสำเร็จ
      alert("สร้างอีเวนต์สำเร็จ!");

      // รีเซ็ตฟอร์ม
      setEventName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setLocation("");
      setCategory("");
      setEventImageUrl("");
    } catch (error) {
      setError(error.response?.data?.error || "เกิดข้อผิดพลาด");
      setMessage(null);
    }
  };

  return (
    <div className="CreateEvent-container">
      <div className="CreateEvent-form-wrapper">
        <h1 className="CreateEvent-title">สร้างอีเวนต์</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="ชื่ออีเวนต์"
            className="CreateEvent-input"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
          <textarea
            placeholder="คำอธิบาย"
            className="CreateEvent-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            type="date"
            className="CreateEvent-input"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="CreateEvent-input"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <input
            type="text"
            placeholder="สถานที่"
            className="CreateEvent-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <input
            type="text"
            placeholder="หมวดหมู่"
            className="CreateEvent-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="text"
            placeholder="ลิงก์รูปภาพ"
            className="CreateEvent-input"
            value={eventImageUrl}
            onChange={(e) => setEventImageUrl(e.target.value)}
          />
          {error && <p className="CreateEvent-error">{error}</p>}
          {message && <p className="CreateEvent-success">{message}</p>}
          <div className="CreateEvent-button-group">
            <button type="submit" className="CreateEvent-primary-btn">สร้าง</button>
            <button type="button" className="CreateEvent-secondary-btn">ยกเลิก</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
