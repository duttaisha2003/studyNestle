
const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: "❌ Token missing" });

    const payload = jwt.verify(token, process.env.JWT_KEY);

    if (!payload?.id) return res.status(401).json({ message: "❌ Invalid token payload" });

    req.admin = payload;
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    return res.status(401).json({ message: "❌ Invalid or Expired Token" });
  }
};

module.exports = adminMiddleware;
