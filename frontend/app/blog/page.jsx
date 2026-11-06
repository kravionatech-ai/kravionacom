import EwayBlogLayout from "@/components/Blog/EwayBlogLayout";
import { canonicalUrl, defaultRobots, SITE_NAME } from "@/app/seoConfig.js";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { API_URL } from "@/utils/api";

export const revalidate = 3600;

const blogPageSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": "https://www.kraviona.com/blog#blog",
  url: "https://www.kraviona.com/blog",
  name: "Kraviona Blog — AI, Web Engineering & Digital Insights",
  description:
    "Read our latest technical insights on artificial intelligence, autonomous agents, Next.js architecture, Generative Engine Optimization (GEO), and modern software engineering.",
  publisher: {
    "@type": "Organization",
    name: "Kraviona Tech Solutions",
    logo: { "@type": "ImageObject", url: "https://www.kraviona.com/full-logo.webp" },
  },
  isPartOf: { "@id": "https://www.kraviona.com/#org" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.kraviona.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.kraviona.com/blog",
      },
    ],
  },
};

const parsePosts = (json) =>
  Array.isArray(json.posts)
    ? json.posts
    : Array.isArray(json.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];

async function getInitialPosts() {
  try {
    const url = `${API_URL}/public/posts?contentType=blog&page=1&limit=12`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return { posts: [], pagination: null };

    const json = await response.json();
    const posts = parsePosts(json).filter((post) => post?.slug);
    return { posts, pagination: json.pagination || null };
  } catch {
    return { posts: [], pagination: null };
  }
}

export const metadata = {
  title: {
    absolute: "AI Engineering, Software & Technical SEO Blog | Kraviona",
  },
  description:
    "Explore Kraviona's blog for expert engineering insights on AI solutions, autonomous agents, Next.js App Router, Technical SEO, AEO/GEO, and cloud backends.",
  authors: [{ name: "Amar Kumar", url: "https://www.kraviona.com/authors/amar-kumar" }],
  creator: SITE_NAME,
  alternates: { canonical: canonicalUrl("/blog") },
  openGraph: {
    title: "AI Engineering & Modern Software Insights | Kraviona Blog",
    description:
      "Expert insights on AI agents, Next.js App Router architecture, Technical SEO, AEO/GEO, and modern cloud engineering from Kraviona's technical team.",
    url: canonicalUrl("/blog"),
    siteName: SITE_NAME,
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kraviona Tech Blog – AI & Software Engineering Insights",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "AI Engineering & Modern Software Insights | Kraviona Blog",
    description:
      "Expert insights on AI agents, Next.js architecture, Technical SEO, and modern cloud performance.",
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
};

const Blog = async () => {
  const { posts: initialPosts, pagination: initialPagination } =
    await getInitialPosts();

  return (
    <div>
      <JsonLd
        data={[
          blogPageSchema,
          breadcrumbSchema([
            { name: "Home", url: "https://www.kraviona.com" },
            { name: "Blog", url: "https://www.kraviona.com/blog" },
          ]),
        ]}
      />
      <EwayBlogLayout
        initialPosts={initialPosts}
        initialPagination={initialPagination}
      />
    </div>
  );
};

export default Blog;
