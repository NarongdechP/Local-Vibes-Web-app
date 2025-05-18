import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHeart, FaUtensils, FaMusic, FaBriefcase } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuitcaseRolling } from "@fortawesome/free-solid-svg-icons";
import './EventDetail.css';

// นำ categories จาก Home.jsx มาใช้งาน
const categories = [
  { name: "ธุรกิจ", icon: <FaBriefcase /> },
  { name: "อาหาร", icon: <FaUtensils /> },
  { name: "สุขภาพ", icon: <FaHeart /> },
  { name: "ดนตรี", icon: <FaMusic /> },
  { name: "ท่องเที่ยว", icon: <FontAwesomeIcon icon={faSuitcaseRolling} /> }
];

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSmallImage, setIsSmallImage] = useState(false);

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

  useEffect(() => {
    if (event && event.event_image_url) {
      checkImageSize(event.event_image_url).then(isSmall => {
        setIsSmallImage(isSmall);
      });
    }
  }, [event]);

  const handleFavorite = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:3000/favorites/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: id }),
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/favorites");
      } else {
        alert(data.error || "ไม่สามารถเพิ่มรายการโปรดได้");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการเพิ่มรายการโปรด");
    }
  };

  const checkImageSize = (imageUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const isSmall = img.width < 600 || img.height < 600;
        resolve(isSmall);
      };
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  };

  if (loading) return <div className="event-detail-loading-message">⏳ กำลังโหลดข้อมูลอีเวนต์...</div>;
  if (errorMsg) return <div className="event-detail-error-message">❌ {errorMsg}</div>;
  if (!event) return <div className="event-detail-loading-message">ไม่พบข้อมูล</div>;


  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('th-TH', options);
  };


  const getTags = () => {
    const tags = [];
    
    
    if (event.category && Array.isArray(event.category) && event.category.length > 0) {
      event.category.forEach(catName => {
        const matchedCategory = categories.find(cat => cat.name === catName);
        if (matchedCategory) {
          tags.push({ icon: matchedCategory.icon, text: matchedCategory.name });
        }
      });
    } 
    
    else if (event.category && typeof event.category === 'string') {
  
      const categoryNames = event.category.includes(',') 
        ? event.category.split(',').map(cat => cat.trim())
        : [event.category.trim()];
        
      categoryNames.forEach(catName => {
        const matchedCategory = categories.find(cat => cat.name === catName);
        if (matchedCategory) {
          tags.push({ icon: matchedCategory.icon, text: matchedCategory.name });
        }
      });
    }
    
    // ถ้าไม่มีข้อมูล category หรือไม่พบ category ที่ตรงกัน ให้แสดงแท็กดีฟอลต์ 2 อัน
    if (tags.length === 0) {
      const foodCategory = categories.find(cat => cat.name === "อาหาร");
      const musicCategory = categories.find(cat => cat.name === "ดนตรี");
      
      if (foodCategory) {
        tags.push({ icon: foodCategory.icon, text: foodCategory.name });
      }
      
      if (musicCategory) {
        tags.push({ icon: musicCategory.icon, text: musicCategory.name });
      }
    }
    
    return tags;
  };

  const isPriceFree = !event.price || event.price === 0 || event.price === "0" || event.price === "ฟรี";

  return (
    <div className="event-detail-container">
      <div className="event-detail-image">
        <img
          className={`event-image-container ${isSmallImage ? 'enlarge-image' : ''}`}
          src={event.event_image_url || "/placeholder-image.jpg"}
          alt={event.event_name}
          onError={(e) => {
            e.target.src = "/placeholder-image.jpg";
            console.log("Image failed to load, using placeholder instead");
          }}
        />
      </div>
      
      <div className="event-detail-title">
        <h1>{event.event_name}</h1>
      </div>
      
      <div className="event-detail-date">
        ระหว่างวันที่ {formatDate(event.start_date).split(' ')[0]}-
        {formatDate(event.end_date).split(' ')[0]} {formatDate(event.end_date).split(' ')[1]} {formatDate(event.end_date).split(' ')[2]}
      </div>
      
      <div className="event-detail-location-section">
        <h3 className="event-detail-section-heading">สถานที่</h3>
        <div className="location-name-font">{event.location || "ไม่ระบุ"}</div>
      </div>
      
      <div className="event-detail-description-section">
        <h3 className="event-detail-section-heading">เกี่ยวกับกิจกรรม</h3>
        <div className="event-detail-description">
          {event.description ? (
            <div dangerouslySetInnerHTML={{ __html: event.description.replace(/\n/g, '<br/>') }} />
          ) : (
            <>
              <p>🎉 มาแล้ว ! บรรยากาศแห่งความสุขที่ทุกคนรอคอย 🎉</p>
              <p>🎊🎡🎠 เทศกาลท่องเที่ยวแม่เมาะ ครั้งที่ 20 🎠🎡🎊</p>
              <p>❤️ 🙏🏻 Mission to Sustainability การท่องเที่ยวยั่งยืน ❤️ 🙏🏻</p>
              <p>🚌 ร่วมซื้อบัตรรถบัส ชมบุฟเฟ่ต์ดอกไม้ ท่องโลกไดโนเสาร์ เพลิดเพลินไปกับกิจกรรมมากมาย พลาดไม่ได้กับบัตรคอนเสิร์ตศิลปินชื่อดัง ตลอด 3 วัน 3 คืน</p>
            </>
          )}
        </div>
      </div>
      
      <div className="event-detail-tag-section">
        <h3 className="event-detail-section-heading">แท็ก</h3>
        <div className="event-detail-tags">
          {getTags().map((tag, index) => (
            <div className="event-detail-tag" key={index}>
              <span>{tag.icon} {tag.text}</span>
            </div>
          ))}
        </div>
      </div>
      
      <button className="event-detail-favorite-btn" onClick={handleFavorite}>
        <FaHeart />
        <span className="event-detail-text">เพิ่มในรายการชื่นชอบ</span>
      </button>
      
      {/* {isPriceFree && <button className="event-detail-free-button">ฟรี</button>} */}
    </div>
  );
};

export default EventDetail;