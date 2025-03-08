import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js'; // ใช้เส้นทางที่ถูกต้อง
import eventRoutes from "./routes/eventRoutes.js";
import connectDB from "./config/db.js";  // เชื่อมต่อ MongoDB

dotenv.config();
connectDB();  // เรียกฟังก์ชันเชื่อมต่อฐานข้อมูล

const app = express();

// อนุญาตให้เชื่อมต่อจาก Frontend
app.use(cors({
    origin: 'http://localhost:5173' 
}));

app.use(express.json());

app.get("/test-db", async (req, res) => {
    try {
        res.json({ status: "🟢 MongoDB connected!" });
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

