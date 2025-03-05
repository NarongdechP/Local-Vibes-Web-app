import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../server/config/db.js";
import { body, validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html"; // ป้องกัน XSS

const router = express.Router();

// 📌 สมัครสมาชิก (ปรับให้รองรับทั้งอีเมลและเบอร์โทร)
router.post(
    "/register",
    [
        body("username").trim().notEmpty().withMessage("กรุณากรอกชื่อผู้ใช้"),
        body("email")
            .custom((value) => {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const phonePattern = /^[0-9]{10}$/;
                if (!emailPattern.test(value) && !phonePattern.test(value)) {
                    throw new Error("กรุณากรอกอีเมลที่ถูกต้องหรือเบอร์โทรศัพท์ 10 หลัก");
                }
                return true;
            }),
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
            // ตรวจสอบว่าอีเมลหรือเบอร์โทรนี้ถูกใช้ไปแล้วหรือยัง
            const userCheck = await pool.query("SELECT * FROM usersystem WHERE email = $1", [email]);
            if (userCheck.rows.length > 0) {
                return res.status(400).json({ error: "อีเมลหรือเบอร์โทรนี้ถูกใช้ไปแล้ว" });
            }

            // การเข้ารหัสรหัสผ่าน
            const hashedPassword = await bcrypt.hash(password, 10);

            // บันทึกข้อมูลผู้ใช้ใหม่
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

// 📌 เข้าสู่ระบบ (ยังคงรองรับการเข้าสู่ระบบด้วยอีเมล)
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
