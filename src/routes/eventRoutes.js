import express from "express";
import { pool } from "../../server/config/db.js";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";

const router = express.Router();

// 📌 Middleware ตรวจสอบ JWT Token
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).json({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token ไม่ถูกต้อง" });
    }
};

// 📌 สร้างอีเวนต์ใหม่ (เพิ่ม validation)
router.post(
    "/create",
    authenticateUser,
    [
        body("event_name").trim().notEmpty().withMessage("กรุณากรอกชื่ออีเวนต์"),
        body("start_date").isISO8601().withMessage("รูปแบบวันที่ไม่ถูกต้อง"),
        body("end_date").isISO8601().withMessage("รูปแบบวันที่ไม่ถูกต้อง"),
        body("event_image_url").optional().isURL().withMessage("กรุณากรอก URL รูปภาพที่ถูกต้อง") // ตรวจสอบ URL รูปภาพ
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
            const result = await pool.query(
                "INSERT INTO events (event_name, description, start_date, end_date, location, category, created_by, event_image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
                [event_name, description, start_date, end_date, location, category, userId, event_image_url]
            );

            res.status(201).json({ message: "สร้างอีเวนต์สำเร็จ", event: result.rows[0] });
        } catch (err) {
            console.error("🔴 Event Creation Error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// 📌 ดูข้อมูลทั้งหมดของอีเวนต์
router.get("/all", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM events");
        res.status(200).json({ events: result.rows });
    } catch (err) {
        console.error("🔴 Error fetching events:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
