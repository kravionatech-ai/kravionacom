import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true },
    contentType: { type: String, default: "application/octet-stream" },
    size: { type: Number, default: 0 },
    url: { type: String, default: "" },
    resendAttachmentId: { type: String, default: "" },
  },
  { _id: false }
);

const deliveryEventSchema = new mongoose.Schema(
  {
    event: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    data: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const emailMessageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    conversationId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    direction: {
      type: String,
      enum: ["inbound", "outbound"],
      required: true,
      index: true,
    },
    sender: {
      name: { type: String, trim: true, default: "" },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
      },
    },
    recipient: {
      name: { type: String, trim: true, default: "" },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
      },
    },
    replyTo: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    bodyText: {
      type: String,
      default: "",
    },
    bodyHtml: {
      type: String,
      default: "",
    },
    resendEmailId: {
      type: String,
      sparse: true,
      index: true,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: [
        "received",
        "queued",
        "sent",
        "delivered",
        "failed",
        "bounced",
        "opened",
        "clicked",
      ],
      default: "received",
      index: true,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    retryCount: {
      type: Number,
      default: 0,
    },
    inReplyTo: {
      type: String,
      trim: true,
      default: "",
    },
    source: {
      type: String,
      trim: true,
      default: "contact_form",
    },
    attachments: {
      type: [attachmentSchema],
      default: [],
    },
    headers: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    deliveryEvents: {
      type: [deliveryEventSchema],
      default: [],
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

emailMessageSchema.index({ conversationId: 1, createdAt: 1 });
emailMessageSchema.index({ status: 1, createdAt: -1 });
emailMessageSchema.index({ direction: 1, createdAt: -1 });

export const EmailMessage =
  mongoose.models.EmailMessage ||
  mongoose.model("EmailMessage", emailMessageSchema);
