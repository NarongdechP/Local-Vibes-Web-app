import { useState } from 'react';
import { addFavorite, removeFavorite } from './favoriteAPI';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const FavoriteButton = ({ eventId, isInitiallyFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(eventId);
      } else {
        await addFavorite(eventId);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error:", error.message);
      // อาจแสดง Toast แจ้งผู้ใช้
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleToggle} 
      disabled={isLoading}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? <FaHeart color="red" /> : <FaRegHeart />}
      {isLoading && "Loading..."}
    </button>
  );
};

export default FavoriteButton;