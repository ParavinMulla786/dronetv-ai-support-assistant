import { Router } from "express";
import { isValidObjectId } from "mongoose";
import { z } from "zod";
import Enquiry from "../models/Enquiry";
import { requireAdmin } from "../middleware/auth";

const router = Router();
const enquirySchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().regex(/^[+()\-\s.\d]{10,20}$/).refine(v => v.replace(/\D/g, "").length >= 10 && v.replace(/\D/g, "").length <= 15, "Invalid phone"),
  userType: z.enum(["Student", "Customer", "Other"]),
  interest: z.string().trim().min(2).max(120),
  message: z.string().trim().min(5).max(3000)
});
const updateSchema = z.object({
  name: z.string().trim().min(2).max(100).optional(),
  email: z.string().trim().email().max(254).optional(),
  phone: z.string().trim().regex(/^[+()\-\s.\d]{10,20}$/).optional(),
  userType: z.enum(["Student", "Customer", "Other"]).optional(),
  interest: z.string().trim().min(2).max(120).optional(),
  message: z.string().trim().min(5).max(3000).optional(),
  status: z.enum(["New", "Contacted", "In Progress", "Closed"]).optional()
}).strict().refine(obj => Object.keys(obj).length > 0, "At least one field is required");

// Public creation endpoint: only validated fields are stored.
router.post("/", async (req, res, next) => {
  try {
    const parsed = enquirySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Please check the enquiry fields and try again.", errors: parsed.error.flatten().fieldErrors });
      return;
    }
    const enquiry = await Enquiry.create(parsed.data);
    res.status(201).json(enquiry);
  } catch (err) { next(err); }
});

// All enquiry reading and modification requires an authenticated admin.
router.use(requireAdmin);

router.get("/", async (req, res, next) => {
  try {
    const filter: Record<string, unknown> = {};
    if (typeof req.query.userType === "string" && ["Student", "Customer", "Other"].includes(req.query.userType)) filter.userType = req.query.userType;
    if (typeof req.query.status === "string" && ["New", "Contacted", "In Progress", "Closed"].includes(req.query.status)) filter.status = req.query.status;
    if (typeof req.query.search === "string" && req.query.search.trim()) {
      const escaped = req.query.search.trim().slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = ["name", "email", "phone", "interest"].map(field => ({ [field]: { $regex: escaped, $options: "i" } }));
    }
    const enquiries = await Enquiry.find(filter).sort({ createdAt: -1 }).limit(500).lean();
    res.json(enquiries);
  } catch (err) { next(err); }
});
router.get("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) { res.status(400).json({ message: "Invalid enquiry ID." }); return; }
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) { res.status(404).json({ message: "Enquiry not found." }); return; }
    res.json(enquiry);
  } catch (err) { next(err); }
});
router.patch("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) { res.status(400).json({ message: "Invalid enquiry ID." }); return; }
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ message: "Update fields are invalid.", errors: parsed.error.flatten().fieldErrors }); return; }
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
    if (!enquiry) { res.status(404).json({ message: "Enquiry not found." }); return; }
    res.json(enquiry);
  } catch (err) { next(err); }
});
router.put("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) { res.status(400).json({ message: "Invalid enquiry ID." }); return; }
    const parsed = enquirySchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ message: "Please check the enquiry fields and try again.", errors: parsed.error.flatten().fieldErrors }); return; }
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, parsed.data, { new: true, runValidators: true });
    if (!enquiry) { res.status(404).json({ message: "Enquiry not found." }); return; }
    res.json(enquiry);
  } catch (err) { next(err); }
});
router.delete("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) { res.status(400).json({ message: "Invalid enquiry ID." }); return; }
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) { res.status(404).json({ message: "Enquiry not found." }); return; }
    res.status(204).send();
  } catch (err) { next(err); }
});
export default router;
