import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
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

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
