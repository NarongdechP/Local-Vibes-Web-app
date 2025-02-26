import React from 'react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import EventCard from '../components/EventCard';

const Home = () => {
  // Sample data matching what's shown in the image
  const sampleEvents = [
    {
      id: 1,
      title: 'เทศกาลท่องเที่ยวแม่เมาะ ครั้งที่ 20',
      isFree: true,
      dateRange: 'ระหว่างวันที่ 8-10 พฤศจิกายน 2567',
      location: 'เขื่อนภูมิพล กฟผ. แม่เมาะ',
      organizer: 'จังหวัดลำปาง การไฟฟ้าฝ่ายผลิตแห่งประเทศไทย (กฟผ.) แม่เมาะ',
      categories: [
        { name: 'อาหาร & เครื่องดื่ม', icon: 'fa-utensils' },
        { name: 'ดนตรี', icon: 'fa-music' }
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
        { name: 'อาหาร & เครื่องดื่ม', icon: 'fa-utensils' },
        { name: 'ดนตรี', icon: 'fa-music' }
      ],
      image: '/placeholder-image.jpg'
    }
  ];

  return (
    <div className="home-container">
      <div className="main-content">
        <div className="header-section">
          <h1 className="main-title">อีเวนต์ในลำปาง, ประเทศไทย</h1>
          <p className="subtitle">ค้นหากิจกรรมที่คุณสนใจหรือกิจกรรมยอดนิยมในพื้นที่ของคุณ</p>
        </div>
        <SearchBar />
        
        <div className="content-with-sidebar">
          <div className="sidebar">
            <h2 className="sidebar-title">หมวดหมู่</h2>
            <ul className="category-list">
              <li className="category-item">
              <i class="fi fi-rr-briefcase"></i>
                <span>ธุรกิจ</span>
              </li>
              <li className="category-item">
              <i className="fi fi-rr-hamburger-soda"></i>
                <span>อาหาร & เครื่องดื่ม</span>
              </li>
              <li className="category-item">
                <i className="fa fa-heart"></i>
                <span>สุขภาพ</span>
              </li>
              <li className="category-item">
                <i className="fa fa-music"></i>
                <span>ดนตรี</span>
              </li>
            </ul>
          </div>
          
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