import config from "../config/config.js";

/**
 * Dispatches an on-demand cache revalidation call to the Next.js frontend.
 * This purges the server-side Data Cache and Full Route Cache instantly
 * so the client website reflects database mutations immediately.
 *
 * @param {Object} options
 * @param {string[]} [options.paths] - Specific route paths to purge (e.g. ['/services/ai-automation', '/services'])
 * @param {string[]} [options.tags] - Cache tags to invalidate (e.g. ['services', 'service-ai-automation'])
 * @returns {Promise<{ success: boolean, data?: any, error?: string }>}
 */
export async function revalidateFrontend({ paths = [], tags = [] }) {
  if (!paths.length && !tags.length) {
    return { success: true, message: "No paths or tags provided for revalidation." };
  }

  // Determine target frontend revalidation URL:
  // In development, fallback to local frontend port (3000 or 3010)
  const isDev = config.NODE_ENV === "development";
  const defaultUrl = isDev ? "http://127.0.0.1:3010/api/revalidate" : "https://www.kraviona.com/api/revalidate";
  const targetUrl = config.FRONTEND_REVALIDATE_URL || defaultUrl;
  const secret = config.REVALIDATION_SECRET || "kraviona_live_sync_secure_token_2026";

  try {
    const payload = {
      secret,
      paths: Array.isArray(paths) ? paths : [paths],
      tags: Array.isArray(tags) ? tags : [tags],
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000); // 4-second timeout to not block API response

    const response = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-secret": secret,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[REVALIDATE_FRONTEND_WARN] Status ${response.status} from ${targetUrl}: ${errText}`);
      return { success: false, error: `Frontend responded with status ${response.status}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    // Non-blocking: log warning so database operation still succeeds
    console.warn(`[REVALIDATE_FRONTEND_NETWORK_WARN] Unable to reach ${targetUrl}: ${error?.message}`);
    return { success: false, error: error?.message };
  }
}
