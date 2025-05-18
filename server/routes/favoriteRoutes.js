import express from "express";
import mongoose from "mongoose";
import protect from "../middleware/authMiddleware.js"; // Middleware สำหรับเช็ค JWT
import Favorite from "../models/Favorite.js";

const router = express.Router();

// ✅ ดึงรายการโปรดของผู้ใช้
router.get("/", protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id }).populate("event");
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// ✅ เพิ่มอีเวนต์ในรายการโปรด
router.post("/:eventId", protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const eventId = req.params.eventId;

    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    const exist = await Favorite.findOne({ user: userId, event: eventId });
    if (exist) {
      return res.status(400).json({ message: "รายการโปรดนี้มีอยู่แล้ว" });
    }

    const favorite = new Favorite({ user: userId, event: eventId });
    await favorite.save();

    res.status(201).json({ message: "เพิ่มรายการโปรดสำเร็จ" });
  } catch (error) {
    console.error("Error saving favorite:", error);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการบันทึก" });
  }
});

// ✅ ลบรายการโปรด
router.delete("/:eventId", protect, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      user: req.user.id,
      event: req.params.eventId,
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
