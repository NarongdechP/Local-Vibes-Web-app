import jwt from "jsonwebtoken";

const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ error: "Token หมดอายุ กรุณาเข้าสู่ระบบใหม่" });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({ error: "Token ไม่ถูกต้อง" });
        }
        return res.status(401).json({ error: "Authentication Failed" });
    }
};

export default authenticateUser;

