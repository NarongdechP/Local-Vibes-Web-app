import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html"; // ป้องกัน XSS
import User from "../models/User.js"; // ใช้เส้นทางที่ถูกต้อง
import authenticateUser from "../middleware/authMiddleware.js"; // Middleware ตรวจสอบ Token

const router = express.Router();

// 📌 สมัครสมาชิก (รองรับทั้งอีเมลและเบอร์โทร)
router.post(
    "/register",
    [
        body("username").trim().notEmpty().withMessage("กรุณากรอกชื่อผู้ใช้"),
        body("email").custom((value) => {
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let { username, email, password, profile_pic } = req.body;

        // ป้องกัน XSS
        username = sanitizeHtml(username);
        email = sanitizeHtml(email);
        profile_pic = profile_pic ? sanitizeHtml(profile_pic) : null;

        try {
            // ตรวจสอบว่า username และ email ไม่ซ้ำกัน
            const existingUserByEmail = await User.findOne({ email });
            if (existingUserByEmail) {
                return res.status(400).json({ error: "อีเมลนี้ถูกใช้ไปแล้ว" });
            }

            const existingUserByUsername = await User.findOne({ username });
            if (existingUserByUsername) {
                return res.status(400).json({ error: "ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว" });
            }

            // เข้ารหัสรหัสผ่าน
            const hashedPassword = await bcrypt.hash(password, 10);

            // บันทึกผู้ใช้ใหม่
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                profile_pic,
            });

            await newUser.save();
            res.status(201).json({ message: "สมัครสมาชิกสำเร็จ", user: newUser });
        } catch (err) {
            console.error("🔴 Register Error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// 📌 เข้าสู่ระบบ
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
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
            }

            const token = jwt.sign(
                { id: user._id, email: user.email, username: user.username, profile_pic: user.profile_pic },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            // ✅ ส่ง username กลับไปใน response
            res.json({
                message: "เข้าสู่ระบบสำเร็จ",
                token,
                username: user.username, // ส่งกลับให้ Frontend เอาไปแสดงบน Navbar ได้
                profile_pic: user.profile_pic // ถ้าต้องใช้รูปโปรไฟล์ในอนาคตก็แนบไปเลย
            });
        } catch (err) {
            console.error("🔴 Login Error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// 📌 เปลี่ยนรหัสผ่าน (ต้องล็อกอินก่อน)
router.post(
    "/change-password",
    authenticateUser, // Middleware ตรวจสอบว่าผู้ใช้ล็อกอินก่อน
    [
        body("oldPassword").notEmpty().withMessage("กรุณากรอกรหัสผ่านเดิม"),
        body("newPassword").isLength({ min: 8 }).withMessage("รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id; // ได้จาก middleware authenticateUser

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "ไม่พบผู้ใช้" });
            }

            // ตรวจสอบว่ารหัสผ่านเดิมถูกต้องหรือไม่
            const passwordMatch = await bcrypt.compare(oldPassword, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ error: "รหัสผ่านเดิมไม่ถูกต้อง" });
            }

            // เข้ารหัสรหัสผ่านใหม่
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            // อัปเดตรหัสผ่าน
            user.password = hashedNewPassword;
            await user.save();

            res.json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
        } catch (err) {
            console.error("🔴 Change Password Error:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

// 📌 เปลี่ยนอีเมล (ต้องล็อกอินก่อน)
router.patch(
    "/change-email",
    authenticateUser, // Middleware ตรวจสอบ JWT Token
    [
        body("newEmail")
            .trim()
            .notEmpty()
            .withMessage("กรุณากรอกอีเมลใหม่")
            .custom((value) => {
                const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
                if (!emailPattern.test(value)) {
                    throw new Error("กรุณากรอกอีเมลที่ถูกต้อง");
                }
                return true;
            })
            .custom(async (value) => {
                const existingUser = await User.findOne({ email: value });
                if (existingUser) {
                    throw new Error("อีเมลนี้ถูกใช้ไปแล้ว");
                }
                return true;
            }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { newEmail } = req.body;
        const userId = req.user.id; // ดึง userId จาก Token

        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: "ไม่พบผู้ใช้" });
            }

            // ป้องกัน XSS
            user.email = sanitizeHtml(newEmail);

            // บันทึกอีเมลใหม่ลงในฐานข้อมูล
            await user.save();

            res.json({ message: "เปลี่ยนอีเมลสำเร็จ", email: user.email });
        } catch (err) {
            console.error("🔴 Change Email Error:", err);
            res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
        }
    }
);

// Express Route Example
router.get('/profile', authenticateUser, async (req, res) => {
    try {
      // ดึงข้อมูลผู้ใช้จาก User model โดยใช้ id ที่ได้จาก JWT
      const user = await User.findById(req.user.id).select('-password'); // ไม่ดึงรหัสผ่าน
      if (!user) {
        return res.status(404).json({ message: 'ไม่พบข้อมูลผู้ใช้' });
      }
      res.json({
        username: user.username,
        email: user.email,
        profile_pic: user.profile_pic,
        registered_at: user.registered_at,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้' });
    }
});
export default router;
