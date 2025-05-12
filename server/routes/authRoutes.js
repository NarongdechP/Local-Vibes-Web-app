import express from "express";
import { body } from "express-validator";
import {
    register,
    login,
    changePassword,
    changeEmail
} from "../controllers/authController.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", [
    body("username").trim().notEmpty().withMessage("กรุณากรอกชื่อผู้ใช้"),
    body("email").custom((value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phonePattern = /^[0-9]{10}$/;
        if (!emailPattern.test(value) && !phonePattern.test(value)) {
            throw new Error("กรุณากรอกอีเมลที่ถูกต้องหรือเบอร์โทรศัพท์ 10 หลัก");
        }
        return true;
    }),
    body("password").isLength({ min: 8 }).withMessage("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")
], register);

router.post("/login", [
    body("email").isEmail().withMessage("กรุณากรอกอีเมลที่ถูกต้อง"),
    body("password").notEmpty().withMessage("กรุณากรอกรหัสผ่าน")
], login);

router.post("/change-password", [
    authenticateUser,
    body("oldPassword").notEmpty().withMessage("กรุณากรอกรหัสผ่านเดิม"),
    body("newPassword").isLength({ min: 8 }).withMessage("รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร")
], changePassword);

router.patch("/change-email", [
    authenticateUser,
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
            if (existingUser) throw new Error("อีเมลนี้ถูกใช้ไปแล้ว");
            return true;
        })
], changeEmail);

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

