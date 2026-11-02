import {
  EmailConversation,
  EmailMessage,
} from "../../models/emails/index.js";
import {
  sendAdminReply,
  sendAdminComposedEmail,
  retryEmailSend,
  processWebhookPayload,
} from "../../services/email/emailService.js";
import {
  getResendClient,
  isResendReady,
  getSenderIdentity,
  getAdminNotificationEmail,
} from "../../services/email/resendClient.js";

const canManageEmails = (user) => user && user.role === "super_admin";

const handleEmailError = (error, res) => {
  console.error("Email operation error:", error);
  return res.status(error.status || 500).json({
    success: false,
    message: error.message || "Email operation failed",
  });
};

/**
 * List email conversations with search, status filters, and pagination
 */
export const getConversations = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!canManageEmails(user)) {
      return res.status(403).json({ success: false, message: "Forbidden: Super Admin only" });
    }

    const {
      status = "all",
      source,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    if (status && status !== "all") {
      if (status === "archived") {
        query.isArchived = true;
      } else {
        query.status = status.toLowerCase();
        query.isArchived = false;
      }
    } else {
      query.isArchived = false;
    }

    if (source && source !== "all") {
      query.source = source.toLowerCase();
    }

    if (search && search.trim()) {
      const term = search.trim();
      query.$or = [
        { "customer.name": { $regex: term, $options: "i" } },
        { "customer.email": { $regex: term, $options: "i" } },
        { "customer.phone": { $regex: term, $options: "i" } },
        { subject: { $regex: term, $options: "i" } },
        { conversationId: { $regex: term, $options: "i" } },
        { latestMessageSnippet: { $regex: term, $options: "i" } },
      ];
    }

    const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const perPage = Math.min(Math.max(Number.parseInt(limit, 10) || 20, 1), 100);

    const [conversations, total, unreadTotal] = await Promise.all([
      EmailConversation.find(query)
        .select("-__v")
        .sort({ lastMessageAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage),
      EmailConversation.countDocuments(query),
      EmailConversation.countDocuments({ status: "unread", isArchived: false }),
    ]);

    return res.status(200).json({
      success: true,
      message: conversations.length ? "Conversations loaded" : "No conversations found",
      data: conversations,
      unreadTotal,
      pagination: {
        total,
        page: currentPage,
        limit: perPage,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    return handleEmailError(error, res);
  }
};

/**
 * Get single conversation with full message thread history
 */
export const getConversationById = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!canManageEmails(user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { id } = req.params;

    // Search by conversationId or _id
    let conversation = await EmailConversation.findOne({
      $or: [{ conversationId: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
    }).select("-__v");

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    // Auto mark as read on view if requested via query ?markRead=true
    if (req.query.markRead === "true" && conversation.status === "unread") {
      conversation.status = "read";
      conversation.unreadCount = 0;
      await conversation.save();
    }

    // Load full message thread in chronological order
    const messages = await EmailMessage.find({
      conversationId: conversation.conversationId,
    })
      .select("-__v")
      .sort({ createdAt: 1 })
      .populate("sentBy", "name email");

    return res.status(200).json({
      success: true,
      data: {
        conversation,
        messages,
      },
    });
  } catch (error) {
    return handleEmailError(error, res);
  }
};

/**
 * Update conversation status, archive flag, or notes
 */
export const updateConversation = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!canManageEmails(user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { id } = req.params;
    const { status, isArchived, notes, tags } = req.body;

    const updates = {};
    if (status !== undefined) {
      updates.status = status;
      if (status === "read") updates.unreadCount = 0;
    }
    if (isArchived !== undefined) updates.isArchived = Boolean(isArchived);
    if (notes !== undefined) updates.notes = String(notes);
    if (Array.isArray(tags)) updates.tags = tags;

    const conversation = await EmailConversation.findOneAndUpdate(
      {
        $or: [{ conversationId: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
      },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Conversation updated",
      data: conversation,
    });
  } catch (error) {
    return handleEmailError(error, res);
  }
};

/**
 * Super Admin reply directly to an existing conversation
 */
export const postReply = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!canManageEmails(user)) {
      return res.status(403).json({ success: false, message: "Forbidden: Super Admin only" });
    }

    const { id } = req.params;
    const { replyText, replyHtml } = req.body;

    if (!replyText && !replyHtml) {
      return res.status(400).json({
        success: false,
        message: "Reply content cannot be empty",
      });
    }

    // Resolve conversationId
    const conversation = await EmailConversation.findOne({
      $or: [{ conversationId: id }, ...(id.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: id }] : [])],
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const createdReply = await sendAdminReply({
      conversationId: conversation.conversationId,
      replyText: String(replyText || "").trim(),
      replyHtml: replyHtml || "",
      adminUser: user,
    });

    return res.status(201).json({
      success: true,
      message: "Reply sent successfully",
      data: createdReply,
    });
  } catch (error) {
    return handleEmailError(error, res);
  }
};

/**
 * Super Admin composes a brand new email
 */
export const composeEmail = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!canManageEmails(user)) {
      return res.status(403).json({ success: false, message: "Forbidden: Super Admin only" });
    }

    const { to, recipientName, subject, bodyText, bodyHtml } = req.body;

    const result = await sendAdminComposedEmail({
      to,
      recipientName,
      subject,
      bodyText,
      bodyHtml,
      adminUser: user,
    });

    return res.status(201).json({
      success: true,
      message: "Email sent successfully",
      data: result,
    });
  } catch (error) {
    return handleEmailError(error, res);
  }
};

/**
 * Super Admin retries sending a failed email
 */
export const retryEmail = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!canManageEmails(user)) {
      return res.status(403).json({ success: false, message: "Forbidden: Super Admin only" });
    }

    const { id } = req.params;
    const retriedMsg = await retryEmailSend(id, user);

    return res.status(200).json({
      success: true,
      message: "Email re-sent successfully",
      data: retriedMsg,
    });
  } catch (error) {
    return handleEmailError(error, res);
  }
};

/**
 * Get all sent outbound emails with delivery tracking status
 */
export const getSentEmails = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!canManageEmails(user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { page = 1, limit = 20, search } = req.query;
    const query = { direction: "outbound" };

    if (search && search.trim()) {
      query.$or = [
        { "recipient.email": { $regex: search.trim(), $options: "i" } },
        { "recipient.name": { $regex: search.trim(), $options: "i" } },
        { subject: { $regex: search.trim(), $options: "i" } },
        { messageId: { $regex: search.trim(), $options: "i" } },
        { resendEmailId: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const perPage = Math.min(Math.max(Number.parseInt(limit, 10) || 20, 1), 100);

    const [messages, total] = await Promise.all([
      EmailMessage.find(query)
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .populate("sentBy", "name email"),
      EmailMessage.countDocuments(query),
    ]);

    return res.status(200).json({
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
    return handleEmailError(error, res);
  }
};

/**
 * Get all failed / bounced outbound emails
 */
export const getFailedEmails = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!canManageEmails(user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const { page = 1, limit = 20 } = req.query;
    const query = {
      direction: "outbound",
      status: { $in: ["failed", "bounced"] },
    };

    const currentPage = Math.max(Number.parseInt(page, 10) || 1, 1);
    const perPage = Math.min(Math.max(Number.parseInt(limit, 10) || 20, 1), 100);

    const [messages, total] = await Promise.all([
      EmailMessage.find(query)
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage)
        .populate("sentBy", "name email"),
      EmailMessage.countDocuments(query),
    ]);

    return res.status(200).json({
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
    return handleEmailError(error, res);
  }
};

/**
 * Comprehensive Email stats for Super Admin inbox
 */
export const getEmailStats = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!canManageEmails(user)) {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }

    const [
      totalConversations,
      unreadCount,
      repliedCount,
      archivedCount,
      sentCount,
      failedCount,
    ] = await Promise.all([
      EmailConversation.countDocuments({ isArchived: false }),
      EmailConversation.countDocuments({ status: "unread", isArchived: false }),
      EmailConversation.countDocuments({ status: "replied", isArchived: false }),
      EmailConversation.countDocuments({ isArchived: true }),
      EmailMessage.countDocuments({ direction: "outbound" }),
      EmailMessage.countDocuments({
        direction: "outbound",
        status: { $in: ["failed", "bounced"] },
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalConversations,
        unreadCount,
        repliedCount,
        archivedCount,
        sentCount,
        failedCount,
        isResendReady: isResendReady(),
        senderIdentity: getSenderIdentity(),
        adminNotificationEmail: getAdminNotificationEmail(),
      },
    });
  } catch (error) {
    return handleEmailError(error, res);
  }
};

/**
 * Super Admin test email sending to verify Resend setup
 */
export const testSendEmail = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!canManageEmails(user)) {
      return res.status(403).json({ success: false, message: "Forbidden: Super Admin only" });
    }

    if (!isResendReady()) {
      return res.status(400).json({
        success: false,
        message: "Resend is not configured. Please set RESEND_API_KEY in environment variables.",
      });
    }

    const targetEmail = req.body?.to || user.email || getAdminNotificationEmail();
    const resend = getResendClient();

    const sendResult = await resend.emails.send({
      from: getSenderIdentity(),
      to: [targetEmail],
      subject: "Kraviona Email System — Test Verification",
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
          <h2 style="color: #123f46;">Kraviona Email System is Working!</h2>
          <p>This test email confirms that your Resend integration is operational.</p>
          <ul>
            <li><strong>Sender Identity:</strong> ${getSenderIdentity()}</li>
            <li><strong>Recipient:</strong> ${targetEmail}</li>
            <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
          </ul>
        </div>
      `,
      text: `Kraviona Email System is operational. Sent from ${getSenderIdentity()} to ${targetEmail} at ${new Date().toISOString()}`,
    });

    if (sendResult?.error) {
      return res.status(400).json({
        success: false,
        message: sendResult.error.message || "Test email sending failed",
        error: sendResult.error,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Test email sent to ${targetEmail}`,
      data: sendResult.data,
    });
  } catch (error) {
    return handleEmailError(error, res);
  }
};

/**
 * Resend Webhook handler for delivery, bounce, and receiving events
 */
export const handleResendWebhook = async (req, res) => {
  try {
    const rawBody = req.rawBody || Buffer.from(JSON.stringify(req.body));
    const headers = req.headers;
    const parsedBody = req.body;

    const result = await processWebhookPayload({
      rawBody,
      headers,
      parsedBody,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Webhook processing error:", error.message);
    const statusCode = error.status || 400;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Webhook processing failed",
    });
  }
};
