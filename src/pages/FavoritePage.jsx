import React, { useState, useEffect } from 'react';
import { FaHeart, FaTrashAlt } from 'react-icons/fa';

const FavoritePage = () => {
  const [favoriteEvents, setFavoriteEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('http://localhost:3000/favorites', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) {
        throw new Error(`Fetch favorites failed: ${res.statusText}`);
      }

      const data = await res.json();
      const events = data.map(fav => fav.event).filter(Boolean);
      setFavoriteEvents(events);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  // ฟังก์ชันลบ favorite
  const removeFavorite = async (eventId) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:3000/favorites/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!res.ok) {
        throw new Error(`Failed to remove favorite: ${res.statusText}`);
      }

      // รีเฟรชข้อมูลรายการโปรดหลังลบ
      await fetchFavorites();

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div style={{textAlign: 'center'}}>Loading...</div>;
  if (error) return <div style={{color: 'red', textAlign: 'center'}}>Error: {error}</div>;

  if (favoriteEvents.length === 0) {
    return <div style={{textAlign: 'center', marginTop: '2rem'}}>คุณยังไม่มีรายการโปรด</div>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>
        กิจกรรมที่คุณชื่นชอบ
      </h1>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {favoriteEvents.map(event => (
          <div
            key={event._id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              position: 'relative'
            }}
          >
            <h2>{event.event_name}</h2>
            {event.date && <p><strong>วันที่:</strong> {event.date}</p>}
            {event.location && <p><strong>สถานที่:</strong> {event.location}</p>}
            {event.description && <p>{event.description}</p>}

            <button
              onClick={() => removeFavorite(event._id)}
              disabled={loading}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'red',
                fontSize: '1.2rem'
              }}
              aria-label="ลบจากรายการโปรด"
              title="ลบจากรายการโปรด"
            >
              <FaTrashAlt />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritePage;

