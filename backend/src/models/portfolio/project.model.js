import mongoose, { Schema, model } from "mongoose";

const projectSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  category: { type: String, trim: true, default: "Project" },
  image: { type: String, trim: true, default: "/images/office/case-study-product.webp" },
  imageAlt: { type: String, trim: true, default: "Kraviona portfolio project" },
  description: { type: String, required: true, trim: true, maxlength: 1200 },
  content: { type: String, default: "" }, // Full Rich Text HTML from TipTap
  client: { type: String, trim: true, default: "" },
  duration: { type: String, trim: true, default: "" },
  githubUrl: { type: String, trim: true, default: "" },
  gallery: [{ type: String, trim: true }],
  metrics: [{
    label: { type: String, trim: true },
    value: { type: String, trim: true },
  }],
  overview: { type: String, trim: true, maxlength: 10000 },
  challenge: { type: String, trim: true, maxlength: 10000 },
  solution: { type: String, trim: true, maxlength: 10000 },
  results: [{ type: String, trim: true, maxlength: 300 }],
  techStack: [{ type: String, trim: true, maxlength: 100 }],
  projectUrl: { type: String, trim: true, default: "" },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  createdBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
}, { timestamps: true });

projectSchema.index({ isActive: 1, isFeatured: 1, order: 1 });
projectSchema.index({ createdBy: 1, createdAt: -1 });
export const Project = mongoose.models.Project || model("Project", projectSchema);
