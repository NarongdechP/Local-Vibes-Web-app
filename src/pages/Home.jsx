import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar";
import EventCard from "../components/EventCard";
import { FaUtensils, FaMusic, FaBriefcase, FaHeart } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuitcaseRolling } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import "./Home.css";
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: "ธุรกิจ", icon: <FaBriefcase /> },
  { name: "อาหาร", icon: <FaUtensils /> },
  { name: "สุขภาพ", icon: <FaHeart /> },
  { name: "ดนตรี", icon: <FaMusic /> },
  { name: "ท่องเที่ยว", icon: <FontAwesomeIcon icon={faSuitcaseRolling} /> }

];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // ✅
  const username = localStorage.getItem('username')
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (query = "") => {
    setLoading(true);
    let url = query
      ? `http://localhost:3000/events/search?query=${encodeURIComponent(query)}`
      : `http://localhost:3000/events/all`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      setEvents(data.events);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    fetchEvents(query);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategories((prevSelected) =>
      prevSelected.includes(category)
        ? prevSelected.filter((c) => c !== category)
        : [...prevSelected, category]
    );
  };

  const filteredEvents =
    selectedCategories.length > 0
      ? events.filter((event) =>
          selectedCategories.some((cat) => event.category.includes(cat))
        )
      : events;

  return (
    <div className="home-container">
      <SearchBar onSearch={handleSearch} />
      <div className="header-section">
        <h1 className="main-title">อีเวนต์ในลำปาง, ประเทศไทย</h1>
        <p className="subtitle">ค้นหากิจกรรมที่คุณสนใจหรือกิจกรรมยอดนิยมในพื้นที่ของคุณ</p>
      </div>
      <div className="content-with-sidebar">
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

        <div className="events-container">
          {loading ? (
            <p>กำลังโหลดข้อมูล...</p>
          ) : filteredEvents.length > 0 ? (
            filteredEvents.map((event) => <EventCard key={event._id} event={event} />)
          ) : (
            <p className="no-events">ไม่พบอีเวนต์ที่ตรงกับคำค้นหา</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
