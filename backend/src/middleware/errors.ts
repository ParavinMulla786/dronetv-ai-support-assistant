import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ message: "Endpoint not found." });
}
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ message: "Submitted data is invalid." });
    return;
  }
  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: "Invalid resource ID." });
    return;
  }
  if (process.env.NODE_ENV !== "production") console.error(err);
  res.status(500).json({ message: "An unexpected server error occurred." });
}
