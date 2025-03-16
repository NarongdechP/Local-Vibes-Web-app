import express from "express";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";
import mongoose from "mongoose";  // ✅ นำเข้า mongoose เพื่อตรวจสอบ ObjectId
import Event from "../models/Event.js";
import authenticateUser from "../middleware/authMiddleware.js"; 

const router = express.Router();

// 📌 สร้างอีเวนต์ใหม่ (เพิ่ม validation)
router.post(
    "/create",
    authenticateUser,
    [
        body("event_name").trim().notEmpty().withMessage("กรุณากรอกชื่ออีเวนต์"),
        body("start_date").isISO8601().withMessage("รูปแบบวันที่ไม่ถูกต้อง"),
        body("end_date").isISO8601().withMessage("รูปแบบวันที่ไม่ถูกต้อง"),
        body("event_image_url").optional().isURL().withMessage("กรุณากรอก URL รูปภาพที่ถูกต้อง"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { event_name, description, start_date, end_date, location, category, event_image_url } = req.body;
        const userId = req.user.id;

        // ป้องกัน XSS
        event_name = sanitizeHtml(event_name);
        description = description ? sanitizeHtml(description) : null;
        location = location ? sanitizeHtml(location) : null;
        category = category ? sanitizeHtml(category) : null;
        event_image_url = event_image_url ? sanitizeHtml(event_image_url) : null;

        try {
            const newEvent = new Event({
                event_name,
                description,
                start_date,
                end_date,
                location,
                category,
                event_image_url,
                created_by: userId,
            });

            await newEvent.save();
            res.status(201).json({ message: "สร้างอีเวนต์สำเร็จ", event: newEvent });
        } catch (err) {
            console.error("🔴 Event Creation Error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// 📌 ดูข้อมูลทั้งหมดของอีเวนต์
router.get("/all", async (req, res) => {
    try {
        const events = await Event.find();
        res.status(200).json({ events });
    } catch (err) {
        console.error("🔴 Error fetching events:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 API ค้นหากิจกรรม
router.get("/search", async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: "กรุณากรอกคำค้นหา" });
    }

    try {
        const events = await Event.find({
            event_name: { $regex: query, $options: "i" }, // ค้นหาแบบ case-insensitive
        });

        res.status(200).json({ events });
    } catch (err) {
        console.error("🔴 Error searching events:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 ดูข้อมูลอีเวนต์ตามไอดี
router.get("/:id", async (req, res) => {
    const { id } = req.params;

    // ✅ ตรวจสอบว่า ID เป็น ObjectId หรือไม่
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "ID ไม่ถูกต้อง" });
    }

    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "ไม่พบข้อมูลอีเวนต์นี้" });
        }
        res.status(200).json({ event });
    } catch (err) {
        console.error("🔴 Error fetching event:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
