import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const FavoritePage = () => {
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ฟังก์ชันเรียก API
  const fetchFavorites = async () => {
    try {
      const res = await fetch('http://localhost:3000/favorites', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setFavorites(data.map(fav => fav.event._id || fav.event)); // ขึ้นกับโครงสร้าง response
    } catch (err) {
      setError(err.message);
    }
  };

  // ฟังก์ชันเพิ่ม/ลบ Favorite
  const toggleFavorite = async (eventId) => {
    setLoading(true);
    try {
      if (favorites.includes(eventId)) {
        await removeFavorite(eventId);
      } else {
        await addFavorite(eventId);
      }
      await fetchFavorites(); // ดึงข้อมูลใหม่หลังอัปเดต
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันเรียก API โดยตรง
  const addFavorite = async (eventId) => {
    const res = await fetch(`http://localhost:3000/favorites/${eventId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  };

  const removeFavorite = async (eventId) => {
    const res = await fetch(`http://localhost:3000/favorites/${eventId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!res.ok) throw new Error(await res.text());
  };

  // ดึงข้อมูลครั้งแรกเมื่อ component โหลด
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // ดึงข้อมูลอีเวนต์
        const eventsRes = await fetch('http://localhost:3000/events');
        const eventsData = await eventsRes.json();
        setEvents(eventsData);
        
        // ดึงข้อมูลรายการโปรด
        await fetchFavorites();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '2rem' }}>
        รายการโปรดของคุณ
      </h1>

      {/* แสดง Event พร้อมปุ่มหัวใจ */}
      <div style={{ display: 'grid', gap: '1rem' }}>
        {events.map(event => (
          <div 
            key={event._id} 
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '8px'
            }}
          >
            <span>{event.name}</span>
            <button 
              onClick={() => toggleFavorite(event._id)}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
                opacity: loading ? 0.5 : 1
              }}
              aria-label={favorites.includes(event._id) ? "Remove from favorites" : "Add to favorites"}
            >
              {favorites.includes(event._id) ? (
                <FaHeart color="red" />
              ) : (
                <FaRegHeart />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* แสดงรายการโปรด */}
      {favorites.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2>รายการที่คุณชอบ:</h2>
          <ul>
            {events
              .filter(event => favorites.includes(event._id))
              .map(event => (
                <li key={event._id}>{event.name}</li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FavoritePage;