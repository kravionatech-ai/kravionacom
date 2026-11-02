import mongoose from "mongoose";

const emailWebhookEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["processed", "failed", "ignored", "duplicate"],
      default: "processed",
      index: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    error: {
      type: String,
      default: "",
    },
    processedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

emailWebhookEventSchema.index({ eventType: 1, createdAt: -1 });

export const EmailWebhookEvent =
  mongoose.models.EmailWebhookEvent ||
  mongoose.model("EmailWebhookEvent", emailWebhookEventSchema);
