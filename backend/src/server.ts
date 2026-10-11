import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDatabase } from "./config/db";
import authRoutes from "./routes/auth";
import enquiryRoutes from "./routes/enquiries";
import { errorHandler, notFound } from "./middleware/errors";

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "20kb" }));
app.use("/api/auth", rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false }));
app.use("/api/enquiries", rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false }));
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT || 5000);
connectDatabase().then(() => {
  app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
}).catch((err: unknown) => {
  console.error("Could not connect to MongoDB. Check that MongoDB is running and MONGODB_URI is correct.");
  if (process.env.NODE_ENV !== "production") console.error(err);
  process.exit(1);
});
