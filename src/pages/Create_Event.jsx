import React, { useState } from "react";
import axios from "axios";

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

    const token = localStorage.getItem("authToken"); // assuming the token is stored in localStorage

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
        "http://localhost:5000/create", // API endpoint
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // เพิ่ม Token ใน Header
          },
        }
      );
      setMessage(response.data.message); // ข้อความสำเร็จ
      setError(null); // เคลียร์ข้อผิดพลาด
    } catch (error) {
      setError(error.response?.data?.error || "เกิดข้อผิดพลาด");
      setMessage(null); // เคลียร์ข้อความสำเร็จหากเกิดข้อผิดพลาด
    }
  };

  return (
    <div>
      <h1>สร้างอีเวนต์</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ชื่ออีเวนต์</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>
        <div>
          <label>รายละเอียด</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>วันที่เริ่มต้น</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>วันที่สิ้นสุด</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div>
          <label>สถานที่</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div>
          <label>หมวดหมู่</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div>
          <label>URL รูปภาพอีเวนต์</label>
          <input
            type="url"
            value={eventImageUrl}
            onChange={(e) => setEventImageUrl(e.target.value)}
          />
        </div>
        <button type="submit">สร้างอีเวนต์</button>
      </form>

      {/* แสดงข้อความสำเร็จหรือข้อผิดพลาด */}
      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

export default CreateEvent;
