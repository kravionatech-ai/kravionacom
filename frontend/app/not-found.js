import NotFoundClient from "@/components/NotFound/NotFoundClient";
import { API_URL } from "@/utils/api";

export const revalidate = 3600;

export const metadata = {
  title: "404 - Page Not Found | Kraviona Tech Solutions",
  description:
    "The page you are looking for does not exist or has been moved. Explore Kraviona's web development, technical SEO, MERN stack, AI automation, and digital marketing services.",
  robots: {
    index: false,
    follow: false,
  },
};

async function getSuggestedPosts() {
  try {
    const response = await fetch(`${API_URL}/public/posts?page=1&limit=3`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];

    const json = await response.json();
    const posts = Array.isArray(json?.data) ? json.data : [];
    return posts
      .filter((post) => post?.slug && post?.title)
      .map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || "",
        category: post.category,
      }));
  } catch {
    return [];
  }
}

export default async function NotFound() {
  const suggestedPosts = await getSuggestedPosts();

  return (
    <NotFoundClient suggestedPosts={suggestedPosts} />
  );
}
