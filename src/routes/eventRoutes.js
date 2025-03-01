import express from "express";
import { pool } from "../config/db.js";  // นำเข้าการเชื่อมต่อฐานข้อมูล

const router = express.Router();

// 📌 API ค้นหากิจกรรม
router.get("/", async (req, res) => {
    try {
        const { name, date, category, location } = req.query;

        let query = "SELECT * FROM events WHERE 1=1"; // 1=1 เพื่อให้คิวรีมีความยืดหยุ่น
        let values = [];

        // ค้นหาตามชื่อกิจกรรม (event_name)
        if (name) {
            values.push(`%${name}%`);
            query += ` AND event_name ILIKE $${values.length}`; // ค้นหาแบบไม่สนใจตัวพิมพ์ใหญ่
        }

        // ค้นหาตามวันที่
        if (date) {
            values.push(date);
            query += ` AND start_date::DATE = $${values.length}`; // ค้นหาตามวันที่
        }

        // ค้นหาตามประเภทกิจกรรม
        if (category) {
            values.push(category);
            query += ` AND category = $${values.length}`;
        }

        // ค้นหาตามสถานที่
        if (location) {
            values.push(`%${location}%`);
            query += ` AND location ILIKE $${values.length}`; // ค้นหาแบบไม่สนใจตัวพิมพ์ใหญ่
        }

        const result = await pool.query(query, values);
        res.json({ events: result.rows }); // ส่งผลลัพธ์กลับ

    } catch (err) {
        console.error("🔴 Event Search Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
