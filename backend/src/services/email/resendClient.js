import { Resend } from "resend";
import config from "../../config/config.js";

let resendInstance = null;

export const getResendClient = () => {
  if (!config.RESEND_API_KEY) {
    return null;
  }

  if (!resendInstance) {
    resendInstance = new Resend(config.RESEND_API_KEY);
  }

  return resendInstance;
};

export const isResendReady = () => {
  return Boolean(config.RESEND_API_KEY && config.RESEND_API_KEY.trim().length > 0);
};

export const getSenderIdentity = () => {
  return config.RESEND_FROM_EMAIL || "Kraviona Support <support@kraviona.com>";
};

export const getAdminNotificationEmail = () => {
  return config.ADMIN_NOTIFICATION_EMAIL || "kravionatech@gmail.com";
};
