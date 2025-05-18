// ฟังก์ชันเรียก API ทั้งหมดเกี่ยวกับ Favorite
export const addFavorite = async (eventId) => {
  try {
    const res = await fetch(`http://localhost:3000/favorites/${eventId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch (error) {
    console.error("Failed to add favorite:", error);
    throw error; // Throw ต่อให้ Component จัดการ
  }
};

export const removeFavorite = async (eventId) => {
  try {
    const res = await fetch(`http://localhost:3000/favorites/${eventId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });
    
    if (!res.ok) throw new Error(await res.text());
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    throw error;
  }
};