import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js';
import eventRoutes from "./routes/eventRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js"; // เพิ่มเส้นทาง Favorite
import connectDB from "./config/db.js";
import apiLimiter from './middleware/rateLimiter.js';

dotenv.config();
connectDB();

const app = express();

// อนุญาตให้เชื่อมต่อจาก Frontend
app.use(cors({
    origin: 'http://localhost:5173' 
}));

app.use(express.json());
app.use(apiLimiter);

// Routes
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/favorites", favoriteRoutes); // เพิ่มเส้นทางนี้

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});