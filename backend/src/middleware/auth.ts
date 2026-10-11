import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request { adminId?: string }

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) {
    res.status(401).json({ message: "Admin authentication required." });
    return;
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ message: "Authentication is not configured." });
    return;
  }
  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload;
    if (typeof payload.sub !== "string") throw new Error("Invalid token subject");
    req.adminId = payload.sub;
    next();
  } catch {
    res.status(401).json({ message: "Session is invalid or expired. Please sign in again." });
  }
}
