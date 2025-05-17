import React, { useState } from "react";
import axios from "axios";
import "./Create_Event.css";
import TextInput from "../components/TextInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CreateEvent = () => {
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [Organizer, setOrganizer] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [eventImage, setEventImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันสำหรับจัดการการอัพโหลดรูปภาพ
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEventImage(file);
      // สร้าง URL สำหรับแสดงตัวอย่างรูปภาพ
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setIsLoading(true);

    // สร้าง FormData object สำหรับการส่งข้อมูลรวมถึงไฟล์
    const formData = new FormData();
    formData.append("event_name", eventName);
    formData.append("description", description);
    formData.append("start_date", startDate);
    formData.append("end_date", endDate);
    formData.append("location", location);
    formData.append("price", price);
    formData.append("amount", amount);
    formData.append("category", category);
    formData.append("Organizer", Organizer);
    
    // เพิ่มไฟล์รูปภาพลงใน FormData (ถ้ามี)
    if (eventImage) {
      formData.append("event_image", eventImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/events/create",
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data" // สำคัญสำหรับการส่งไฟล์
          },
        }
      );
      setMessage(response.data.message);
      setError(null);

      alert("สร้างอีเวนต์สำเร็จ!");

      // รีเซ็ตฟอร์ม
      setEventName("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setLocation("");
      setCategory("");
      setPrice("");
      setAmount("");
      setOrganizer("");
      setEventImage(null);
      setPreviewImage(null);
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
    setStartDate("");
    setEndDate("");
    setLocation("");
    setCategory("");
    setOrganizer("");
    setPrice("");
    setAmount("");
    setEventImage(null);
    setPreviewImage(null);
    setError(null);
    setMessage(null);
  };

  return (
    <div className="CreateEvent-container">
      <div className="CreateEvent-form-wrapper">
        <h1 className="CreateEvent-title">สร้างอีเวนต์</h1>
        <p className="CreateEvent-subtitle">
          นี่จะเป็นรายละเอียดอีเวนต์ของคุณ ใช้เพื่อช่วยสร้างคำอธิบายและหมวดหมู่ของอีเวนต์ของคุณ ดังนั้นโปรดระบุให้ชัดเจน !
        </p>
        
        
        {previewImage && (
          <div className="CreateEvent-image-preview">
            <img src={previewImage} alt="Event Preview" className="preview-image" />
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
            placeholder="หมวดหมู่"
            className="CreateEvent-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <TextInput
            type="text"
            placeholder="ชื่อผู้จัดงาน"
            className="CreateEvent-input"
            value={Organizer}
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
          
          {/* ส่วนอัพโหลดรูปภาพ */}
          <div className="CreateEvent-file-upload">
            <label htmlFor="eventImage" className="CreateEvent-file-label">
              อัพโหลดรูปภาพอีเวนต์
            </label>
            <input
              type="file"
              id="eventImage"
              accept="image/*"
              onChange={handleImageChange}
              className="CreateEvent-file-input"
              required
            />
          </div>

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