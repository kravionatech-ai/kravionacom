import crypto from "crypto";
import config from "../config/config.js";

const SECRET = config.JWT_SECRET || "kraviona-captcha-security-salt-2025";
const CAPTCHA_TTL_MS = 10 * 60 * 1000; // 10 minutes valid

// Unambiguous character set (omits 0, O, o, 1, I, l to avoid human frustration)
const CHAR_POOL = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz";
const PALETTE = ["#0f5960", "#b84a1a", "#1e293b", "#0369a1", "#c2410c", "#047857", "#4338ca", "#0e7490"];
const FONTS = [
  "Impact, sans-serif",
  "Georgia, serif",
  "Arial Black, sans-serif",
  "'Trebuchet MS', sans-serif",
  "'Courier New', monospace",
  "Verdana, sans-serif",
];

/**
 * Generates a hardened, anti-bot, anti-OCR visual alphanumeric security challenge
 * with Bezier wave distortion, strike lines, and HMAC-signed verification token.
 */
export function generateCaptcha() {
  let answer = "";
  for (let i = 0; i < 6; i++) {
    answer += CHAR_POOL.charAt(Math.floor(Math.random() * CHAR_POOL.length));
  }

  const timestamp = Date.now();
  const salt = crypto.randomBytes(8).toString("hex");

  const signature = crypto
    .createHmac("sha256", SECRET)
    .update(`${answer.toLowerCase().trim()}:${timestamp}:${salt}`)
    .digest("hex");

  const token = `${timestamp}.${salt}.${signature}`;

  const width = 196;
  const height = 52;

  // Bezier wave lines passing across and through characters (anti-OCR)
  const waveY1 = Math.floor(Math.random() * 20) + 16;
  const waveY2 = Math.floor(Math.random() * 20) + 16;
  const ctrlX1 = Math.floor(Math.random() * 50) + 35;
  const ctrlY1 = Math.floor(Math.random() * 32) + 8;
  const ctrlX2 = Math.floor(Math.random() * 50) + 110;
  const ctrlY2 = Math.floor(Math.random() * 32) + 12;

  const wavePath1 = `<path d="M 0 ${waveY1} C ${ctrlX1} ${ctrlY1}, ${ctrlX2} ${ctrlY2}, ${width} ${waveY2}" stroke="#0f5960" stroke-width="2" fill="none" opacity="0.65" />`;
  const wavePath2 = `<path d="M 0 ${height - waveY1} C ${ctrlX2} ${ctrlY2}, ${ctrlX1} ${ctrlY1}, ${width} ${height - waveY2}" stroke="#b84a1a" stroke-width="2.2" fill="none" opacity="0.75" />`;

  // Random noise lines
  const lines = Array.from({ length: 9 })
    .map(() => {
      const x1 = Math.floor(Math.random() * width);
      const y1 = Math.floor(Math.random() * height);
      const x2 = Math.floor(Math.random() * width);
      const y2 = Math.floor(Math.random() * height);
      const stroke = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="1.3" opacity="0.45" />`;
    })
    .join("");

  // Random dots and rings
  const dots = Array.from({ length: 42 })
    .map(() => {
      const cx = Math.floor(Math.random() * width);
      const cy = Math.floor(Math.random() * height);
      const r = (Math.random() * 1.5 + 0.6).toFixed(1);
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${color}" opacity="0.35" />`;
    })
    .join("");

  // Render each character individually with unique rotation, font, size, and vertical offset
  const charSlotWidth = (width - 32) / 6;
  const chars = answer
    .split("")
    .map((ch, idx) => {
      const x = Math.floor(20 + idx * charSlotWidth + (Math.random() * 4 - 2));
      const y = Math.floor(height / 2 + 8 + (Math.random() * 8 - 4));
      const rot = Math.floor(Math.random() * 40 - 20); // -20deg to +20deg
      const fontSize = Math.floor(Math.random() * 7) + 24; // 24px - 30px
      const font = FONTS[Math.floor(Math.random() * FONTS.length)];
      const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      return `<text x="${x}" y="${y}" font-family="${font}" font-size="${fontSize}" font-weight="900" fill="${color}" transform="rotate(${rot}, ${x}, ${y})" text-anchor="middle" letter-spacing="1">${ch}</text>`;
    })
    .join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="border-radius: 12px; background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 40%, #fef3c7 75%, #f8fafc 100%); border: 1.5px solid #94a3b8; user-select: none; box-shadow: inset 0 2px 4px rgba(0,0,0,0.06);">
    ${dots}
    ${lines}
    ${wavePath1}
    ${chars}
    ${wavePath2}
  </svg>`;

  return {
    token,
    svg,
    question: "6-Character Security Code",
  };
}

/**
 * Validates the user answer against the HMAC-signed token. Case-insensitive.
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
