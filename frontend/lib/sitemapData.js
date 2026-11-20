import { API_URL } from "@/utils/api";
import { canonicalUrl } from "@/app/seoConfig.js";
import { SERVICE_LINKS } from "@/app/services/serviceData.js";

export const BASE_URL = "https://www.kraviona.com";

export const EXCLUDED_SLUGS = [
  "bGF0ZXN0LW",
  "ai-news-august-2026",
  "what-is-mern-stack-the-complete-2026-guide-for-developers",
  "what-is-mern-stack-the-complete-2026-guide-for-developer",
  "complete-guide-for-developers",
  "complete-guide-for-developer",
  "why-choosing-a-top-mern-stack-development-company-in-india-changes-the-game",
  "mern-stack-development-company-delhi",
  "mern-stack-development-company-in-india",
  "mern-stack-development-company-india",
  "technical-seo-agency-delhi",
  "best-ai-automation-company-in-delhi-how-businesses-are-growing-smarter-in-2025",
  "best-ai-automation-company-in-delhi-ncr-india-in-2025",
  "reactjs-development-company-india",
  "website-development-company-in-delhi",
];

const POSTS_FETCH_LIMIT = 100;
const MAX_POST_PAGES = 50;
const RECENT_POST_UPDATE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;
const DEFAULT_STATIC_LASTMOD = "2026-10-01T00:00:00.000Z";

export const coreStaticPages = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "weekly", priority: 0.95 },
  { path: "/solutions", changeFrequency: "monthly", priority: 0.9 },
  { path: "/blog", changeFrequency: "daily", priority: 0.85 },
  { path: "/news", changeFrequency: "hourly", priority: 0.9 },
  { path: "/case-studies", changeFrequency: "monthly", priority: 0.86 },
  { path: "/careers", changeFrequency: "weekly", priority: 0.86 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/team", changeFrequency: "monthly", priority: 0.75 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.75 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/category", changeFrequency: "weekly", priority: 0.7 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.5 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.5 },
];

export const serviceCategoryHubs = [
  { path: "/services/web-development", changeFrequency: "monthly", priority: 0.92 },
  { path: "/services/backend-architecture", changeFrequency: "monthly", priority: 0.92 },
  { path: "/services/performance-ai", changeFrequency: "monthly", priority: 0.92 },
  { path: "/services/branding-marketing", changeFrequency: "monthly", priority: 0.92 },
  { path: "/services/marketplace-seller", changeFrequency: "monthly", priority: 0.92 },
];

export function escapeXml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const parseCollection = (json) =>
  Array.isArray(json?.posts)
    ? json.posts
    : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];

export const getValidIsoDate = (value) => {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export const getNewestIsoDate = (...values) => {
  const dates = values
    .map(getValidIsoDate)
    .filter(Boolean)
    .map((val) => new Date(val));

  if (!dates.length) return null;
  return new Date(Math.max(...dates.map((d) => d.getTime()))).toISOString();
};

export const getBlogChangeFrequency = (lastModified) => {
  const validLastModified = getValidIsoDate(lastModified);
  if (!validLastModified) return "monthly";
  const age = Date.now() - new Date(validLastModified).getTime();
  return age >= 0 && age <= RECENT_POST_UPDATE_WINDOW_MS ? "weekly" : "monthly";
};

export const createRoute = ({ path, lastModified, changeFrequency, priority, images, title }) => {
  const validLastModified = getValidIsoDate(lastModified) || DEFAULT_STATIC_LASTMOD;
  const route = {
    url: canonicalUrl(path),
    lastModified: validLastModified,
  };
  if (changeFrequency) route.changeFrequency = changeFrequency;
  if (priority !== undefined) route.priority = priority;
  if (Array.isArray(images) && images.length) route.images = images.filter(Boolean);
  if (title) route.title = title;
  return route;
};

const PRODUCTION_API_URL = "https://api.kraviona.com/api/v1";

export async function fetchJson(path) {
  const urlsToTry = [`${API_URL}${path}`];
  if (API_URL !== PRODUCTION_API_URL) {
    urlsToTry.push(`${PRODUCTION_API_URL}${path}`);
  }

  for (const url of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      // Try next candidate or fail gracefully
    }
  }

  console.error(`[SITEMAP_FETCH_ERROR] All candidate endpoints failed for ${path}`);
  return {};
}

export async function getPublishedPosts(contentType) {
  const posts = [];
  let page = 1;
  let hasNextPage = true;

  try {
    while (hasNextPage && page <= MAX_POST_PAGES) {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(POSTS_FETCH_LIMIT),
      });
      if (contentType) params.set("contentType", contentType);
      const json = await fetchJson(`/public/posts?${params.toString()}`);
      const list = parseCollection(json);
      posts.push(...list);

      hasNextPage = Boolean(json?.pagination?.hasNextPage);
      page += 1;
      if (!list.length) break;
    }
  } catch (error) {
    console.error(`[SITEMAP_POSTS_ERROR:${contentType || "all"}]`, error?.message);
  }

  return posts.filter(
    (post) => post?.slug && !post?.isNoIndex && !EXCLUDED_SLUGS.includes(post.slug)
  );
}

export async function getPublishedCategories() {
  try {
    const json = await fetchJson("/categories");
    return parseCollection(json).filter((category) => category?.slug);
  } catch (error) {
    console.error("[SITEMAP_CATEGORIES_ERROR]", error?.message);
    return [];
  }
}

export async function getPublishedServices() {
  try {
    const json = await fetchJson("/services");
    const services = parseCollection(json).filter((service) => service?.slug);
    if (!services.length) return SERVICE_LINKS;
    const merged = new Map(SERVICE_LINKS.map((service) => [service.href, service]));
    services.forEach((service) => merged.set(`/services/${service.slug}`, service));
    return Array.from(merged.values());
  } catch (error) {
    console.error("[SITEMAP_SERVICES_ERROR]", error?.message);
    return SERVICE_LINKS;
  }
}

export async function getPublishedCareers() {
  try {
    const json = await fetchJson("/careers?limit=50");
    return parseCollection(json).filter(
      (career) => career?.slug && !career?.seo?.noIndex
    );
  } catch (error) {
    console.error("[SITEMAP_CAREERS_ERROR]", error?.message);
    return [];
  }
}

export function buildPagesRoutes() {
  return coreStaticPages.map(createRoute);
}

export function buildServiceRoutes(services = []) {
  const hubRoutes = serviceCategoryHubs.map(createRoute);
  const detailRoutes = services.map((service) =>
    createRoute({
      path: service.href || `/services/${service.slug}`,
      changeFrequency: "monthly",
      priority: 0.92,
      lastModified: service.updatedAt,
    })
  );
  return mergeRoutes([...hubRoutes, ...detailRoutes]);
}

export function buildCategoryArchiveRoutes(posts = [], categories = []) {
  const categoryMap = new Map();

  categories.forEach((category) => {
    categoryMap.set(category.slug, {
      slug: category.slug,
      priority: 0.75,
      lastModified: getNewestIsoDate(category.updatedAt, category.createdAt),
    });
  });

  posts.forEach((post) => {
    const slug = post.category?.slug;
    if (!slug) return;
    const existing = categoryMap.get(slug) || { slug, priority: 0.75 };
    categoryMap.set(slug, {
      ...existing,
      lastModified: getNewestIsoDate(
        existing.lastModified,
        post.updatedAt,
        post.publishedAt,
        post.createdAt
      ),
    });
  });

  return Array.from(categoryMap.values()).map((category) =>
    createRoute({
      path: `/category/${category.slug}`,
      changeFrequency: "weekly",
      priority: category.priority,
      lastModified: category.lastModified,
    })
  );
}

export function buildCareerRoutes(careers = []) {
  return careers.map((career) =>
    createRoute({
      path: `/careers/${career.slug}`,
      changeFrequency: "weekly",
      priority: 0.82,
      lastModified: getNewestIsoDate(
        career.updatedAt,
        career.publishedAt,
        career.createdAt
      ),
    })
  );
}

export function isNewsPost(post) {
  if (!post) return false;
  return (
    post.contentType === "news" ||
    post.category?.contentType === "news" ||
    post.category?.slug === "ai-news" ||
    post.category?.slug === "news"
  );
}

export function isBlogPost(post) {
  return !isNewsPost(post);
}

export function extractPostImage(post) {
  const raw =
    post.coverImage ||
    post.featuredImage ||
    post.image ||
    post.thumbnail ||
    post.ogImage ||
    post.seo?.ogImage;

  if (!raw) return null;
  if (typeof raw === "string" && raw.startsWith("http")) return raw;
  if (typeof raw === "string" && raw.startsWith("/")) return `${BASE_URL}${raw}`;
  return null;
}

export function buildBlogPostRoutes(posts = []) {
  return posts
    .filter((post) => !EXCLUDED_SLUGS.includes(post.slug) && isBlogPost(post))
    .map((post) => {
      const lastModified = getNewestIsoDate(
        post.updatedAt,
        post.publishedAt,
        post.createdAt
      );
      const cat = post.category?.slug || "blog";
      const image = extractPostImage(post);
      return createRoute({
        path: `/${cat}/${post.slug}`,
        changeFrequency: getBlogChangeFrequency(lastModified),
        priority: 0.85,
        lastModified,
        images: image ? [image] : [],
        title: post.title || post.metaTitle,
      });
    });
}

export function buildNewsPostRoutes(posts = []) {
  return posts
    .filter((post) => !EXCLUDED_SLUGS.includes(post.slug) && isNewsPost(post))
    .map((post) => {
      const lastModified = getNewestIsoDate(
        post.updatedAt,
        post.publishedAt,
        post.createdAt
      );
      const cat = post.category?.slug || "news";
      const image = extractPostImage(post);
      return createRoute({
        path: `/${cat}/${post.slug}`,
        changeFrequency: "hourly",
        priority: 0.9,
        lastModified,
        images: image ? [image] : [],
        title: post.title || post.metaTitle,
      });
    });
}

export function buildCategoryPostsRoutes(categorySlug, posts = []) {
  const filtered = posts.filter(
    (post) =>
      post.category?.slug?.toLowerCase() === categorySlug?.toLowerCase() &&
      !EXCLUDED_SLUGS.includes(post.slug)
  );

  return filtered.map((post) => {
    const lastModified = getNewestIsoDate(
      post.updatedAt,
      post.publishedAt,
      post.createdAt
    );
    const cat = post.category?.slug || categorySlug;
    const isNews = isNewsPost(post);
    const image = extractPostImage(post);
    return createRoute({
      path: `/${cat}/${post.slug}`,
      changeFrequency: isNews ? "hourly" : getBlogChangeFrequency(lastModified),
      priority: isNews ? 0.9 : 0.85,
      lastModified,
      images: image ? [image] : [],
      title: post.title || post.metaTitle,
    });
  });
}

export function mergeRoutes(routes = []) {
  const routeMap = new Map();

  routes.forEach((route) => {
    if (!route || !route.url) return;
    const existing = routeMap.get(route.url);

    if (!existing) {
      routeMap.set(route.url, route);
      return;
    }

    routeMap.set(route.url, {
      ...existing,
      ...route,
      url: route.url,
      lastModified: getNewestIsoDate(existing.lastModified, route.lastModified),
      images: Array.from(new Set([...(existing.images || []), ...(route.images || [])])),
    });
  });

  return Array.from(routeMap.values()).sort((a, b) => a.url.localeCompare(b.url));
}

export function formatUrlSetXml(routes = []) {
  const cleanRoutes = routes.filter((r) => r?.url?.startsWith(BASE_URL));
  const hasImages = cleanRoutes.some((r) => r.images && r.images.length > 0);

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"`;
  if (hasImages) {
    xml += ` xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"`;
  }
  xml += `>\n`;

  for (const item of cleanRoutes) {
    xml += `  <url>\n`;
    xml += `    <loc>${escapeXml(item.url)}</loc>\n`;
    if (item.lastModified) {
      xml += `    <lastmod>${item.lastModified}</lastmod>\n`;
    }
    if (item.changeFrequency) {
      xml += `    <changefreq>${item.changeFrequency}</changefreq>\n`;
    }
    if (typeof item.priority === "number") {
      xml += `    <priority>${item.priority.toFixed(2)}</priority>\n`;
    }
    if (Array.isArray(item.images)) {
      for (const img of item.images) {
        if (!img) continue;
        xml += `    <image:image>\n`;
        xml += `      <image:loc>${escapeXml(img)}</image:loc>\n`;
        if (item.title) {
          xml += `      <image:title>${escapeXml(item.title)}</image:title>\n`;
        }
        xml += `    </image:image>\n`;
      }
    }
    xml += `  </url>\n`;
  }

  xml += `</urlset>`;
  return xml;
}

export function formatSitemapIndexXml(sitemaps = []) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const sm of sitemaps) {
    xml += `  <sitemap>\n`;
    xml += `    <loc>${escapeXml(sm.url)}</loc>\n`;
    if (sm.lastModified) {
      xml += `    <lastmod>${sm.lastModified}</lastmod>\n`;
    }
    xml += `  </sitemap>\n`;
  }

  xml += `</sitemapindex>`;
  return xml;
}
