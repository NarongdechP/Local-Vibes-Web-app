import React from 'react';
import { Link } from 'react-router-dom';


const EventCard = ({ event }) => {
  return (
    <Link to={`/event/${event._id}`} className="event-card-link">
      <div className="event-card">
        <div className="event-image">
          <img src={event.event_image_url || "/placeholder-image.jpg"} alt={event.event_name} />
        </div>

        <div className="event-details">
          <h3 className="event-title">{event.event_name}</h3>
          <p className="event-date">
          <i class="fa-solid fa-calendar"></i> {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
          </p>
          <p className="event-location">📍 {event.location || "ไม่ระบุสถานที่"}</p>
          <p className="event-category">🎭 หมวดหมู่: {event.category || "ไม่ระบุ"}</p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
