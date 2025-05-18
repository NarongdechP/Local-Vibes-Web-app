import React, { useState } from "react"; 
import axios from "axios";
import "./Create_Event.css";
import TextInput from "../components/TextInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateEvent = () => {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [eventImageUrl, setEventImageUrl] = useState(""); // เปลี่ยนเป็นเก็บ URL แทน
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUrlChange = (e) => {
    setEventImageUrl(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setIsLoading(true);

    // ตรวจสอบข้อมูลรูปภาพ (URL) ว่ากรอกหรือไม่
    if (!eventImageUrl.trim()) {
      setError("กรุณากรอก URL รูปภาพอีเวนต์");
      setIsLoading(false);
      return;
    }

    const eventData = {
      event_name: eventName,
      description: description,
      start_date: startDate ? startDate.toISOString() : "",
      end_date: endDate ? endDate.toISOString() : "",
      location: location,
      price: price,
      amount: amount,
      category: category,
      Organizer: organizer,
      event_image_url: eventImageUrl,  // ส่ง URL รูปภาพแทนไฟล์
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/events/create",
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMessage(response.data.message);
      setError(null);
      alert("สร้างอีเวนต์สำเร็จ!");

      // reset form
      setEventName("");
      setDescription("");
      setStartDate(null);
      setEndDate(null);
      setLocation("");
      setCategory("");
      setOrganizer("");
      setPrice("");
      setAmount("");
      setEventImageUrl("");
    } catch (error) {
      setError(error.response?.data?.error || "เกิดข้อผิดพลาด");
      setMessage(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setEventName("");
    setDescription("");
    setStartDate(null);
    setEndDate(null);
    setLocation("");
    setCategory("");
    setOrganizer("");
    setPrice("");
    setAmount("");
    setEventImageUrl("");
    setError(null);
    setMessage(null);
  };

  return (
    <div className="CreateEvent-container">
      <div className="CreateEvent-form-wrapper">
        <h1 className="CreateEvent-title">สร้างอีเวนต์</h1>
        <p className="CreateEvent-subtitle">
          โปรดกรอกรายละเอียดอีเวนต์ให้ครบถ้วน เพื่อสร้างอีเวนต์ของคุณ
        </p>

        {eventImageUrl && (
          <div className="CreateEvent-image-preview">
            <img src={eventImageUrl} alt="Event Preview" className="preview-image" />
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <TextInput
            type="text"
            placeholder="ชื่ออีเวนต์"
            className="CreateEvent-input"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />

          <div className="CreateEvent-date-group">
            <div style={{ flex: 1 }}>
              <DatePicker
                placeholderText="วันที่เริ่มต้น"
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="yyyy-MM-dd"
                className="Calendar-CreateEvent-input"
              />
            </div>
            <div style={{ flex: 1 }}>
              <DatePicker
                placeholderText="วันที่สิ้นสุด"
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="yyyy-MM-dd"
                className="Calendar-CreateEvent-input"
              />
            </div>
          </div>

          <TextInput
            placeholder="เกี่ยวกับกิจกรรม"
            type="text"
            className="CreateEvent-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextInput
            type="text"
            placeholder="สถานที่"
            className="CreateEvent-input"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          <TextInput
            type="text"
            placeholder="หมวดหมู่ เช่น ธุรกิจ อาหาร สุขภาพ ดนตรี ท่องเที่ยว"
            className="CreateEvent-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <TextInput
            type="text"
            placeholder="ชื่อผู้จัดงาน"
            className="CreateEvent-input"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            required
          />
          <TextInput
            type="text"
            placeholder="ราคาตั๋ว"
            className="CreateEvent-input"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <TextInput
            type="text"
            placeholder="จำนวนตั๋ว"
            className="CreateEvent-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <TextInput
            type="text"
            placeholder="กรอก URL รูปภาพอีเวนต์"
            className="CreateEvent-input"
            value={eventImageUrl}
            onChange={handleImageUrlChange}
            required
          />

          {error && <p className="CreateEvent-error">{error}</p>}
          {message && <p className="CreateEvent-success">{message}</p>}

          <div className="CreateEvent-button-group">
            <button
              type="submit"
              className="CreateEvent-primary-btn"
              disabled={isLoading}
            >
              {isLoading ? "กำลังสร้าง..." : "สร้าง"}
            </button>
            <button
              type="button"
              className="CreateEvent-secondary-btn"
              onClick={handleReset}
              disabled={isLoading}
            >
              ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
