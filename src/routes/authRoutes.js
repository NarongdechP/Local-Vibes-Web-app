import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";
import { body, validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html"; // ป้องกัน XSS

const router = express.Router();

// 📌 สมัครสมาชิก (เพิ่ม validation)
router.post(
    "/register",
    [
        body("username").trim().notEmpty().withMessage("กรุณากรอกชื่อผู้ใช้"),
        body("email").isEmail().withMessage("กรุณากรอกอีเมลที่ถูกต้อง"),
        body("password").isLength({ min: 8 }).withMessage("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"),
    ],
    async (req, res) => {
        // ตรวจสอบ Validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { username, email, password, profile_pic } = req.body;

        // ป้องกัน XSS (sanitize input)
        username = sanitizeHtml(username);
        email = sanitizeHtml(email);
        profile_pic = profile_pic ? sanitizeHtml(profile_pic) : null;

        try {
            const userCheck = await pool.query("SELECT * FROM usersystem WHERE email = $1", [email]);
            if (userCheck.rows.length > 0) {
                return res.status(400).json({ error: "อีเมลนี้ถูกใช้ไปแล้ว" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query(
                "INSERT INTO usersystem (username, email, password, profile_pic) VALUES ($1, $2, $3, $4) RETURNING id, username, email, profile_pic, registered_at",
                [username, email, hashedPassword, profile_pic]
            );

            res.status(201).json({ message: "สมัครสมาชิกสำเร็จ", user: result.rows[0] });
        } catch (err) {
            console.error("🔴 Register Error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// 📌 เข้าสู่ระบบ (เพิ่ม validation)
router.post(
    "/login",
    [
        body("email").isEmail().withMessage("กรุณากรอกอีเมลที่ถูกต้อง"),
        body("password").notEmpty().withMessage("กรุณากรอกรหัสผ่าน"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

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

            const token = jwt.sign(
                { id: user.id, email: user.email, username: user.username, profile_pic: user.profile_pic },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            res.json({ message: "เข้าสู่ระบบสำเร็จ", token });
        } catch (err) {
            console.error("🔴 Login Error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

export default router;

