import { Schema, model, type InferSchemaType } from "mongoose";

const enquirySchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, required: true, trim: true, maxlength: 20 },
  userType: { type: String, enum: ["Student", "Customer", "Other"], required: true },
  interest: { type: String, required: true, trim: true, maxlength: 120 },
  message: { type: String, required: true, trim: true, minlength: 5, maxlength: 3000 },
  status: { type: String, enum: ["New", "Contacted", "In Progress", "Closed"], default: "New" }
}, { timestamps: true, versionKey: false });

enquirySchema.index({ name: "text", email: "text", phone: "text", interest: "text" });
export type EnquiryDocument = InferSchemaType<typeof enquirySchema>;
export default model("Enquiry", enquirySchema);
