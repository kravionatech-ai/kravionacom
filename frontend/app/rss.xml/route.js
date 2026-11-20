import {
  getPublishedPosts,
  isNewsPost,
  isBlogPost,
  escapeXml,
} from "@/lib/sitemapData";
import { absoluteImageUrl, canonicalUrl, SITE_NAME, SITE_URL } from "@/app/seoConfig.js";
import { getDate, getExcerpt, getImageUrl } from "@/utils/dataHelpers.js";

export const revalidate = 1800;
export const dynamic = "force-dynamic";

const validPubDate = (value) => {
  const date = new Date(getDate(value));
  return Number.isNaN(date.getTime()) ? new Date().toUTCString() : date.toUTCString();
};

export async function GET(request) {
  let typeFilter = null;
  let catFilter = null;

  try {
    const { searchParams } = new URL(request.url);
    typeFilter = searchParams.get("type"); // "news" or "blog"
    catFilter = searchParams.get("category");
  } catch {
    // default
  }

  let posts = await getPublishedPosts();

  if (typeFilter === "news") {
    posts = posts.filter(isNewsPost);
  } else if (typeFilter === "blog") {
    posts = posts.filter(isBlogPost);
  }

  if (catFilter) {
    posts = posts.filter((p) => p.category?.slug?.toLowerCase() === catFilter.toLowerCase());
  }

  const feedTitle = catFilter
    ? `${SITE_NAME} — ${catFilter} Feed`
    : typeFilter === "news"
      ? `${SITE_NAME} — Latest AI News`
      : `${SITE_NAME} — Blog & Engineering Insights`;

  const feedLink = catFilter
    ? canonicalUrl(`/category/${catFilter}`)
    : typeFilter === "news"
      ? canonicalUrl("/news")
      : canonicalUrl("/blog");

  const items = posts
    .slice(0, 50)
    .map((post) => {
      const cat = post.category?.slug || (isNewsPost(post) ? "news" : "blog");
      const url = canonicalUrl(`/${cat}/${post.slug}`);
      const title = escapeXml(post.title || "Kraviona Article");
      const description = escapeXml(
        getExcerpt(post) ||
          post.excerpt ||
          post.description ||
          "Read the latest Kraviona article on AI automation, web development, SEO, and cloud systems."
      );
      const category = post.category?.name || post.category?.slug || "Technology";
      const imageUrl = getImageUrl(post);
      const enclosure = imageUrl
        ? `<enclosure url="${escapeXml(absoluteImageUrl(imageUrl))}" type="image/jpeg" />`
        : "";

      return `
    <item>
      <title>${title}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <description>${description}</description>
      <author>kravionatech@gmail.com (${escapeXml(post.author?.name || "Kraviona Team")})</author>
      <category>${escapeXml(category)}</category>
      <pubDate>${validPubDate(post.publishedAt || post.createdAt)}</pubDate>
      ${enclosure}
    </item>`;
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(feedTitle)}</title>
    <link>${escapeXml(feedLink)}</link>
    <atom:link href="${escapeXml(`${SITE_URL}/rss.xml`)}" rel="self" type="application/rss+xml" />
    <description>Fresh Kraviona insights on AI systems architecture, Next.js, MERN stack, autonomous agents, technical SEO, and enterprise automation.</description>
    <language>en-IN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=1800, stale-while-revalidate=86400",
    },
  });
}
