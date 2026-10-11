import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin";

async function main() {
  const uri = process.env.MONGODB_URI;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!uri || !email || !password) throw new Error("Set MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env");
  if (password.length < 12) throw new Error("ADMIN_PASSWORD must be at least 12 characters.");
  await mongoose.connect(uri);
  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.findOneAndUpdate({ email }, { email, passwordHash }, { upsert: true, new: true, runValidators: true });
  console.log(`Admin account created/updated for ${email}`);
  await mongoose.disconnect();
}
main().catch(async err => { console.error(err.message || "Admin creation failed"); await mongoose.disconnect().catch(() => undefined); process.exit(1); });
