import { permanentRedirect } from "next/navigation";

export default async function GallerySlugRedirect({ params }) {
  const { slug } = await params;
  permanentRedirect(`/case-studies/${slug}`);
}
