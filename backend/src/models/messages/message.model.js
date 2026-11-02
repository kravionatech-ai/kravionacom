import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    messageId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [1, "First name should be at least 1 character"],
      maxlength: [50, "First name should be maximum 50 characters"],
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
      default: "",
      maxlength: [50, "Last name should be maximum 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        "Enter a valid email address",
      ],
      minlength: [3, "Email should be at least 3 characters"],
      maxlength: [100, "Email should be maximum 100 characters"],
      index: true,
    },
    phone: {
      type: String,
      required: false,
      trim: true,
      default: "",
      maxlength: [30, "Phone number should be maximum 30 characters"],
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minlength: [2, "Subject should be at least 2 characters"],
      maxlength: [200, "Subject should be maximum 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [5, "Message should be at least 5 characters"],
      maxlength: [5000, "Message should be maximum 5000 characters"],
    },
    status: {
      type: String,
      default: "unread",
      enum: ["unread", "read", "replied", "archived"],
      index: true,
    },
    source: {
      type: String,
      default: "contact_page",
      trim: true,
    },
    conversationId: {
      type: String,
      index: true,
      default: "",
    },
    resendEmailId: {
      type: String,
      sparse: true,
      index: true,
      default: null,
    },
    notificationStatus: {
      type: String,
      enum: ["pending", "sent", "failed", "skipped"],
      default: "pending",
    },
  },
  { timestamps: true }
);

messageSchema.pre("validate", function (next) {
  if (!this.messageId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).slice(2, 6).toUpperCase();
    this.messageId = `MSG-${timestamp}-${random}`;
  }
  next();
});

export const MessageModel =
  mongoose.models.message || mongoose.model("message", messageSchema);
