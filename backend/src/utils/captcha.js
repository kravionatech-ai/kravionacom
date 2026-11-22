import crypto from "crypto";
import config from "../config/config.js";

const SECRET = config.JWT_SECRET || "kraviona-captcha-security-salt-2025";
const CAPTCHA_TTL_MS = 10 * 60 * 1000; // 10 minutes valid

/**
 * Generates an SVG mathematical or text security challenge with an HMAC-signed token.
 * 100% self-hosted, offline-compatible, and zero external dependency.
 */
export function generateCaptcha() {
  const num1 = Math.floor(Math.random() * 35) + 10; // 10 - 44
  const num2 = Math.floor(Math.random() * 15) + 1;  // 1 - 15
  const isAdd = Math.random() > 0.25; // 75% addition, 25% subtraction

  const question = isAdd ? `${num1} + ${num2}` : `${num1} - ${num2}`;
  const answer = String(isAdd ? num1 + num2 : num1 - num2);

  const timestamp = Date.now();
  const salt = crypto.randomBytes(8).toString("hex");

  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(`${answer.toLowerCase().trim()}:${timestamp}:${salt}`)
    .digest("hex");

  const token = `${timestamp}.${salt}.${signature}`;

  // Dimensions & anti-bot noise
  const width = 160;
  const height = 46;

  const lines = Array.from({ length: 4 })
    .map(() => {
      const x1 = Math.floor(Math.random() * width);
      const y1 = Math.floor(Math.random() * height);
      const x2 = Math.floor(Math.random() * width);
      const y2 = Math.floor(Math.random() * height);
      const strokes = ["#0f5960", "#e8622a", "#5c9baa", "#b84a1a", "#0d9488"];
      const stroke = strokes[Math.floor(Math.random() * strokes.length)];
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="1.5" opacity="0.45" />`;
    })
    .join("");

  const dots = Array.from({ length: 22 })
    .map(() => {
      const cx = Math.floor(Math.random() * width);
      const cy = Math.floor(Math.random() * height);
      const r = (Math.random() * 1.5 + 0.6).toFixed(1);
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#0f5960" opacity="0.3" />`;
    })
    .join("");

  const tilt = (Math.random() * 4 - 2).toFixed(1);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="border-radius: 10px; background: linear-gradient(135deg, #f0fdfa, #fff7ed); border: 1.5px solid #cbd5e1; user-select: none;">
    ${lines}
    ${dots}
    <text x="50%" y="56%" dominant-baseline="middle" text-anchor="middle" font-family="'Courier New', Courier, monospace" font-size="21" font-weight="900" fill="#0f5960" letter-spacing="3" transform="rotate(${tilt}, ${width / 2}, ${height / 2})">${question} = ?</text>
  </svg>`;

  return {
    token,
    svg,
    question: `${question} = ?`,
  };
}

/**
 * Validates the user answer against the HMAC-signed token.
 */
export function verifyCaptcha(token, userAnswer) {
  if (!token || !userAnswer) return false;

  const parts = String(token).split(".");
  if (parts.length !== 3) return false;

  const [timestampStr, salt, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);

  if (isNaN(timestamp)) return false;
  if (Date.now() - timestamp > CAPTCHA_TTL_MS) return false; // Expired

  const normalizedAnswer = String(userAnswer).toLowerCase().trim();

  const expectedSig = crypto
    .createHmac("sha256", SECRET)
    .update(`${normalizedAnswer}:${timestamp}:${salt}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSig, "hex")
    );
  } catch {
    return false;
  }
}
