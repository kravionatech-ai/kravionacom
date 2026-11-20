import { NextResponse } from "next/server";
import {
  BASE_URL,
  getPublishedCategories,
  getPublishedPosts,
  getNewestIsoDate,
  formatSitemapIndexXml,
  isNewsPost,
  isBlogPost,
} from "@/lib/sitemapData";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET() {
  try {
    const [categories, allPosts] = await Promise.all([
      getPublishedCategories(),
      getPublishedPosts(),
    ]);

    const blogPosts = allPosts.filter(isBlogPost);
    const newsPosts = allPosts.filter(isNewsPost);

    // Dynamic lastmod dates for sections
    const blogLastmod = getNewestIsoDate(
      ...blogPosts.map((p) => p.updatedAt || p.publishedAt || p.createdAt)
    );
    const newsLastmod = getNewestIsoDate(
      ...newsPosts.map((p) => p.updatedAt || p.publishedAt || p.createdAt)
    );
    const categoriesLastmod = getNewestIsoDate(
      ...categories.map((c) => c.updatedAt || c.createdAt)
    );

    // Group posts by category (both blog & news topical categories)
    const categoryPostMap = new Map();
    allPosts.forEach((post) => {
      const slug = post.category?.slug;
      if (!slug) return;
      if (!categoryPostMap.has(slug)) {
        categoryPostMap.set(slug, []);
      }
      categoryPostMap.get(slug).push(post);
    });

    // 1. Core Section Sitemaps
    const sitemaps = [
      {
        url: `${BASE_URL}/sitemap/pages.xml`,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${BASE_URL}/sitemap/services.xml`,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${BASE_URL}/sitemap/categories.xml`,
        lastModified: categoriesLastmod || new Date().toISOString(),
      },
      {
        url: `${BASE_URL}/sitemap/careers.xml`,
        lastModified: new Date().toISOString(),
      },
      {
        url: `${BASE_URL}/sitemap/news.xml`,
        lastModified: newsLastmod || new Date().toISOString(),
      },
      {
        url: `${BASE_URL}/sitemap/blog.xml`,
        lastModified: blogLastmod || new Date().toISOString(),
      },
    ];

    // 2. Category-Wise Dynamic Sitemaps
    // For each published category that has blog posts, provide a category-specific sitemap
    for (const [catSlug, catPosts] of categoryPostMap.entries()) {
      const latestPostMod = getNewestIsoDate(
        ...catPosts.map((p) => p.updatedAt || p.publishedAt || p.createdAt)
      );
      sitemaps.push({
        url: `${BASE_URL}/sitemap/category-${catSlug}.xml`,
        lastModified: latestPostMod || new Date().toISOString(),
      });
    }

    const xml = formatSitemapIndexXml(sitemaps);

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("[SITEMAP_INDEX_ERROR]", error);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>`,
      {
        status: 500,
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      }
    );
  }
}
