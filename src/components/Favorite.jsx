import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Favorite = () => {
  return (
    <Link to="/favorites" style={{ color: 'white', fontSize: '1rem' }} title="รายการโปรด">
      <FaHeart />
    </Link>
  );
};

export default Favorite;
