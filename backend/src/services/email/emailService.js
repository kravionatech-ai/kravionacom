import sanitizeHtml from "sanitize-html";
import { Webhook } from "svix";
import mongoose from "mongoose";
import config from "../../config/config.js";
import {
  EmailConversation,
  EmailMessage,
  EmailWebhookEvent,
} from "../../models/emails/index.js";
import { MessageModel } from "../../models/messages/message.model.js";
import {
  getResendClient,
  isResendReady,
  getSenderIdentity,
  getAdminNotificationEmail,
} from "./resendClient.js";
import {
  buildContactFormNotificationHtml,
  buildCustomerAcknowledgmentHtml,
  buildAdminReplyHtml,
  buildNewInquiryNotificationHtml,
  buildEmailFailureNotificationHtml,
} from "./emailTemplates.js";

const SANITIZE_OPTIONS = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([
    "img",
    "h1",
    "h2",
    "h3",
    "h4",
    "span",
    "u",
    "s",
    "strike",
    "del",
    "pre",
    "code",
    "hr",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
  ]),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ["src", "alt", "title", "width", "height", "style"],
    a: ["href", "name", "target", "rel"],
    "*": ["style", "class"],
  },
  allowedSchemes: ["http", "https", "mailto", "data"],
};

export const sanitizeEmailHtml = (dirtyHtml) => {
  if (!dirtyHtml || typeof dirtyHtml !== "string") return "";
  return sanitizeHtml(dirtyHtml, SANITIZE_OPTIONS);
};

export const generateUniqueId = (prefix = "MSG") => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}-${dateStr}-${randomStr}`;
};

/**
 * Handle new public contact form submission:
 * 1. Validate fields
 * 2. Save to database (MessageModel + EmailConversation + EmailMessage)
 * 3. Send notification email to admin (kravionatech@gmail.com) via Resend
 * 4. Send acknowledgment to customer via Resend
 */
export const handleContactFormSubmission = async ({
  firstName,
  lastName = "",
  email,
  phone = "",
  subject,
  message,
  source = "Website Contact Form",
}) => {
  const cleanFirst = String(firstName || "").trim();
  const cleanLast = String(lastName || "").trim();
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanPhone = String(phone || "").trim();
  const cleanSubject = String(subject || "").trim() || "Service Inquiry";
  const cleanMessage = String(message || "").trim();
  const fullName = [cleanFirst, cleanLast].filter(Boolean).join(" ");

  const messageId = generateUniqueId("MSG");
  const conversationId = generateUniqueId("CNV");

  // 1. Create EmailConversation
  const conversation = await EmailConversation.create({
    conversationId,
    subject: cleanSubject,
    customer: {
      name: fullName,
      email: cleanEmail,
      phone: cleanPhone,
    },
    status: "unread",
    source: "contact_form",
    unreadCount: 1,
    messageCount: 1,
    latestMessageSnippet: cleanMessage.slice(0, 250),
    tags: ["contact-form"],
    lastMessageAt: new Date(),
  });

  // 2. Create inbound EmailMessage
  const emailMsg = await EmailMessage.create({
    messageId,
    conversationId,
    direction: "inbound",
    sender: {
      name: fullName,
      email: cleanEmail,
    },
    recipient: {
      name: "Kraviona Support",
      email: getAdminNotificationEmail(),
    },
    replyTo: cleanEmail,
    subject: cleanSubject,
    bodyText: cleanMessage,
    bodyHtml: `<p>${cleanMessage.replace(/\n/g, "<br>")}</p>`,
    status: "received",
    source: "contact_form",
  });

  // 3. Save to existing MessageModel for backward compatibility
  let legacyMessage = null;
  try {
    legacyMessage = await MessageModel.create({
      messageId,
      firstName: cleanFirst,
      lastName: cleanLast,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject,
      message: cleanMessage,
      status: "unread",
      source,
      conversationId,
      notificationStatus: "pending",
    });

    conversation.contactMessageId = legacyMessage._id;
    await conversation.save();
  } catch (err) {
    console.error("Warning: could not save to legacy MessageModel:", err.message);
  }

  // 4. Send admin notification email via Resend
  let resendNotificationId = null;
  let notificationStatus = "skipped";
  let notificationError = null;

  if (isResendReady()) {
    try {
      const resend = getResendClient();
      const adminHtml = buildContactFormNotificationHtml({
        messageId,
        name: fullName,
        email: cleanEmail,
        phone: cleanPhone,
        subject: cleanSubject,
        message: cleanMessage,
        source,
      });

      const sendResult = await resend.emails.send({
        from: getSenderIdentity(),
        to: [getAdminNotificationEmail()],
        reply_to: cleanEmail, // Validated visitor email as Reply-To
        subject: `[New Inquiry] ${cleanSubject} - ${fullName}`,
        html: adminHtml,
        text: `New contact submission from ${fullName} (${cleanEmail}, Phone: ${cleanPhone || "N/A"}):\n\nSubject: ${cleanSubject}\n\nMessage:\n${cleanMessage}\n\nMessage ID: ${messageId}`,
      });

      if (sendResult?.data?.id) {
        resendNotificationId = sendResult.data.id;
        notificationStatus = "sent";
        if (legacyMessage) {
          legacyMessage.resendEmailId = resendNotificationId;
          legacyMessage.notificationStatus = "sent";
          await legacyMessage.save();
        }
      } else if (sendResult?.error) {
        notificationStatus = "failed";
        notificationError = sendResult.error.message || "Resend error";
        console.error("Resend admin notification error:", sendResult.error);
      }
    } catch (err) {
      notificationStatus = "failed";
      notificationError = err.message;
      console.error("Failed to send Resend admin notification email:", err.message);
    }

    // 5. Send customer acknowledgment email
    try {
      const resend = getResendClient();
      const ackHtml = buildCustomerAcknowledgmentHtml({
        name: fullName,
        messageId,
        subject: cleanSubject,
        message: cleanMessage,
      });

      await resend.emails.send({
        from: getSenderIdentity(),
        to: [cleanEmail],
        subject: `We've received your inquiry: ${cleanSubject} [${messageId}]`,
        html: ackHtml,
        text: `Hello ${fullName},\n\nThank you for reaching out to Kraviona Tech Solutions. We have received your inquiry (Ref: ${messageId}) and our team will get back to you within 1 business day.\n\nSummary of your message:\n${cleanMessage}\n\nBest regards,\nKraviona Team`,
      });
    } catch (ackErr) {
      console.warn("Could not send customer acknowledgment email:", ackErr.message);
    }
  } else {
    console.warn("Resend is not configured (missing RESEND_API_KEY). Email notifications skipped.");
  }

  return {
    success: true,
    messageId,
    conversationId,
    resendNotificationId,
    notificationStatus,
    notificationError,
    data: {
      firstName: cleanFirst,
      lastName: cleanLast,
      email: cleanEmail,
      subject: cleanSubject,
    },
  };
};

/**
 * Handle new lead form submission:
 * Creates an inquiry notification email and links with conversation.
 */
export const handleLeadNotification = async (lead) => {
  const inquiryId = generateUniqueId("LEAD");
  const conversationId = generateUniqueId("CNV");

  try {
    const conversation = await EmailConversation.create({
      conversationId,
      subject: lead.subject || `Lead: ${lead.service || "New Inquiry"}`,
      customer: {
        name: lead.name,
        email: lead.email,
        phone: lead.phone || "",
        company: lead.company || "",
      },
      status: "unread",
      source: "service_lead",
      unreadCount: 1,
      messageCount: 1,
      latestMessageSnippet: (lead.message || "").slice(0, 250),
      tags: ["lead-popup", lead.service].filter(Boolean),
      leadId: lead._id,
      lastMessageAt: new Date(),
    });

    await EmailMessage.create({
      messageId: inquiryId,
      conversationId,
      direction: "inbound",
      sender: {
        name: lead.name,
        email: lead.email,
      },
      recipient: {
        name: "Kraviona Support",
        email: getAdminNotificationEmail(),
      },
      replyTo: lead.email,
      subject: lead.subject || `Lead Inquiry: ${lead.service}`,
      bodyText: lead.message,
      bodyHtml: `<p>${(lead.message || "").replace(/\n/g, "<br>")}</p>`,
      status: "received",
      source: "service_lead",
    });

    if (isResendReady()) {
      const resend = getResendClient();
      const leadHtml = buildNewInquiryNotificationHtml({
        inquiryId,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        service: lead.service,
        budget: lead.budget,
        company: lead.company,
        message: lead.message,
        sourceUrl: lead.page,
      });

      await resend.emails.send({
        from: getSenderIdentity(),
        to: [getAdminNotificationEmail()],
        reply_to: lead.email,
        subject: `[High Intent Lead] ${lead.service || "Service Lead"} - ${lead.name}`,
        html: leadHtml,
        text: `New Lead received from ${lead.name} (${lead.email}, Phone: ${lead.phone || "N/A"}):\n\nService: ${lead.service}\nBudget: ${lead.budget}\nCompany: ${lead.company || "N/A"}\n\nMessage:\n${lead.message}\n\nRef: ${inquiryId}`,
      });
    }
  } catch (err) {
    console.error("Error processing lead email notification:", err);
  }
};

/**
 * Super Admin sends a reply to an existing customer conversation
 */
export const sendAdminReply = async ({
  conversationId,
  replyText,
  replyHtml,
  adminUser,
}) => {
  const conversation = await EmailConversation.findOne({ conversationId });
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const latestInbound = await EmailMessage.findOne({
    conversationId,
    direction: "inbound",
  }).sort({ createdAt: -1 });

  const messageId = generateUniqueId("REPLY");
  const subject = conversation.subject.startsWith("Re:")
    ? conversation.subject
    : `Re: ${conversation.subject} [${conversation.conversationId}]`;

  const finalHtml = buildAdminReplyHtml({
    customerName: conversation.customer.name,
    replyBody: replyHtml || `<p>${(replyText || "").replace(/\n/g, "<br>")}</p>`,
    originalSubject: conversation.subject,
    originalMessage: latestInbound?.bodyText || "",
    adminName: adminUser?.name || "Kraviona Support",
  });

  const finalPlainText = `${replyText}\n\n---\nOn ${latestInbound?.createdAt ? new Date(latestInbound.createdAt).toLocaleString() : "earlier"}, ${conversation.customer.name} wrote:\n${latestInbound?.bodyText || ""}`;

  let resendEmailId = null;
  let status = "queued";
  let errorMessage = "";

  if (!isResendReady()) {
    throw new Error(
      "Resend is not configured on the server. Please set RESEND_API_KEY."
    );
  }

  const resend = getResendClient();
  const sendResult = await resend.emails.send({
    from: getSenderIdentity(),
    to: [conversation.customer.email],
    reply_to: getSenderIdentity(),
    subject,
    html: finalHtml,
    text: finalPlainText,
    headers: latestInbound?.messageId
      ? {
          "In-Reply-To": `<${latestInbound.messageId}@kraviona.com>`,
          References: `<${latestInbound.messageId}@kraviona.com>`,
        }
      : undefined,
  });

  if (sendResult?.error) {
    status = "failed";
    errorMessage = sendResult.error.message || "Failed to send email via Resend";
    console.error("Resend sending error:", sendResult.error);
    throw new Error(errorMessage);
  } else if (sendResult?.data?.id) {
    resendEmailId = sendResult.data.id;
    status = "sent";
  }

  // Save outbound message
  const createdReply = await EmailMessage.create({
    messageId,
    conversationId,
    direction: "outbound",
    sender: {
      name: adminUser?.name || "Kraviona Support",
      email: getSenderIdentity(),
    },
    recipient: {
      name: conversation.customer.name,
      email: conversation.customer.email,
    },
    subject,
    bodyText: replyText,
    bodyHtml: sanitizeEmailHtml(replyHtml || `<p>${(replyText || "").replace(/\n/g, "<br>")}</p>`),
    resendEmailId,
    status,
    errorMessage,
    inReplyTo: latestInbound?.messageId || "",
    source: "admin_composer",
    sentBy: adminUser?._id || adminUser?.id || null,
  });

  // Update conversation
  conversation.status = "replied";
  conversation.messageCount = (conversation.messageCount || 0) + 1;
  conversation.lastMessageAt = new Date();
  conversation.latestMessageSnippet = `Reply sent: ${replyText.slice(0, 200)}`;
  await conversation.save();

  // Also update legacy message if linked
  if (conversation.contactMessageId) {
    await MessageModel.findByIdAndUpdate(conversation.contactMessageId, {
      status: "replied",
    });
  }

  return createdReply;
};

/**
 * Super Admin composes a brand new outbound email to any recipient
 */
export const sendAdminComposedEmail = async ({
  to,
  recipientName = "",
  subject,
  bodyText,
  bodyHtml,
  adminUser,
}) => {
  if (!to || !String(to).trim()) {
    throw new Error("Recipient email is required");
  }
  if (!subject || !String(subject).trim()) {
    throw new Error("Subject is required");
  }
  if (!bodyText && !bodyHtml) {
    throw new Error("Email body is required");
  }

  const cleanTo = String(to).trim().toLowerCase();
  const cleanSubject = String(subject).trim();
  const cleanText = String(bodyText || "").trim();
  const cleanHtml = bodyHtml || `<p>${cleanText.replace(/\n/g, "<br>")}</p>`;
  const cleanName = recipientName.trim() || cleanTo.split("@")[0];

  const conversationId = generateUniqueId("CNV");
  const messageId = generateUniqueId("OUT");

  const conversation = await EmailConversation.create({
    conversationId,
    subject: cleanSubject,
    customer: {
      name: cleanName,
      email: cleanTo,
    },
    status: "replied",
    source: "admin_outbound",
    unreadCount: 0,
    messageCount: 1,
    latestMessageSnippet: cleanText.slice(0, 250),
    tags: ["outbound"],
    lastMessageAt: new Date(),
  });

  let resendEmailId = null;
  let status = "queued";
  let errorMessage = "";

  if (!isResendReady()) {
    throw new Error(
      "Resend is not configured on the server. Please set RESEND_API_KEY."
    );
  }

  const resend = getResendClient();
  const sendResult = await resend.emails.send({
    from: getSenderIdentity(),
    to: [cleanTo],
    reply_to: getSenderIdentity(),
    subject: cleanSubject,
    html: cleanHtml,
    text: cleanText,
  });

  if (sendResult?.error) {
    status = "failed";
    errorMessage = sendResult.error.message || "Failed to send email via Resend";
    console.error("Resend sending error:", sendResult.error);
    throw new Error(errorMessage);
  } else if (sendResult?.data?.id) {
    resendEmailId = sendResult.data.id;
    status = "sent";
  }

  const emailMessage = await EmailMessage.create({
    messageId,
    conversationId,
    direction: "outbound",
    sender: {
      name: adminUser?.name || "Kraviona Support",
      email: getSenderIdentity(),
    },
    recipient: {
      name: cleanName,
      email: cleanTo,
    },
    subject: cleanSubject,
    bodyText: cleanText,
    bodyHtml: sanitizeEmailHtml(cleanHtml),
    resendEmailId,
    status,
    errorMessage,
    source: "admin_composer",
    sentBy: adminUser?._id || adminUser?.id || null,
  });

  return { conversation, emailMessage };
};

/**
 * Super Admin retries sending a failed email
 */
export const retryEmailSend = async (emailMessageId, adminUser) => {
  const emailMsg = await EmailMessage.findById(emailMessageId);
  if (!emailMsg) {
    throw new Error("Email message not found");
  }

  if (emailMsg.direction !== "outbound") {
    throw new Error("Only outbound emails can be sent or retried");
  }

  if (!isResendReady()) {
    throw new Error("Resend is not configured on server.");
  }

  const resend = getResendClient();
  const sendResult = await resend.emails.send({
    from: getSenderIdentity(),
    to: [emailMsg.recipient.email],
    reply_to: getSenderIdentity(),
    subject: emailMsg.subject,
    html: emailMsg.bodyHtml || `<p>${emailMsg.bodyText}</p>`,
    text: emailMsg.bodyText,
  });

  if (sendResult?.error) {
    emailMsg.status = "failed";
    emailMsg.errorMessage = sendResult.error.message || "Retry failed";
    emailMsg.retryCount = (emailMsg.retryCount || 0) + 1;
    await emailMsg.save();
    throw new Error(sendResult.error.message);
  }

  emailMsg.resendEmailId = sendResult.data?.id;
  emailMsg.status = "sent";
  emailMsg.errorMessage = "";
  emailMsg.retryCount = (emailMsg.retryCount || 0) + 1;
  await emailMsg.save();

  return emailMsg;
};

/**
 * Process Resend Webhook with signature verification and idempotency
 */
export const processWebhookPayload = async ({ rawBody, headers, parsedBody }) => {
  const webhookSecret = config.RESEND_WEBHOOK_SECRET;

  if (webhookSecret) {
    try {
      const wh = new Webhook(webhookSecret);
      // Svix verification requires payload (Buffer or string) and headers
      wh.verify(rawBody, headers);
    } catch (err) {
      console.error("Resend Webhook signature verification failed:", err.message);
      const error = new Error(`Invalid webhook signature: ${err.message}`);
      error.status = 401;
      throw error;
    }
  } else {
    console.warn(
      "RESEND_WEBHOOK_SECRET is not configured. Webhook processed without cryptographic signature check."
    );
  }

  const payload = parsedBody || {};
  const eventType = payload.type || headers["resend-event-type"] || "unknown";
  const eventId =
    headers["svix-id"] || payload.id || `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Idempotency: Check if this event was already processed (when DB is connected)
  let webhookEvent = null;
  if (mongoose.connection.readyState === 1) {
    const existingEvent = await EmailWebhookEvent.findOne({ eventId });
    if (existingEvent) {
      return {
        status: "duplicate",
        message: "Event already processed",
        eventId,
      };
    }

    // Create event log
    webhookEvent = await EmailWebhookEvent.create({
      eventId,
      eventType,
      status: "processed",
      payload,
      processedAt: new Date(),
    });
  }

  const eventData = payload.data || {};
  const resendEmailId = eventData.email_id || eventData.id;

  try {
    switch (eventType) {
      case "email.received": {
        await handleInboundEmailEvent(eventData);
        break;
      }

      case "email.delivered": {
        if (resendEmailId && mongoose.connection.readyState === 1) {
          const msg = await EmailMessage.findOne({ resendEmailId });
          if (msg) {
            msg.status = "delivered";
            msg.deliveryEvents.push({
              event: "delivered",
              timestamp: new Date(),
              data: eventData,
            });
            await msg.save();
          }
        }
        break;
      }

      case "email.bounced": {
        if (resendEmailId && mongoose.connection.readyState === 1) {
          const msg = await EmailMessage.findOne({ resendEmailId });
          if (msg) {
            msg.status = "bounced";
            msg.errorMessage =
              eventData.bounce?.message || "Email bounced by destination server";
            msg.deliveryEvents.push({
              event: "bounced",
              timestamp: new Date(),
              data: eventData,
            });
            await msg.save();

            // Send failure alert to admin
            try {
              if (isResendReady()) {
                const resend = getResendClient();
                const alertHtml = buildEmailFailureNotificationHtml({
                  messageId: msg.messageId,
                  recipient: msg.recipient.email,
                  subject: msg.subject,
                  errorMessage: msg.errorMessage,
                });
                await resend.emails.send({
                  from: getSenderIdentity(),
                  to: [getAdminNotificationEmail()],
                  subject: `[Alert] Email delivery bounced: ${msg.subject}`,
                  html: alertHtml,
                  text: `Delivery bounced for ${msg.recipient.email}: ${msg.errorMessage}`,
                });
              }
            } catch (alertErr) {
              console.error("Could not send bounce alert to admin:", alertErr.message);
            }
          }
        }
        break;
      }

      case "email.complained": {
        if (resendEmailId && mongoose.connection.readyState === 1) {
          const msg = await EmailMessage.findOne({ resendEmailId });
          if (msg) {
            msg.deliveryEvents.push({
              event: "complained",
              timestamp: new Date(),
              data: eventData,
            });
            await msg.save();
          }
        }
        break;
      }

      case "email.sent": {
        if (resendEmailId && mongoose.connection.readyState === 1) {
          const msg = await EmailMessage.findOne({ resendEmailId });
          if (msg && msg.status === "queued") {
            msg.status = "sent";
            msg.deliveryEvents.push({
              event: "sent",
              timestamp: new Date(),
              data: eventData,
            });
            await msg.save();
          }
        }
        break;
      }

      default:
        console.log(`Unhandled Resend webhook event type: ${eventType}`);
        break;
    }
  } catch (procErr) {
    if (webhookEvent) {
      webhookEvent.status = "failed";
      webhookEvent.error = procErr.message;
      await webhookEvent.save();
    }
    throw procErr;
  }

  return {
    status: "processed",
    eventId,
    eventType,
  };
};

/**
 * Handle genuine inbound email received event from Resend
 */
async function handleInboundEmailEvent(data) {
  const receivingEmailId = data.email_id || data.id;
  let fullEmail = data;

  // Retrieve full email content from Resend Receiving API if available
  if (isResendReady() && receivingEmailId) {
    try {
      const resend = getResendClient();
      if (resend.emails?.receiving?.get) {
        const fullContent = await resend.emails.receiving.get(receivingEmailId);
        if (fullContent?.data) {
          fullEmail = fullContent.data;
        }
      }
    } catch (fetchErr) {
      console.warn(
        `Could not fetch full inbound email body from Resend Receiving API for ${receivingEmailId}:`,
        fetchErr.message
      );
    }
  }

  const senderEmail = (
    fullEmail.from ||
    (Array.isArray(fullEmail.from) ? fullEmail.from[0] : "") ||
    ""
  ).toLowerCase().trim();

  // Extract name and clean email from format "Amar Kumar <amar@example.com>"
  let senderName = "Customer";
  let cleanSenderEmail = senderEmail;

  const emailMatch = senderEmail.match(/<([^>]+)>/);
  if (emailMatch) {
    cleanSenderEmail = emailMatch[1].toLowerCase().trim();
    senderName = senderEmail.replace(/<[^>]+>/, "").trim().replace(/^"|"$/g, "");
  }

  const subject = fullEmail.subject || "(No Subject)";
  const rawHtml = fullEmail.html || "";
  const bodyText = fullEmail.text || "";
  const sanitizedHtml = sanitizeEmailHtml(rawHtml || `<p>${bodyText.replace(/\n/g, "<br>")}</p>`);

  // Detect conversation match via In-Reply-To, References, or Subject matching
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  let matchedConversation = null;
  const inReplyTo = fullEmail.headers?.["in-reply-to"] || fullEmail.in_reply_to || "";

  if (inReplyTo) {
    const parentMsg = await EmailMessage.findOne({
      $or: [
        { messageId: inReplyTo.replace(/[<>]/g, "") },
        { resendEmailId: inReplyTo.replace(/[<>]/g, "") },
      ],
    });
    if (parentMsg) {
      matchedConversation = await EmailConversation.findOne({
        conversationId: parentMsg.conversationId,
      });
    }
  }

  // Try matching by CNV identifier in subject
  if (!matchedConversation) {
    const cnvMatch = subject.match(/\[(CNV-[A-Z0-9-]+)\]/i);
    if (cnvMatch) {
      matchedConversation = await EmailConversation.findOne({
        conversationId: cnvMatch[1].toUpperCase(),
      });
    }
  }

  // Try matching recent open conversation with same customer email
  if (!matchedConversation && cleanSenderEmail) {
    matchedConversation = await EmailConversation.findOne({
      "customer.email": cleanSenderEmail,
      isArchived: false,
    }).sort({ lastMessageAt: -1 });
  }

  const conversationId = matchedConversation
    ? matchedConversation.conversationId
    : generateUniqueId("CNV");
  const messageId = generateUniqueId("IN");

  if (!matchedConversation) {
    matchedConversation = await EmailConversation.create({
      conversationId,
      subject,
      customer: {
        name: senderName || cleanSenderEmail.split("@")[0],
        email: cleanSenderEmail,
      },
      status: "unread",
      source: "direct_inbound",
      unreadCount: 1,
      messageCount: 1,
      latestMessageSnippet: (bodyText || subject).slice(0, 250),
      tags: ["inbound"],
      lastMessageAt: new Date(),
    });
  } else {
    matchedConversation.status = "unread";
    matchedConversation.unreadCount = (matchedConversation.unreadCount || 0) + 1;
    matchedConversation.messageCount = (matchedConversation.messageCount || 0) + 1;
    matchedConversation.lastMessageAt = new Date();
    matchedConversation.latestMessageSnippet = (bodyText || subject).slice(0, 250);
    await matchedConversation.save();
  }

  // Handle attachments safely
  const parsedAttachments = Array.isArray(fullEmail.attachments)
    ? fullEmail.attachments.map((att) => ({
        filename: att.filename || "attachment",
        contentType: att.content_type || "application/octet-stream",
        size: att.size || 0,
        url: att.url || "",
        resendAttachmentId: att.id || "",
      }))
    : [];

  await EmailMessage.create({
    messageId,
    conversationId,
    direction: "inbound",
    sender: {
      name: senderName,
      email: cleanSenderEmail,
    },
    recipient: {
      name: "Kraviona Support",
      email: getSenderIdentity(),
    },
    replyTo: cleanSenderEmail,
    subject,
    bodyText,
    bodyHtml: sanitizedHtml,
    resendEmailId: receivingEmailId,
    status: "received",
    inReplyTo,
    source: "resend_inbound",
    attachments: parsedAttachments,
    headers: fullEmail.headers || {},
  });
}
