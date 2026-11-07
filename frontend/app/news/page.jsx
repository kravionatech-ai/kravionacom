import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { defaultRobots, canonicalUrl } from "@/app/seoConfig.js";
import { API_URL } from "@/utils/api";
import NewsListingLayout from "@/components/News/NewsListingLayout";

export const revalidate = 3600;

const canonical = canonicalUrl("/news");
const title = "Latest Technology & AI Insights | Kraviona News";
const description =
  "Authoritative reporting, architectural deep-dives, and market intelligence across artificial intelligence, autonomous agents, modern full-stack web systems, and digital growth.";

export const metadata = {
  title: { absolute: title },
  description,
  keywords: [
    "Latest Technology & AI Insights",
    "Kraviona News",
    "AI News 2026",
    "Autonomous AI Agents",
    "Web Development News",
    "Full-Stack Engineering Updates",
    "Enterprise Tech News India",
  ],
  authors: [{ name: "Kraviona Tech Solutions", url: "https://www.kraviona.com" }],
  creator: "Kraviona Tech Solutions",
  alternates: { canonical },
  openGraph: {
    title,
    description,
    url: canonical,
    siteName: "Kraviona Tech Solutions",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kraviona News - Latest Technology & AI Insights",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title,
    description,
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
};

const parsePosts = (json) =>
  Array.isArray(json?.posts)
    ? json.posts
    : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];

async function getInitialNewsPosts() {
  try {
    const res = await fetch(
      `${API_URL}/public/posts?contentType=news&page=1&limit=13`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return { posts: [], pagination: {} };
    const json = await res.json();
    return { posts: parsePosts(json), pagination: json?.pagination || {} };
  } catch {
    return { posts: [], pagination: {} };
  }
}

export default async function NewsPage() {
  const { posts, pagination } = await getInitialNewsPosts();

  return (
    <div>
      <JsonLd
        data={[
          webPageSchema({
            type: "CollectionPage",
            url: canonical,
            name: title,
            description,
          }),
          breadcrumbSchema([
            { name: "Home", url: "https://www.kraviona.com" },
            { name: "News", url: canonical },
          ]),
        ]}
      />
      <NewsListingLayout
        initialPosts={posts}
        initialPagination={pagination}
      />
    </div>
  );
}
