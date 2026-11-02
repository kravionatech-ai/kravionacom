import test from "node:test";
import assert from "node:assert/strict";
import app from "../src/apps/app.js";
import { Webhook } from "svix";
import config from "../src/config/config.js";

const startTestServer = async (t) => {
  const server = app.listen(0, "127.0.0.1");
  t.after(() => server.close());
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  return `http://127.0.0.1:${port}/api/v1`;
};

test("POST /api/v1/messages returns 400 when required fields are missing", async (t) => {
  const baseUrl = await startTestServer(t);

  const res = await fetch(`${baseUrl}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: "",
      email: "test@example.com",
      message: "Hello world",
    }),
  });

  const data = await res.json();
  assert.equal(res.status, 400);
  assert.equal(data.success, false);
  assert.equal(data.message.includes("First name is required"), true);
});

test("POST /api/v1/messages returns 400 when email format is invalid", async (t) => {
  const baseUrl = await startTestServer(t);

  const res = await fetch(`${baseUrl}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: "Amar",
      email: "invalid-email-address",
      message: "Hello world this is a test message.",
    }),
  });

  const data = await res.json();
  assert.equal(res.status, 400);
  assert.equal(data.success, false);
  assert.equal(data.message.includes("valid email"), true);
});

test("POST /api/v1/messages honeypot trap silently consumes bot submission", async (t) => {
  const baseUrl = await startTestServer(t);

  const res = await fetch(`${baseUrl}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName: "SpamBot",
      email: "spambot@spammer.org",
      message: "Buy cheap backlinks now",
      _hp: "honeypot-triggered",
    }),
  });

  const data = await res.json();
  assert.equal(res.status, 200);
  assert.equal(data.success, true);
});

test("GET /api/v1/emails/conversations rejects unauthenticated access with 401", async (t) => {
  const baseUrl = await startTestServer(t);

  const res = await fetch(`${baseUrl}/emails/conversations`);
  const data = await res.json();

  assert.equal(res.status, 401);
  assert.equal(data.success, false);
});

test("GET /api/v1/emails/stats rejects unauthenticated access with 401", async (t) => {
  const baseUrl = await startTestServer(t);

  const res = await fetch(`${baseUrl}/emails/stats`);
  const data = await res.json();

  assert.equal(res.status, 401);
  assert.equal(data.success, false);
});

test("POST /api/v1/emails/compose rejects unauthenticated access with 401", async (t) => {
  const baseUrl = await startTestServer(t);

  const res = await fetch(`${baseUrl}/emails/compose`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: "client@example.com",
      subject: "Test",
      bodyText: "Test body",
    }),
  });
  const data = await res.json();

  assert.equal(res.status, 401);
  assert.equal(data.success, false);
});

test("POST /api/v1/emails/webhook verifies Svix cryptographic signature and rejects forged payload", async (t) => {
  const baseUrl = await startTestServer(t);

  // Temporarily set a webhook secret for testing
  const originalSecret = config.RESEND_WEBHOOK_SECRET;
  const testSecret = "whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw";
  config.RESEND_WEBHOOK_SECRET = testSecret;

  try {
    const rawPayload = JSON.stringify({
      type: "email.delivered",
      data: { id: "msg_test_delivered" },
    });

    // 1. Unsigned payload should be rejected with 401
    const unsignedRes = await fetch(`${baseUrl}/emails/webhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: rawPayload,
    });
    assert.equal(unsignedRes.status, 401);

    // 2. Properly signed payload with Svix signature headers
    const wh = new Webhook(testSecret);
    const msgId = "msg_svix_test_1";
    const timestamp = new Date();
    const signature = wh.sign(msgId, timestamp, rawPayload);

    const signedRes = await fetch(`${baseUrl}/emails/webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "svix-id": msgId,
        "svix-timestamp": Math.floor(timestamp.getTime() / 1000).toString(),
        "svix-signature": signature,
      },
      body: rawPayload,
    });

    assert.equal(signedRes.status, 200);
    const signedData = await signedRes.json();
    assert.equal(signedData.success, true);
    assert.equal(signedData.eventId, msgId);
  } finally {
    config.RESEND_WEBHOOK_SECRET = originalSecret;
  }
});
