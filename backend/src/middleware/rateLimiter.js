/**
 * Sliding window in-memory rate limiter for public forms.
 * Prevents spam flooding and denial-of-service abuse.
 */

const ipSubmissionHistory = new Map();

// Default cleanup interval: every 10 minutes, sweep expired entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, records] of ipSubmissionHistory.entries()) {
    const valid = records.filter((timestamp) => now - timestamp < 15 * 60 * 1000);
    if (valid.length === 0) {
      ipSubmissionHistory.delete(ip);
    } else {
      ipSubmissionHistory.set(ip, valid);
    }
  }
}, 10 * 60 * 1000).unref();

export const createFormRateLimiter = ({
  windowMs = 10 * 60 * 1000, // 10 minutes
  maxSubmissions = 5,
  message = "Too many requests from this IP. Please wait a few minutes before trying again.",
} = {}) => {
  return (req, res, next) => {
    // Honeypot spam detection
    if (req.body?._hp || req.body?.botField) {
      return res.status(200).json({
        success: true,
        message: "Message received successfully.",
      });
    }

    const forwarded = req.headers["x-forwarded-for"];
    const clientIp = forwarded
      ? String(forwarded).split(",")[0].trim()
      : req.ip || req.socket.remoteAddress || "unknown-ip";

    const now = Date.now();
    const timestamps = (ipSubmissionHistory.get(clientIp) || []).filter(
      (time) => now - time < windowMs
    );

    if (timestamps.length >= maxSubmissions) {
      const waitSeconds = Math.ceil(
        (windowMs - (now - timestamps[0])) / 1000
      );
      return res.status(429).json({
        success: false,
        message: `${message} (Retry after ${Math.max(waitSeconds, 1)}s)`,
        retryAfter: Math.max(waitSeconds, 1),
      });
    }

    timestamps.push(now);
    ipSubmissionHistory.set(clientIp, timestamps);
    next();
  };
};

export const formRateLimiter = createFormRateLimiter();
