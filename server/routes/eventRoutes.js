import express from "express";
import { body } from "express-validator";
import multer from "multer";
import authenticateUser from "../middleware/authMiddleware.js";
import {
  createEvent,
  getAllEvents,
  searchEvents,
  getEventById,
} from "../controllers/eventController.js";

// setup multer สำหรับอัปโหลดรูป
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();

router.post(
  "/create",
  authenticateUser,
  upload.single("event_image"), // รับไฟล์จาก field ชื่อ event_image
  [
    body("event_name")
      .trim()
      .notEmpty()
      .withMessage("กรุณากรอกชื่ออีเวนต์"),
    body("start_date")
      .notEmpty()
      .withMessage("กรุณากรอกวันที่เริ่มต้น")
      .isISO8601()
      .withMessage("รูปแบบวันที่ไม่ถูกต้อง"),
    body("end_date")
      .notEmpty()
      .withMessage("กรุณากรอกวันที่สิ้นสุด")
      .isISO8601()
      .withMessage("รูปแบบวันที่ไม่ถูกต้อง"),
    // ไม่ต้อง validate event_image_url ถ้าไม่ได้ส่ง url มา
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
