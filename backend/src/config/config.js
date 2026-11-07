import dotenv from 'dotenv';

dotenv.config({ quiet: true });

const defaultCorsOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://www.kraviona.com",
  "https://kraviona.com",
  "https://admin.kraviona.com",
  "https://superadmin.kraviona.com",
];

const corsOrigins = (process.env.CORS_ORIGINS || defaultCorsOrigins.join(","))
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  DB_NAME: process.env.DB_NAME,

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN:
    process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  APP_NAME: process.env.APP_NAME,
  APP_VERSION: process.env.APP_VERSION,
  NODE_ENV: process.env.NODE_ENV,

  CORS_ORIGINS: corsOrigins,

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,

  WEB_PUSH_VAPID_SUBJECT:
    process.env.WEB_PUSH_VAPID_SUBJECT || "mailto:kravionatech@gmail.com",
  WEB_PUSH_VAPID_PUBLIC_KEY: process.env.WEB_PUSH_VAPID_PUBLIC_KEY,
  WEB_PUSH_VAPID_PRIVATE_KEY: process.env.WEB_PUSH_VAPID_PRIVATE_KEY,

  // Resend Email Settings
  RESEND_API_KEY: process.env.RESEND_API_KEY || "",
  RESEND_WEBHOOK_SECRET: process.env.RESEND_WEBHOOK_SECRET || "",
  RESEND_FROM_EMAIL:
    process.env.RESEND_FROM_EMAIL || "Kraviona Support <support@kraviona.com>",
  ADMIN_NOTIFICATION_EMAIL:
    process.env.ADMIN_NOTIFICATION_EMAIL || "kravionatech@gmail.com",
  APP_BASE_URL: process.env.APP_BASE_URL || "https://www.kraviona.com",
  ADMIN_BASE_URL: process.env.ADMIN_BASE_URL || "https://admin.kraviona.com",
  INBOUND_EMAIL_DOMAIN: process.env.INBOUND_EMAIL_DOMAIN || "kraviona.com",

  // Live Synchronization & Next.js On-Demand Revalidation
  FRONTEND_REVALIDATE_URL: process.env.FRONTEND_REVALIDATE_URL,
  REVALIDATION_SECRET: process.env.REVALIDATION_SECRET || "kraviona_live_sync_secure_token_2026",
};

export default config;
