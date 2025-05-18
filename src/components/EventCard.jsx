import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const EventCard = ({ event, onRemoveFavorite }) => {
  const handleRemoveClick = (e) => {
    e.preventDefault(); // ป้องกันการไปหน้ารายละเอียด event
    e.stopPropagation(); // หยุด event bubble
    if (onRemoveFavorite) {
      onRemoveFavorite(event._id);
    }
  };

  return (
    <div className="event-card-wrapper">
      <Link to={`/event/${event._id}`} className="event-card-link">
        <div className="event-card" style={{ position: 'relative' }}> {/* ✅ ต้องมี position: relative */}

       
          {onRemoveFavorite && (
            <button
              onClick={handleRemoveClick}
              title="ลบรายการโปรด"
              aria-label="ลบรายการโปรด"
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                zIndex: 10,
              }}
            >
              <FontAwesomeIcon icon={faTrash} style={{ color: '#ff4d4f', fontSize: '18px' , marginTop:'15px',marginRight:'5px'}} />
            </button>
          )}

          <div className="event-image">
            <img
              src={event.event_image_url || "/placeholder-image.jpg"}
              alt={event.event_name}
            />
          </div>

          <div className="event-details">
            <h3 className="event-title">{event.event_name}</h3>
            <p className="event-date">
              <i className="fa-solid fa-calendar"></i>{" "}
              {new Date(event.start_date).toLocaleDateString()} -{" "}
              {new Date(event.end_date).toLocaleDateString()}
            </p>
            <p className="event-location">📍 {event.location || "ไม่ระบุสถานที่"}</p>
            <p className="event-category">🎭 หมวดหมู่: {event.category || "ไม่ระบุ"}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;




