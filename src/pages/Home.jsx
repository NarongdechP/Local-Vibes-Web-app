import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import EventCard from "../components/EventCard";
import { FaUtensils, FaMusic, FaBriefcase, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Home.css";

// หมวดหมู่ของอีเวนต์
const categories = [
  { name: "ธุรกิจ", icon: <FaBriefcase /> },
  { name: "อาหาร & เครื่องดื่ม", icon: <FaUtensils /> },
  { name: "สุขภาพ", icon: <FaHeart /> },
  { name: "ดนตรี", icon: <FaMusic /> },
];

// ข้อมูลตัวอย่างของอีเวนต์
const sampleEvents = [
  {
    id: 1,
    title: "เทศกาลท่องเที่ยวแม่เมาะ ครั้งที่ 20",
    isFree: true,
    dateRange: "8-10 พฤศจิกายน 2567",
    location: "เขื่อนภูมิพล กฟผ. แม่เมาะ",
    organizer: "จังหวัดลำปาง การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (กฟผ.) แม่เมาะ",
    categories: 
    [ 
      { name: 'อาหาร & เครื่องดื่ม', icon: <FaUtensils /> },
        { name: 'ดนตรี', icon: <FaMusic /> }
      ],
    image: "/placeholder-image.jpg",
  },
  {
    id: 2,
    title: "เทศกาลคริสต์มาสลำปาง 2024",
    isFree: true,
    dateRange: "25-27 ธันวาคม 2567",
    location: "เขื่อนวังละลอง",
    organizer: "เทศบาลนครลำปาง",
    categories: 
    [ 
      { name: 'อาหาร & เครื่องดื่ม', icon: <FaUtensils /> },
        { name: 'ดนตรี', icon: <FaMusic /> }
      ],
    image: "/placeholder-image.jpg",
  },
];

const Home = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);

  // ฟังก์ชันกดเลือกหมวดหมู่ (กดซ้ำเพื่อยกเลิก)
  const handleCategoryClick = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  // กรองอีเวนต์ตามหมวดหมู่ที่เลือก
  const filteredEvents =
    selectedCategories.length > 0
      ? sampleEvents.filter((event) =>
          selectedCategories.some((cat) => event.categories.includes(cat))
        )
      : sampleEvents;

  return (
    <div className="home-container">
      <Navbar />
      <SearchBar />
      <div className="header-section">
        <h1 className="main-title">อีเวนต์ในลำปาง, ประเทศไทย</h1>
        <p className="subtitle">ค้นหากิจกรรมที่คุณสนใจหรือกิจกรรมยอดนิยมในพื้นที่ของคุณ</p>
      </div>
      <div className="content-with-sidebar">
        {/* Sidebar */}
        <div className="sidebar">
          <h2 className="sidebar-title">หมวดหมู่</h2>
          <ul className="category-list">
            {categories.map((cat, index) => (
              <motion.li
                key={index}
                className={`category-item ${
                  selectedCategories.includes(cat.name) ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(cat.name)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Events List */}
        <div className="events-container">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => <EventCard key={event.id} event={event} />)
          ) : (
            <p className="no-events">ไม่มีอีเวนต์ในหมวดหมู่นี้</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
