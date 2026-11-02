import mongoose from "mongoose";

const emailConversationSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      maxlength: [200, "Subject cannot exceed 200 characters"],
      index: true,
    },
    customer: {
      name: {
        type: String,
        trim: true,
        default: "Customer",
      },
      email: {
        type: String,
        required: [true, "Customer email is required"],
        trim: true,
        lowercase: true,
        index: true,
      },
      phone: {
        type: String,
        trim: true,
        default: "",
      },
      company: {
        type: String,
        trim: true,
        default: "",
      },
    },
    status: {
      type: String,
      enum: ["unread", "read", "replied", "archived"],
      default: "unread",
      index: true,
    },
    source: {
      type: String,
      enum: [
        "contact_form",
        "service_lead",
        "direct_inbound",
        "admin_outbound",
        "newsletter",
        "other",
      ],
      default: "contact_form",
      index: true,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    unreadCount: {
      type: Number,
      default: 1,
    },
    messageCount: {
      type: Number,
      default: 1,
    },
    latestMessageSnippet: {
      type: String,
      trim: true,
      maxlength: [300, "Snippet cannot exceed 300 characters"],
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    contactMessageId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "message",
      default: null,
    },
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

emailConversationSchema.index({ lastMessageAt: -1 });
emailConversationSchema.index({ status: 1, lastMessageAt: -1 });
emailConversationSchema.index({ "customer.email": 1, lastMessageAt: -1 });

export const EmailConversation =
  mongoose.models.EmailConversation ||
  mongoose.model("EmailConversation", emailConversationSchema);
