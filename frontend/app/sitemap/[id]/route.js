import { NextResponse } from "next/server";
import {
  BASE_URL,
  getPublishedPosts,
  getPublishedCategories,
  getPublishedServices,
  getPublishedCareers,
  buildPagesRoutes,
  buildServiceRoutes,
  buildCategoryArchiveRoutes,
  buildCareerRoutes,
  buildBlogPostRoutes,
  buildNewsPostRoutes,
  buildCategoryPostsRoutes,
  mergeRoutes,
  formatUrlSetXml,
  createRoute,
  isNewsPost,
  isBlogPost,
} from "@/lib/sitemapData";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request, context) {
  try {
    const params = await context.params;
    const rawId = params?.id || "";

    // Normalize id by stripping .xml extension
    const cleanId = String(rawId).replace(/\.xml$/i, "").trim().toLowerCase();

    if (!cleanId) {
      return new NextResponse("Sitemap not found", { status: 404 });
    }

    // 1. Core Pages Sitemap
    if (cleanId === "pages") {
      const routes = buildPagesRoutes();
      return new NextResponse(formatUrlSetXml(routes), {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    // 2. Services Sitemap (Hubs + Detailed Service Landing Pages)
    if (cleanId === "services") {
      const services = await getPublishedServices();
      const routes = buildServiceRoutes(services);
      return new NextResponse(formatUrlSetXml(routes), {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    // 3. Category Archive Pages Sitemap (/category/[slug])
    if (cleanId === "categories") {
      const [allPosts, categories] = await Promise.all([
        getPublishedPosts(),
        getPublishedCategories(),
      ]);
      const routes = buildCategoryArchiveRoutes(allPosts, categories);
      return new NextResponse(formatUrlSetXml(routes), {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    // 4. Careers Sitemap
    if (cleanId === "careers") {
      const careers = await getPublishedCareers();
      const routes = buildCareerRoutes(careers);
      return new NextResponse(formatUrlSetXml(routes), {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    // 5. News Articles Sitemap
    if (cleanId === "news") {
      const allPosts = await getPublishedPosts();
      const newsPosts = allPosts.filter(isNewsPost);
      const routes = buildNewsPostRoutes(newsPosts);
      return new NextResponse(formatUrlSetXml(routes), {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=7200",
        },
      });
    }

    // 6. All Blog Posts Sitemap
    if (cleanId === "blog" || cleanId === "posts") {
      const allPosts = await getPublishedPosts();
      const blogPosts = allPosts.filter(isBlogPost);
      const routes = buildBlogPostRoutes(blogPosts);
      return new NextResponse(formatUrlSetXml(routes), {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    // 7. Full Merged Sitemap ("all")
    if (cleanId === "all") {
      const [allPosts, categories, services, careers] = await Promise.all([
        getPublishedPosts(),
        getPublishedCategories(),
        getPublishedServices(),
        getPublishedCareers(),
      ]);

      const blogPosts = allPosts.filter(isBlogPost);
      const newsPosts = allPosts.filter(isNewsPost);

      const allRoutes = mergeRoutes([
        ...buildPagesRoutes(),
        ...buildServiceRoutes(services),
        ...buildCareerRoutes(careers),
        ...buildCategoryArchiveRoutes(allPosts, categories),
        ...buildBlogPostRoutes(blogPosts),
        ...buildNewsPostRoutes(newsPosts),
      ]);

      return new NextResponse(formatUrlSetXml(allRoutes), {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    // 8. Category-Wise Sitemaps
    // Support category-specific sitemaps: e.g. "category-ai-and-automation" or "category-technical-seo"
    // Also supports direct category slug e.g. "ai-and-automation"
    let categorySlug = cleanId;
    if (cleanId.startsWith("category-")) {
      categorySlug = cleanId.replace(/^category-/, "");
    } else if (cleanId.startsWith("blog-")) {
      categorySlug = cleanId.replace(/^blog-/, "");
    }

    const [categories, allPosts] = await Promise.all([
      getPublishedCategories(),
      getPublishedPosts(),
    ]);

    const matchingCategory = categories.find(
      (c) => c.slug?.toLowerCase() === categorySlug.toLowerCase()
    );

    const categoryPosts = allPosts.filter(
      (post) => post.category?.slug?.toLowerCase() === categorySlug.toLowerCase()
    );

    // If category exists or posts exist in this category:
    if (matchingCategory || categoryPosts.length > 0) {
      const postRoutes = buildCategoryPostsRoutes(categorySlug, allPosts);

      // Prepend the category archive landing page URL
      const categoryLandingRoute = createRoute({
        path: `/category/${categorySlug}`,
        changeFrequency: "weekly",
        priority: 0.8,
        lastModified:
          postRoutes[0]?.lastModified ||
          matchingCategory?.updatedAt ||
          matchingCategory?.createdAt,
      });

      const finalRoutes = mergeRoutes([categoryLandingRoute, ...postRoutes]);

      return new NextResponse(formatUrlSetXml(finalRoutes), {
        status: 200,
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      });
    }

    return new NextResponse(`Sitemap "${cleanId}" not found`, {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error(`[DYNAMIC_SITEMAP_ERROR]`, error);
    return new NextResponse("Internal Server Error generating sitemap", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
