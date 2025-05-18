import express from "express";
import protect from "../middleware/authMiddleware.js"; // Middleware เช็คการล็อกอิน
import Favorite from "../models/Favorite.js";

const router = express.Router();

// ดึงรายการโปรดของผู้ใช้
router.get("/", protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate("event");
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// เพิ่มรายการโปรด
router.post("/:eventId", protect, async (req, res) => {
  try {
    const favorite = new Favorite({
      user: req.user.id,
      event: req.params.eventId
    });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Event is already in favorites" });
    }
    res.status(500).json({ message: "Server Error" });
  }
});

// ลบรายการโปรด
router.delete("/:eventId", protect, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      user: req.user.id,
      event: req.params.eventId
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;