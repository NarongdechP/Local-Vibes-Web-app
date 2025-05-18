import React, { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import { FaUtensils, FaMusic, FaBriefcase, FaHeart } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuitcaseRolling } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const categories = [
  { name: "ธุรกิจ", icon: <FaBriefcase /> },
  { name: "อาหาร", icon: <FaUtensils /> },
  { name: "สุขภาพ", icon: <FaHeart /> },
  { name: "ดนตรี", icon: <FaMusic /> },
  { name: "ท่องเที่ยว", icon: <FontAwesomeIcon icon={faSuitcaseRolling} /> },
];

const FavoritePage = () => {
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/favorites", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      const favoriteEvents = data.map((fav) => fav.event);
      setEvents(favoriteEvents);
      setFilteredEvents(favoriteEvents);
      setFavorites(favoriteEvents.map((e) => e._id));
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการโหลดข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (eventId) => {
    try {
      await fetch(`http://localhost:3000/favorites/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      await fetchFavorites();
    } catch (err) {
      console.error("ลบ favorite ไม่สำเร็จ", err);
    }
  };

  const handleCategoryClick = (category) => {
    const newSelected = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];

    setSelectedCategories(newSelected);

    if (newSelected.length === 0) {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(
        events.filter((event) =>
          newSelected.some((cat) => event.category?.includes(cat))
        )
      );
    }
  };

  if (loading) return <p style={{ padding: "2rem" }}>กำลังโหลด...</p>;
  if (error) return <p style={{ padding: "2rem", color: "red" }}>{error}</p>;

  return (
    <div className="home-container">
      <div className="header-section">
        <h1 className="main-title-new " style={{ marginBottom:'100px'}}>กิจกรรมที่คุณชื่นชอบ</h1>
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
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onRemoveFavorite={toggleFavorite}
              />
            ))
          ) : (
            <p className="no-events">คุณยังไม่มีอีเวนต์ในรายการโปรด</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritePage;




