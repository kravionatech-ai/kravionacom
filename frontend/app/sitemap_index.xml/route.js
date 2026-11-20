import { GET as handleSitemapIndex } from "../sitemap.xml/route.js";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function GET(request, context) {
  return handleSitemapIndex(request, context);
}
