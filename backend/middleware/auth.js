import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Verifies the "Authorization: Bearer <token>" header and attaches the
// authenticated user to req.user. Use on any route that should only be
// reachable by logged-in users.
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "دسترسی غیرمجاز: توکن ارسال نشده است" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ error: "دسترسی غیرمجاز: کاربر یافت نشد" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "دسترسی غیرمجاز: توکن نامعتبر یا منقضی شده است" });
  }
};
