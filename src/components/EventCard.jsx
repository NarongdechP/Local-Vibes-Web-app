import React from 'react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  return (
    <Link to={`/event/${event.id}`} className="event-card-link">
      <div className="event-card">
        <div className="event-image">
          <img src={event.image || "/placeholder-image.jpg"} alt={event.title} />
        </div>
        <div className="event-details">
          <h3 className="event-title">{event.title}</h3>
          <p className="event-price">{event.isFree ? "ฟรี" : event.price}</p>
          <p className="event-date">{event.dateRange}</p>
          <p className="event-location">{event.location}</p>
          <p className="event-organizer">{event.organizer}</p>
          <div className="event-categories">
            {event.categories.map((category, index) => (
              <span key={index} className="event-category">
                <i className={`category-icon ${category.icon}`}></i>
                {category.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;