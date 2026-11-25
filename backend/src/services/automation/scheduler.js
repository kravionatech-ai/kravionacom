import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { runAutonomousContentPipeline } from "./pipeline.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCK_FILE = path.resolve(__dirname, "../../../../reports/.automation.lock");

function acquireLock() {
  const dir = path.dirname(LOCK_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(LOCK_FILE)) {
    const lockStats = fs.statSync(LOCK_FILE);
    const lockAgeMs = Date.now() - lockStats.mtimeMs;
    // Expire stale lock if older than 30 minutes
    if (lockAgeMs < 30 * 60 * 1000) {
      return false;
    }
  }

  fs.writeFileSync(LOCK_FILE, JSON.stringify({ pid: process.pid, timestamp: new Date().toISOString() }), "utf8");
  return true;
}

function releaseLock() {
  if (fs.existsSync(LOCK_FILE)) {
    try {
      fs.unlinkSync(LOCK_FILE);
    } catch {}
  }
}

/**
 * Checks whether current day/time in Asia/Kolkata aligns with Tuesday or Friday schedule,
 * or allows explicit manual trigger.
 */
export async function executeScheduledPublication({ force = false } = {}) {
  const now = new Date();
  const istDateString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  const istDate = new Date(istDateString);
  const dayOfWeek = istDate.getDay(); // 0 = Sun, 2 = Tue, 5 = Fri

  const isPublishingDay = (dayOfWeek === 2 || dayOfWeek === 5);

  if (!isPublishingDay && !force) {
    console.log(`[SCHEDULER] Today is not Tuesday or Friday (IST). Skipping automatic publish run.`);
    return { skipped: true, reason: "NOT_SCHEDULED_DAY" };
  }

  if (!acquireLock()) {
    console.warn(`[SCHEDULER] Another automation job is currently running or locked.`);
    return { skipped: true, reason: "LOCKED" };
  }

  try {
    const result = await runAutonomousContentPipeline({ dryRun: false });
    return result;
  } finally {
    releaseLock();
  }
}

// Export for direct CLI invocation
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  executeScheduledPublication({ force: true })
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Automation error:", err);
      process.exit(1);
    });
}
