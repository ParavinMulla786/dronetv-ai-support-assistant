import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import Admin from "../models/Admin";

const router = Router();
const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(200)
});

router.post("/login", async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Enter a valid email and password." });
      return;
    }
    const admin = await Admin.findOne({ email: parsed.data.email.toLowerCase() });
    if (!admin || !(await bcrypt.compare(parsed.data.password, admin.passwordHash))) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      res.status(500).json({ message: "Authentication is not configured securely." });
      return;
    }
    const token = jwt.sign({ role: "admin" }, secret, { subject: admin.id, expiresIn: (process.env.JWT_EXPIRES_IN || "8h") as jwt.SignOptions["expiresIn"] });
    res.json({ token, expiresIn: process.env.JWT_EXPIRES_IN || "8h" });
  } catch (err) { next(err); }
});
export default router;
