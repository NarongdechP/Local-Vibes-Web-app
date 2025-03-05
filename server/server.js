import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "../src/routes/authRoutes.js";
import eventRoutes from "../src/routes/eventRoutes.js";
import { pool } from "./config/db.js";  // นำเข้า pool จาก db.js

dotenv.config();

const app = express();

// กำหนดให้ Backend สามารถรับการเชื่อมต่อจาก Frontend ได้
app.use(cors({
  origin: 'http://localhost:5173' // หรือ domain ของคุณ ถ้าใช้เครื่องอื่น
}));

app.use(express.json());

// ทดสอบการเชื่อมต่อฐานข้อมูล
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() AS now");
        res.json({ status: "🟢 Database connected!", time: result.rows[0].now });
    } catch (err) {
        console.error("🔴 Database connection failed:", err);
        res.status(500).json({ error: "Database connection failed" });
    }
});

// ดูข้อมูลผู้ใช้ทั้งหมด
app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, username, email, profile_pic, registered_at FROM usersystem");
        res.json(result.rows);
    } catch (err) {
        console.error("🔴 Database Query Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ดูข้อมูลอีเวนต์ทั้งหมด
app.get("events/all", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, event_name, description, start_date, end_date, location, category, created_at, event_image_url FROM events");
        res.json(result.rows); // ส่งข้อมูลทั้งหมดจากตาราง events
    } catch (err) {
        console.error("🔴 Database Query Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
