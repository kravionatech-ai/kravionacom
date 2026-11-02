import test from "node:test";
import assert from "node:assert/strict";
import { Webhook } from "svix";
import {
  escapeHtml,
  buildContactFormNotificationHtml,
  buildCustomerAcknowledgmentHtml,
  buildAdminReplyHtml,
  buildNewInquiryNotificationHtml,
  buildEmailFailureNotificationHtml,
} from "../src/services/email/emailTemplates.js";
import {
  sanitizeEmailHtml,
  generateUniqueId,
} from "../src/services/email/emailService.js";
import { createFormRateLimiter } from "../src/middleware/rateLimiter.js";

test("escapeHtml safely escapes HTML special characters to prevent injection", () => {
  const unsafe = '<script>alert("XSS & danger")</script>\'test\'';
  const safe = escapeHtml(unsafe);
  assert.equal(safe.includes("<script>"), false);
  assert.equal(safe.includes("&lt;script&gt;"), true);
  assert.equal(safe.includes("&amp;"), true);
  assert.equal(safe.includes("&quot;"), true);
  assert.equal(safe.includes("&#039;"), true);
});

test("buildContactFormNotificationHtml contains Kraviona branding and visitor details", () => {
  const html = buildContactFormNotificationHtml({
    messageId: "MSG-20261024-TEST",
    name: "Amar Kumar",
    email: "amar@example.com",
    phone: "+91 98765 43210",
    subject: "Next.js Architecture Consultation",
    message: "Need help building high performance web application.",
    source: "Website Contact Form",
  });

  assert.equal(html.includes("KRAVIONA"), true);
  assert.equal(html.includes("Amar Kumar"), true);
  assert.equal(html.includes("amar@example.com"), true);
  assert.equal(html.includes("+91 98765 43210"), true);
  assert.equal(html.includes("MSG-20261024-TEST"), true);
  assert.equal(html.includes("View & Reply in Super Admin Panel"), true);
});

test("buildCustomerAcknowledgmentHtml includes reference ID and confirmation", () => {
  const html = buildCustomerAcknowledgmentHtml({
    name: "Amar Kumar",
    messageId: "MSG-ACK-12345",
    subject: "Full-Stack Project",
    message: "Hello team, let's connect.",
  });

  assert.equal(html.includes("Thank You, Amar!"), true);
  assert.equal(html.includes("MSG-ACK-12345"), true);
  assert.equal(html.includes("Book a Free 30-Min Strategy Call"), true);
});

test("buildAdminReplyHtml formats response with original context", () => {
  const html = buildAdminReplyHtml({
    customerName: "Priya Sharma",
    replyBody: "<p>Thank you for reaching out. We can deliver this within 2 weeks.</p>",
    originalSubject: "Timeline inquiry",
    originalMessage: "What is your typical turnaround time?",
    adminName: "Kraviona Technical Support",
  });

  assert.equal(html.includes("Priya Sharma"), true);
  assert.equal(html.includes("Kraviona Technical Support"), true);
  assert.equal(html.includes("What is your typical turnaround time?"), true);
  assert.equal(html.includes("Re: Timeline inquiry"), true);
});

test("buildNewInquiryNotificationHtml formats service lead details", () => {
  const html = buildNewInquiryNotificationHtml({
    inquiryId: "LEAD-101",
    name: "Rohit Verma",
    email: "rohit@acme.com",
    phone: "+91 98111 22334",
    service: "AI Automation",
    budget: "₹1,50,000+",
    company: "Acme Corp",
    message: "Automate lead qualification and sync with CRM.",
    sourceUrl: "https://www.kraviona.com/services/ai-automation",
  });

  assert.equal(html.includes("Rohit Verma"), true);
  assert.equal(html.includes("AI Automation"), true);
  assert.equal(html.includes("Acme Corp"), true);
  assert.equal(html.includes("LEAD-101"), true);
});

test("buildEmailFailureNotificationHtml formats failure alert", () => {
  const html = buildEmailFailureNotificationHtml({
    messageId: "MSG-FAIL-1",
    recipient: "client@nonexistent.domain",
    subject: "Proposal",
    errorMessage: "550 User unknown",
  });

  assert.equal(html.includes("Email Delivery Failed"), true);
  assert.equal(html.includes("client@nonexistent.domain"), true);
  assert.equal(html.includes("550 User unknown"), true);
});

test("sanitizeEmailHtml removes malicious scripts and event handlers while preserving safe tags", () => {
  const malicious = `
    <p>Legitimate paragraph <b>bold</b>.</p>
    <script>alert("hack")</script>
    <img src="https://example.com/logo.png" onload="alert('hack')" />
    <iframe src="http://evil.com"></iframe>
    <a href="javascript:alert(1)">Click here</a>
  `;

  const clean = sanitizeEmailHtml(malicious);
  assert.equal(clean.includes("<script>"), false);
  assert.equal(clean.includes("<iframe>"), false);
  assert.equal(clean.includes("onload"), false);
  assert.equal(clean.includes("javascript:"), false);
  assert.equal(clean.includes("<p>Legitimate paragraph"), true);
  assert.equal(clean.includes("<b>bold</b>"), true);
  assert.equal(clean.includes("https://example.com/logo.png"), true);
});

test("generateUniqueId generates properly prefixed, unique identifiers", () => {
  const id1 = generateUniqueId("MSG");
  const id2 = generateUniqueId("MSG");
  const cnvId = generateUniqueId("CNV");

  assert.equal(id1.startsWith("MSG-"), true);
  assert.equal(cnvId.startsWith("CNV-"), true);
  assert.notEqual(id1, id2);
});

test("createFormRateLimiter catches honeypots and limits rapid repeated submissions", () => {
  const limiter = createFormRateLimiter({
    windowMs: 60000,
    maxSubmissions: 2,
  });

  let honeypotAccepted = false;
  const mockReqHoneypot = {
    body: { _hp: "bot-payload", email: "bot@spam.com" },
    headers: { "x-forwarded-for": "192.168.1.100" },
  };
  const mockResHoneypot = {
    status(code) {
      assert.equal(code, 200);
      return this;
    },
    json(data) {
      honeypotAccepted = data.success === true;
      return this;
    },
  };

  limiter(mockReqHoneypot, mockResHoneypot, () => {});
  assert.equal(honeypotAccepted, true);

  // Normal request 1
  let nextCalls = 0;
  const mockReq1 = {
    body: {},
    headers: { "x-forwarded-for": "10.0.0.5" },
  };
  limiter(mockReq1, {}, () => { nextCalls++; });
  assert.equal(nextCalls, 1);

  // Normal request 2
  limiter(mockReq1, {}, () => { nextCalls++; });
  assert.equal(nextCalls, 2);

  // Normal request 3 (should be rate-limited to HTTP 429)
  let rateLimited = false;
  const mockResBlocked = {
    status(code) {
      if (code === 429) rateLimited = true;
      return this;
    },
    json(data) {
      assert.equal(data.success, false);
      return this;
    },
  };
  limiter(mockReq1, mockResBlocked, () => { nextCalls++; });
  assert.equal(rateLimited, true);
  assert.equal(nextCalls, 2);
});

test("Svix webhook signing and verification mechanism", () => {
  // Generate test Svix secret
  const secret = "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw";
  const wh = new Webhook(secret);

  const payload = JSON.stringify({
    type: "email.delivered",
    created_at: new Date().toISOString(),
    data: {
      email_id: "resend_test_12345",
      to: ["customer@example.com"],
    },
  });

  const msgId = "msg_test_001";
  const timestamp = new Date();
  const signature = wh.sign(msgId, timestamp, payload);

  const headers = {
    "svix-id": msgId,
    "svix-timestamp": Math.floor(timestamp.getTime() / 1000).toString(),
    "svix-signature": signature,
  };

  // Verification succeeds without throwing when signature matches
  assert.doesNotThrow(() => {
    wh.verify(payload, headers);
  });

  // Verification throws when signature or payload is tampered
  assert.throws(() => {
    wh.verify(payload + "tampered", headers);
  });
});
