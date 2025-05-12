import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import sanitizeHtml from "sanitize-html";
import User from "../models/User.js";

// 🔹 สมัครสมาชิก
export const register = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    let { username, email, password, profile_pic } = req.body;

    username = sanitizeHtml(username);
    email = sanitizeHtml(email);
    profile_pic = profile_pic ? sanitizeHtml(profile_pic) : null;

    try {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ error: "อีเมลนี้ถูกใช้ไปแล้ว" });

        const existingUsername = await User.findOne({ username });
        if (existingUsername) return res.status(400).json({ error: "ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPassword, profile_pic });
        await newUser.save();

        res.status(201).json({ message: "สมัครสมาชิกสำเร็จ", user: newUser });
    } catch (err) {
        console.error("🔴 Register Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🔹 เข้าสู่ระบบ
export const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

        const token = jwt.sign(
            { id: user._id, email: user.email, username: user.username, profile_pic: user.profile_pic },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({
            message: "เข้าสู่ระบบสำเร็จ",
            token,
            username: user.username,
            profile_pic: user.profile_pic
        });
    } catch (err) {
        console.error("🔴 Login Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🔹 เปลี่ยนรหัสผ่าน
export const changePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "ไม่พบผู้ใช้" });

        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) return res.status(401).json({ error: "รหัสผ่านเดิมไม่ถูกต้อง" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });
    } catch (err) {
        console.error("🔴 Change Password Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// 🔹 เปลี่ยนอีเมล
export const changeEmail = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { newEmail } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "ไม่พบผู้ใช้" });

        user.email = sanitizeHtml(newEmail);
        await user.save();

        res.json({ message: "เปลี่ยนอีเมลสำเร็จ", email: user.email });
    } catch (err) {
        console.error("🔴 Change Email Error:", err);
        res.status(500).json({ error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" });
    }
};
