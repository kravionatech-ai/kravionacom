import { verifyCaptcha } from "../utils/captcha.js";

/**
 * Middleware that strictly verifies anti-bot CAPTCHA challenges before allowing
 * form submissions or login requests to proceed.
 */
export const requireCaptcha = (req, res, next) => {
  if (process.env.NODE_ENV === "test" && req.headers["x-test-bypass-captcha"] === "true") {
    return next();
  }

  const token = req.body?.captchaToken || req.headers["x-captcha-token"];
  const answer = req.body?.captchaAnswer || req.headers["x-captcha-answer"];

  if (!token || !answer) {
    return res.status(400).json({
      success: false,
      message: "Security verification is required. Please solve the CAPTCHA challenge before submitting.",
      code: "CAPTCHA_REQUIRED",
    });
  }

  const isValid = verifyCaptcha(token, answer);
  if (!isValid) {
    return res.status(400).json({
      success: false,
      message: "Incorrect or expired CAPTCHA answer. Please refresh and try again.",
      code: "CAPTCHA_INVALID",
    });
  }

  next();
};
