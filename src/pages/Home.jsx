import React from 'react';
import SearchBar from '../components/SearchBar';
import Navbar from '../components/Navbar';
import EventCard from '../components/EventCard';
import { FaUtensils, FaMusic, FaBriefcase, FaHeart } from "react-icons/fa";
import './Home.css'

const Home = () => {
  // ข้อมูลตัวอย่างของอีเวนต์
  const sampleEvents = [
    {
      id: 1,
      title: 'เทศกาลท่องเที่ยวแม่เมาะ ครั้งที่ 20',
      isFree: true,
      dateRange: 'ระหว่างวันที่ 8-10 พฤศจิกายน 2567',
      location: 'เขื่อนภูมิพล กฟผ. แม่เมาะ',
      organizer: 'จังหวัดลำปาง การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (กฟผ.) แม่เมาะ',
      categories: [
        { name: 'อาหาร & เครื่องดื่ม', icon: <FaUtensils /> },
        { name: 'ดนตรี', icon: <FaMusic /> }
      ],
      image: '/placeholder-image.jpg'
    },
    {
      id: 2,
      title: 'เทศกาลคริสต์มาสลำปาง 2024',
      isFree: true,
      dateRange: 'ระหว่างวันที่ 25-27 ธันวาคม 2567',
      location: 'เขื่อนวังละลอง',
      organizer: 'เทศบาลนครลำปาง',
      categories: [
        { name: 'อาหาร & เครื่องดื่ม', icon: <FaUtensils /> },
        { name: 'ดนตรี', icon: <FaMusic /> }
      ],
      image: '/placeholder-image.jpg'
    }
  ];

  return (
    <div className="home-container">
      <div className="main-content">
        <SearchBar />
        <div className="header-section">
          <h1 className="main-title">อีเวนต์ในลำปาง, ประเทศไทย</h1>
          <p className="subtitle">ค้นหากิจกรรมที่คุณสนใจหรือกิจกรรมยอดนิยมในพื้นที่ของคุณ</p>
        </div>
        <Navbar />
        <div className="content-with-sidebar">
          {/* Sidebar */}
          <div className="sidebar">
            <h2 className="sidebar-title">หมวดหมู่</h2>
            <ul className="category-list">
              <li className="category-item">
                <FaBriefcase />
                <span>ธุรกิจ</span>
              </li>
              <li className="category-item">
                <FaUtensils />
                <span>อาหาร & เครื่องดื่ม</span>
              </li>
              <li className="category-item">
                <FaHeart />
                <span>สุขภาพ</span>
              </li>
              <li className="category-item">
                <FaMusic />
                <span>ดนตรี</span>
              </li>
            </ul>
          </div>
          
          {/* Events List */}
          <div className="events-container">
            {sampleEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
