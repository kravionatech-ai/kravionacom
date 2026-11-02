import config from "../../config/config.js";

/**
 * Escapes untrusted text to safely render inside HTML email templates.
 */
export function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function baseLayout({ title, previewText, contentHtml, footerCta = "" }) {
  const adminUrl = config.ADMIN_BASE_URL || "https://admin.kraviona.com";
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #1e293b;
      -webkit-font-smoothing: antialiased;
    }
    table { border-collapse: collapse; }
    img { border: 0; display: block; }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 14px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 16px rgba(18, 63, 70, 0.06);
    }
    .header {
      background: linear-gradient(135deg, #123f46 0%, #1d555e 100%);
      padding: 32px 36px;
      text-align: left;
    }
    .header-logo {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: -0.5px;
      margin: 0;
      text-decoration: none;
    }
    .header-tagline {
      font-size: 11px;
      color: #f7c56d;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-top: 4px;
      font-weight: 700;
    }
    .content {
      padding: 36px;
      line-height: 1.6;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .badge-primary {
      background-color: #f0fdfa;
      color: #0f766e;
      border: 1px solid #ccfbf1;
    }
    .badge-lead {
      background-color: #fff7ed;
      color: #c2410c;
      border: 1px solid #ffedd5;
    }
    .data-table {
      width: 100%;
      margin: 20px 0;
      background-color: #f8fafc;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
    }
    .data-table td {
      padding: 12px 16px;
      font-size: 14px;
      border-bottom: 1px solid #e2e8f0;
    }
    .data-table tr:last-child td {
      border-bottom: none;
    }
    .data-label {
      color: #64748b;
      font-weight: 600;
      width: 120px;
    }
    .data-value {
      color: #0f172a;
      font-weight: 500;
    }
    .message-box {
      background-color: #ffffff;
      border-left: 4px solid #d26c51;
      padding: 16px 20px;
      margin: 24px 0;
      border-radius: 0 8px 8px 0;
      border-top: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      font-size: 14px;
      color: #334155;
      white-space: pre-wrap;
    }
    .btn {
      display: inline-block;
      background: #d26c51;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 0.3px;
      text-align: center;
      transition: background 0.2s;
    }
    .footer {
      background-color: #f8fafc;
      padding: 24px 36px;
      border-top: 1px solid #e2e8f0;
      font-size: 12px;
      color: #64748b;
      line-height: 1.5;
    }
    .footer a {
      color: #0f766e;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .content, .header, .footer { padding: 20px !important; }
      .data-table td { display: block; width: auto; }
      .data-label { padding-bottom: 2px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 24px 10px; background-color: #f4f6f8;">
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${escapeHtml(previewText)}
  </div>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <div class="container">
          <div class="header">
            <h1 class="header-logo">KRAVIONA</h1>
            <p class="header-tagline">Vision Innovative Development</p>
          </div>
          <div class="content">
            ${contentHtml}
          </div>
          <div class="footer">
            <p style="margin: 0 0 8px 0;">
              © ${currentYear} Kraviona Tech Solutions. All rights reserved.
            </p>
            <p style="margin: 0;">
              New Delhi, India · <a href="https://www.kraviona.com">kraviona.com</a> · Support: <a href="mailto:support@kraviona.com">support@kraviona.com</a>
            </p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 1. Admin Notification: New Contact Form Message
 */
export function buildContactFormNotificationHtml({
  messageId,
  name,
  email,
  phone,
  subject,
  message,
  source = "Website Contact Form",
  createdAt = new Date(),
}) {
  const adminUrl = config.ADMIN_BASE_URL || "https://admin.kraviona.com";
  const viewUrl = `${adminUrl}/messages?selected=${encodeURIComponent(messageId)}`;
  const dateFormatted = new Date(createdAt).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const contentHtml = `
    <div style="margin-bottom: 20px;">
      <span class="badge badge-primary">New Contact Form Message</span>
      <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 12px 0 6px 0;">
        ${escapeHtml(subject || "New Customer Message")}
      </h2>
      <p style="font-size: 13px; color: #64748b; margin: 0;">
        Message ID: <strong style="font-family: monospace; color: #0f172a;">${escapeHtml(messageId)}</strong>
      </p>
    </div>

    <table class="data-table" cellpadding="0" cellspacing="0">
      <tr>
        <td class="data-label">From:</td>
        <td class="data-value">${escapeHtml(name)}</td>
      </tr>
      <tr>
        <td class="data-label">Email:</td>
        <td class="data-value">
          <a href="mailto:${escapeHtml(email)}" style="color: #0f766e; text-decoration: none; font-weight: 600;">
            ${escapeHtml(email)}
          </a>
        </td>
      </tr>
      <tr>
        <td class="data-label">Phone:</td>
        <td class="data-value">${phone ? escapeHtml(phone) : "<em>Not provided</em>"}</td>
      </tr>
      <tr>
        <td class="data-label">Source:</td>
        <td class="data-value">${escapeHtml(source)}</td>
      </tr>
      <tr>
        <td class="data-label">Received:</td>
        <td class="data-value">${dateFormatted} (IST)</td>
      </tr>
    </table>

    <div style="margin-top: 24px;">
      <p style="font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">
        Message Content:
      </p>
      <div class="message-box">${escapeHtml(message)}</div>
    </div>

    <div style="margin-top: 32px; text-align: center;">
      <a href="${viewUrl}" class="btn">
        View & Reply in Super Admin Panel &rarr;
      </a>
      <p style="font-size: 12px; color: #94a3b8; margin-top: 12px;">
        You can also reply directly to this email to respond to the visitor.
      </p>
    </div>
  `;

  return baseLayout({
    title: `[New Inquiry] ${subject || "Contact form submission"} - ${name}`,
    previewText: `New contact submission from ${name}: "${(message || "").slice(0, 80)}..."`,
    contentHtml,
  });
}

/**
 * 2. Customer Acknowledgment: Sent to visitor confirming receipt
 */
export function buildCustomerAcknowledgmentHtml({
  name,
  messageId,
  subject,
  message,
}) {
  const firstName = (name || "there").split(" ")[0];

  const contentHtml = `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">
        Thank You, ${escapeHtml(firstName)}!
      </h2>
      <p style="font-size: 15px; color: #334155; margin: 0 0 16px 0; line-height: 1.6;">
        We have received your message regarding <strong>${escapeHtml(subject || "your requirement")}</strong>. Our team is reviewing the details and will get back to you with the most practical next steps within 1 business day.
      </p>
      <p style="font-size: 13px; color: #64748b; margin: 0;">
        Your reference ID: <strong style="font-family: monospace; color: #0f172a;">${escapeHtml(messageId)}</strong>
      </p>
    </div>

    <div style="background-color: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0; padding: 18px 20px; margin: 24px 0;">
      <p style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin: 0 0 8px 0;">
        Summary of your message:
      </p>
      <p style="font-size: 14px; color: #334155; margin: 0; white-space: pre-wrap; font-style: italic;">
        "${escapeHtml(message)}"
      </p>
    </div>

    <div style="margin-top: 28px; border-top: 1px solid #e2e8f0; padding-top: 20px;">
      <p style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">
        Need immediate consultation?
      </p>
      <p style="font-size: 13px; color: #64748b; margin: 0 0 14px 0;">
        You can also schedule a direct 30-minute strategy call with our engineering team:
      </p>
      <a href="https://calendly.com/kravionatech" class="btn" style="background-color: #123f46;">
        Book a Free 30-Min Strategy Call
      </a>
    </div>
  `;

  return baseLayout({
    title: `We've received your message - Kraviona Tech Solutions`,
    previewText: `Thank you for reaching out to Kraviona. We have received your inquiry (Ref: ${messageId}).`,
    contentHtml,
  });
}

/**
 * 3. Admin Outbound Reply: Sent to customer from Super Admin
 */
export function buildAdminReplyHtml({
  customerName,
  replyBody,
  originalSubject,
  originalMessage,
  adminName = "Kraviona Support Team",
}) {
  const contentHtml = `
    <div style="margin-bottom: 24px;">
      <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0;">
        Re: ${escapeHtml(originalSubject || "Inquiry")}
      </h2>
      <p style="font-size: 15px; color: #334155; margin: 0 0 20px 0;">
        Hello ${escapeHtml(customerName || "there")},
      </p>
      <div style="font-size: 15px; line-height: 1.7; color: #1e293b; margin-bottom: 24px;">
        ${replyBody}
      </div>
      <p style="font-size: 14px; color: #475569; margin: 24px 0 0 0;">
        Warm regards,<br>
        <strong>${escapeHtml(adminName)}</strong><br>
        <span style="font-size: 13px; color: #64748b;">Kraviona Tech Solutions</span>
      </p>
    </div>

    ${
      originalMessage
        ? `<div style="margin-top: 32px; border-top: 1px dashed #cbd5e1; padding-top: 20px;">
            <p style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin: 0 0 8px 0;">
              Original Message:
            </p>
            <div style="background-color: #f8fafc; border-left: 3px solid #cbd5e1; padding: 12px 16px; font-size: 13px; color: #64748b; font-style: italic;">
              ${escapeHtml(originalMessage)}
            </div>
          </div>`
        : ""
    }
  `;

  return baseLayout({
    title: `Re: ${originalSubject || "Inquiry with Kraviona"}`,
    previewText: `Response from Kraviona Support regarding ${originalSubject || "your inquiry"}.`,
    contentHtml,
  });
}

/**
 * 4. New Service Lead / Inquiry Notification: Sent to admin
 */
export function buildNewInquiryNotificationHtml({
  inquiryId,
  name,
  email,
  phone,
  service,
  budget,
  company,
  message,
  sourceUrl,
}) {
  const adminUrl = config.ADMIN_BASE_URL || "https://admin.kraviona.com";
  const viewUrl = `${adminUrl}/leads`;

  const contentHtml = `
    <div style="margin-bottom: 20px;">
      <span class="badge badge-lead">High Intent Service Lead</span>
      <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 12px 0 6px 0;">
        ${escapeHtml(service || "Service Inquiry")}
      </h2>
      <p style="font-size: 13px; color: #64748b; margin: 0;">
        Inquiry Ref: <strong style="font-family: monospace; color: #0f172a;">${escapeHtml(inquiryId)}</strong>
      </p>
    </div>

    <table class="data-table" cellpadding="0" cellspacing="0">
      <tr>
        <td class="data-label">Prospect:</td>
        <td class="data-value">${escapeHtml(name)}</td>
      </tr>
      <tr>
        <td class="data-label">Email:</td>
        <td class="data-value">
          <a href="mailto:${escapeHtml(email)}" style="color: #0f766e; text-decoration: none; font-weight: 600;">
            ${escapeHtml(email)}
          </a>
        </td>
      </tr>
      <tr>
        <td class="data-label">Phone:</td>
        <td class="data-value">${phone ? escapeHtml(phone) : "<em>Not provided</em>"}</td>
      </tr>
      <tr>
        <td class="data-label">Service:</td>
        <td class="data-value"><strong>${escapeHtml(service || "General")}</strong></td>
      </tr>
      <tr>
        <td class="data-label">Budget:</td>
        <td class="data-value">${escapeHtml(budget || "Not specified")}</td>
      </tr>
      ${
        company
          ? `<tr>
              <td class="data-label">Company:</td>
              <td class="data-value">${escapeHtml(company)}</td>
            </tr>`
          : ""
      }
      ${
        sourceUrl
          ? `<tr>
              <td class="data-label">Page:</td>
              <td class="data-value"><a href="${escapeHtml(sourceUrl)}" style="color: #64748b; font-size: 12px;">${escapeHtml(sourceUrl)}</a></td>
            </tr>`
          : ""
      }
    </table>

    <div style="margin-top: 24px;">
      <p style="font-size: 13px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 8px 0;">
        Requirements & Scope:
      </p>
      <div class="message-box" style="border-left-color: #f97316;">${escapeHtml(message)}</div>
    </div>

    <div style="margin-top: 32px; text-align: center;">
      <a href="${viewUrl}" class="btn" style="background: #f97316;">
        Manage in Leads Dashboard &rarr;
      </a>
    </div>
  `;

  return baseLayout({
    title: `[New Lead] ${service || "Service Lead"} - ${name}`,
    previewText: `New lead from ${name} for ${service}: Budget: ${budget}`,
    contentHtml,
  });
}

/**
 * 5. Email Failure Alert: Sent to administrator when email delivery fails
 */
export function buildEmailFailureNotificationHtml({
  messageId,
  recipient,
  subject,
  errorMessage,
  failedAt = new Date(),
}) {
  const adminUrl = config.ADMIN_BASE_URL || "https://admin.kraviona.com";
  const retryUrl = `${adminUrl}/messages?tab=failed`;

  const contentHtml = `
    <div style="margin-bottom: 20px;">
      <span class="badge" style="background-color: #fef2f2; color: #b91c1c; border: 1px solid #fee2e2;">Delivery Failure Alert</span>
      <h2 style="font-size: 20px; font-weight: 800; color: #991b1b; margin: 12px 0 6px 0;">
        Email Delivery Failed
      </h2>
      <p style="font-size: 13px; color: #64748b; margin: 0;">
        Message ID: <strong style="font-family: monospace; color: #0f172a;">${escapeHtml(messageId)}</strong>
      </p>
    </div>

    <table class="data-table" cellpadding="0" cellspacing="0">
      <tr>
        <td class="data-label">Recipient:</td>
        <td class="data-value"><strong>${escapeHtml(recipient)}</strong></td>
      </tr>
      <tr>
        <td class="data-label">Subject:</td>
        <td class="data-value">${escapeHtml(subject)}</td>
      </tr>
      <tr>
        <td class="data-label">Error Reason:</td>
        <td class="data-value" style="color: #b91c1c;">${escapeHtml(errorMessage || "Rejected by mail server / Resend API")}</td>
      </tr>
      <tr>
        <td class="data-label">Time:</td>
        <td class="data-value">${new Date(failedAt).toISOString()}</td>
      </tr>
    </table>

    <div style="margin-top: 28px; text-align: center;">
      <a href="${retryUrl}" class="btn" style="background: #ef4444;">
        Review in Admin Panel &rarr;
      </a>
    </div>
  `;

  return baseLayout({
    title: `[Alert] Outbound Email Failed: ${subject}`,
    previewText: `Outbound email to ${recipient} failed: ${errorMessage}`,
    contentHtml,
  });
}
