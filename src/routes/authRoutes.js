import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js"; // ดึง database connection

const router = express.Router();

// 📌 สมัครสมาชิก
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "กรุณากรอกข้อมูลให้ครบถ้วน" });
    }

    try {
        const userCheck = await pool.query("SELECT * FROM usersystem WHERE email = $1", [email]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ error: "อีเมลนี้ถูกใช้ไปแล้ว" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
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

// 📌 เข้าสู่ระบบ
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "กรุณากรอกอีเมลและรหัสผ่าน" });
    }

    try {
        const userCheck = await pool.query("SELECT * FROM usersystem WHERE email = $1", [email]);
        if (userCheck.rows.length === 0) {
            return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }

        const user = userCheck.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "เข้าสู่ระบบสำเร็จ", token });
    } catch (err) {
        console.error("🔴 Login Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

export default router;
