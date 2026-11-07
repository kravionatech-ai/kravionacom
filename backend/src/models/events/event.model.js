import mongoose, { Schema, model } from "mongoose";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
      index: true,
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    badge: {
      type: String,
      trim: true,
      default: "Special Offer",
    },
    badgeColor: {
      type: String,
      trim: true,
      default: "#F15A35", // Brand Orange
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    eventType: {
      type: String,
      enum: ["offer", "event", "webinar", "announcement"],
      default: "offer",
      index: true,
    },
    displayType: {
      type: String,
      enum: ["modal_popup", "top_banner", "floating_card"],
      default: "modal_popup",
    },
    ctaText: {
      type: String,
      trim: true,
      default: "Claim Offer",
    },
    ctaLink: {
      type: String,
      trim: true,
      default: "/contact",
    },
    secondaryCtaText: {
      type: String,
      trim: true,
      default: "",
    },
    secondaryCtaLink: {
      type: String,
      trim: true,
      default: "",
    },
    bannerImage: {
      type: String,
      trim: true,
      default: "",
    },
    startDate: {
      type: Date,
      default: null,
    },
    endDate: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    priority: {
      type: Number,
      default: 1,
    },
    showDelaySeconds: {
      type: Number,
      default: 3,
    },
    frequencyHours: {
      type: Number,
      default: 24, // 0 = every session, 24 = once a day if dismissed
    },
    targetPages: {
      type: String,
      enum: ["all", "home_only", "services_only", "blog_only"],
      default: "all",
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    clicksCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast lookup
eventSchema.index({ isActive: 1, priority: -1, createdAt: -1 });

export default mongoose.models.Event || model("Event", eventSchema);
