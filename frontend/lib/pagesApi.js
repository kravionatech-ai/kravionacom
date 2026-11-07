import { API_URL } from "@/utils/api";

/**
 * Fetches dynamic page content and SEO metadata from MongoDB.
 * Implements Next.js App Router on-demand revalidation tags.
 * Falls back gracefully to null if API is unreachable or page is in draft.
 *
 * @param {string} slug - Page slug (e.g. 'home', 'about', 'contact', 'privacy-policy', 'terms')
 * @returns {Promise<any | null>}
 */
export async function getDynamicPage(slug) {
  const cleanSlug = String(slug || "").toLowerCase().trim();
  if (!cleanSlug) return null;

  try {
    const res = await fetch(`${API_URL}/pages/${encodeURIComponent(cleanSlug)}`, {
      next: {
        revalidate: 3600,
        tags: ["pages", `page-${cleanSlug}`],
      },
      headers: {
        Accept: "application/json",
      },
    });

    if (res.status === 404) return null;
    if (!res.ok) return null;

    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.warn(`[DYNAMIC_PAGE_FETCH_WARN] Unable to fetch page '${cleanSlug}':`, error?.message);
    return null;
  }
}
