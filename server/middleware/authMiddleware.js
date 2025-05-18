import jwt from "jsonwebtoken";
import User from "../models/User.js"; // ต้องการถ้ามีการตรวจสอบผู้ใช้ใน DB

const authenticateUser = async (req, res, next) => {
  // 1. ตรวจสอบ Header
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ 
      error: "Unauthorized",
      message: "Authorization header with Bearer token is required"
    });
  }

  // 2. ดึง Token
  const token = authHeader.split(" ")[1];

  try {
    // 3. ตรวจสอบ Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. (Optional) ตรวจสอบผู้ใช้ใน Database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ 
        error: "Unauthorized",
        message: "User not found"
      });
    }

    // 5. เก็บข้อมูลผู้ใช้ใน Request
    req.user = user; // เก็บทั้ง object ผู้ใช้แทนแค่ decoded token
    next();

  } catch (err) {
    // 6. จัดการ Error เฉพาะทาง
    const errorMapping = {
      TokenExpiredError: {
        status: 401,
        message: "Token expired. Please login again"
      },
      JsonWebTokenError: {
        status: 401,
        message: "Invalid token"
      },
      NotBeforeError: {
        status: 401,
        message: "Token not yet valid"
      }
    };

    const errorType = err.name;
    const { status, message } = errorMapping[errorType] || {
      status: 401,
      message: "Authentication failed"
    };

    return res.status(status).json({ error: "Unauthorized", message });
  }
};

export default authenticateUser;