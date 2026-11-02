import { MessageModel } from "../../models/messages/message.model.js";
import { handleContactFormSubmission } from "../../services/email/emailService.js";

const canManageMessages = (user) =>
  user && user.role === "super_admin";

const handleMessageError = (error, res) => {
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    });
  }

  return res.status(500).json({ message: error.message, success: false });
};

const cleanText = (value) => String(value || "").trim();

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export const createMessage = async (req, res) => {
  try {
    const { firstName, lastName, name, email, phone, subject, message, source } = req.body;

    let cleanFirst = cleanText(firstName);
    let cleanLast = cleanText(lastName);

    if (!cleanFirst && name) {
      const parts = cleanText(name).split(/\s+/);
      cleanFirst = parts[0] || "";
      cleanLast = parts.slice(1).join(" ");
    }

    const cleanEmail = cleanText(email).toLowerCase();
    const cleanPhone = cleanText(phone);
    const cleanSubject = cleanText(subject) || "Website Service Inquiry";
    const cleanMsg = cleanText(message);

    // Validation
    if (!cleanFirst) {
      return res.status(400).json({
        message: "First name is required",
        success: false,
      });
    }

    if (!cleanEmail) {
      return res.status(400).json({
        message: "Email address is required",
        success: false,
      });
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({
        message: "Enter a valid email address",
        success: false,
      });
    }

    if (!cleanMsg) {
      return res.status(400).json({
        message: "Message is required",
        success: false,
      });
    }

    if (cleanMsg.length < 5) {
      return res.status(400).json({
        message: "Message should be at least 5 characters",
        success: false,
      });
    }

    const submissionResult = await handleContactFormSubmission({
      firstName: cleanFirst,
      lastName: cleanLast,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject,
      message: cleanMsg,
      source: source ? cleanText(source) : "Website Contact Form",
    });

    return res.status(201).json({
      message: "Message sent successfully! We will contact you soon.",
      success: true,
      messageId: submissionResult.messageId,
      conversationId: submissionResult.conversationId,
    });
  } catch (error) {
    return handleMessageError(error, res);
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized", success: false });
    if (!canManageMessages(user)) {
      return res.status(403).json({ message: "Forbidden", success: false });
    }

    const { status, page = 1, limit = 20, search } = req.query;
    const query = {};

    if (status && status !== "All") query.status = status.toLowerCase();
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
        { messageId: { $regex: search, $options: "i" } },
      ];
    }

    const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const perPage = Math.min(Math.max(Number.parseInt(limit, 10) || 20, 1), 100);

    const messages = await MessageModel.find(query)
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    const total = await MessageModel.countDocuments(query);

    return res.status(200).json({
      message: messages.length ? "Messages fetched successfully" : "No messages found",
      success: true,
      data: messages,
      pagination: {
        total,
        page: currentPage,
        limit: perPage,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    return handleMessageError(error, res);
  }
};

export const getMessageById = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized", success: false });
    if (!canManageMessages(user)) {
      return res.status(403).json({ message: "Forbidden", success: false });
    }

    const contactMessage = await MessageModel.findById(req.params.id).select("-__v");
    if (!contactMessage) {
      return res.status(404).json({ message: "Message not found", success: false });
    }

    return res.status(200).json({
      message: "Message fetched successfully",
      success: true,
      data: contactMessage,
    });
  } catch (error) {
    return handleMessageError(error, res);
  }
};

export const updateMessage = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized", success: false });
    if (!canManageMessages(user)) {
      return res.status(403).json({ message: "Forbidden", success: false });
    }

    const isMessage = await MessageModel.findById(req.params.id);
    if (!isMessage) {
      return res.status(404).json({ message: "Message not found", success: false });
    }

    const { firstName, lastName, email, phone, subject, message, status } = req.body;
    const updates = {
      ...(firstName !== undefined && { firstName: cleanText(firstName) }),
      ...(lastName !== undefined && { lastName: cleanText(lastName) }),
      ...(email !== undefined && { email: cleanText(email).toLowerCase() }),
      ...(phone !== undefined && { phone: cleanText(phone) }),
      ...(subject !== undefined && { subject: cleanText(subject) }),
      ...(message !== undefined && { message: cleanText(message) }),
      ...(status !== undefined && { status }),
    };

    const updatedMessage = await MessageModel.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-__v");

    return res.status(200).json({
      message: "Message updated successfully",
      success: true,
      data: updatedMessage,
    });
  } catch (error) {
    return handleMessageError(error, res);
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized", success: false });
    if (!canManageMessages(user)) {
      return res.status(403).json({ message: "Forbidden", success: false });
    }

    const isMessage = await MessageModel.findById(req.params.id);
    if (!isMessage) {
      return res.status(404).json({ message: "Message not found", success: false });
    }

    await MessageModel.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Message deleted successfully",
      success: true,
      data: isMessage,
    });
  } catch (error) {
    return handleMessageError(error, res);
  }
};
