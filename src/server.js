import express from "express";
import * as dotenv from "dotenv";
import pg from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 

const { Pool } = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false, 
});

app.get("/", (req, res) => {
    res.send("<h1>Hello, Express!</h1>");
});

// 📌 API: สมัครสมาชิก
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    try {
        // เช็คว่ามี email นี้ในระบบหรือไม่
        const userCheck = await pool.query("SELECT * FROM usersystem WHERE email = $1", [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: "อีเมลนี้ถูกใช้ไปแล้ว" });
        }

        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(password, 10);

        // บันทึกข้อมูลลง Database
        const result = await pool.query(
            "INSERT INTO usersystem (username, email, password) VALUES ($1, $2, $3) RETURNING *",
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: "สมัครสมาชิกสำเร็จ", user: result.rows[0] });
    } catch (err) {
        console.error("🔴 Register Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 API: เข้าสู่ระบบ
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "กรุณากรอกอีเมลและรหัสผ่าน" });
    }

    try {
        // ค้นหาผู้ใช้จากอีเมล
        const userCheck = await pool.query("SELECT * FROM usersystem WHERE email = $1", [email]);
        if (userCheck.rows.length === 0) {
            return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }

        const user = userCheck.rows[0];

        // ตรวจสอบรหัสผ่าน
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }

        // สร้าง JWT Token
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "เข้าสู่ระบบสำเร็จ", token });
    } catch (err) {
        console.error("🔴 Login Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 API: ดึงข้อมูลผู้ใช้ทั้งหมด
app.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT id, username, email, profile_pic, registered_at FROM usersystem");
        res.json(result.rows);
    } catch (err) {
        console.error("🔴 Database Query Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 API: ดึงข้อมูลผู้ใช้ตาม ID
app.get("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("SELECT id, username, email, profile_pic, registered_at FROM usersystem WHERE id = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "ไม่พบผู้ใช้" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error("🔴 Database Query Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 API: ลบผู้ใช้
app.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query("DELETE FROM usersystem WHERE id = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "ไม่พบผู้ใช้" });
        }
        res.json({ message: "ลบผู้ใช้สำเร็จ", user: result.rows[0] });
    } catch (err) {
        console.error("🔴 Delete User Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📌 API: ทดสอบการเชื่อมต่อฐานข้อมูล
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