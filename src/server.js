import express from "express";
import * as dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";  // ✅ นำเข้า API Login/Register
import { pool } from "./config/db.js";  // ✅ นำเข้าการเชื่อมต่อ DB

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 📌 ใช้งาน API Authentication
app.use("/auth", authRoutes);

// 📌 API ทดสอบการเชื่อมต่อ Database
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() AS now");
        res.json({ status: "🟢 Database connected!", time: result.rows[0].now });
    } catch (err) {
        console.error("🔴 Database connection failed:", err);
        res.status(500).json({ error: "Database connection failed" });
    }
});

// 📌 เริ่มเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
