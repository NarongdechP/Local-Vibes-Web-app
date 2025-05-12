import express from "express";
import { body } from "express-validator";
import authenticateUser from "../middleware/authMiddleware.js";
import {
  createEvent,
  getAllEvents,
  searchEvents,
  getEventById,
} from "../controllers/eventController.js";

const router = express.Router();

// 📌 สร้างอีเวนต์ใหม่
router.post(
  "/create",
  authenticateUser,
  [
    body("event_name").trim().notEmpty().withMessage("กรุณากรอกชื่ออีเวนต์"),
    body("start_date").isISO8601().withMessage("รูปแบบวันที่ไม่ถูกต้อง"),
    body("end_date").isISO8601().withMessage("รูปแบบวันที่ไม่ถูกต้อง"),
    body("event_image_url").optional().isURL().withMessage("กรุณากรอก URL รูปภาพที่ถูกต้อง"),
  ],
  createEvent
);

// 📌 ดูอีเวนต์ทั้งหมด
router.get("/all", getAllEvents);

// 📌 ค้นหากิจกรรม
router.get("/search", searchEvents);

// 📌 ดูข้อมูลอีเวนต์ตามไอดี
router.get("/:id", getEventById);

export default router;

