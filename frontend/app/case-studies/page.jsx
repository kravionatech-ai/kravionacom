import React from "react";
import GalleryPage from "@/components/Gallery/GalleryPage";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, webPageSchema } from "@/lib/schema";
import { defaultRobots, DEFAULT_OG_IMAGE } from "@/app/seoConfig.js";
import { API_URL } from "@/utils/api";

export const revalidate = 300;

export const metadata = {
  title: {
    absolute: "Case Studies & Client Engineering Results | Kraviona",
  },
  description:
    "Explore Kraviona case studies showing how MERN stack development, Next.js architecture, technical SEO, and automation deliver measurable business results.",
  keywords: [
    "Case Studies",
    "Web Development Case Studies",
    "MERN Stack Success Stories",
    "SEO Results",
    "Web Development Projects",
    "Enterprise Solutions",
    "Digital Transformation Cases",
    "Client Success Stories",
  ],
  authors: [{ name: "Kraviona Tech", url: "https://www.kraviona.com" }],
  creator: "Kraviona Tech Solutions",
  alternates: { canonical: "https://www.kraviona.com/case-studies" },
  openGraph: {
    title: "Case Studies – Real-World Results | Kraviona",
    description:
      "Discover how Kraviona delivered measurable business results. Read case studies on MERN Stack development, Technical SEO, and digital transformation.",
    url: "https://www.kraviona.com/case-studies",
    siteName: "Kraviona Tech Solutions",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Kraviona Case Studies",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "Case Studies – Real-World Results | Kraviona",
    description:
      "Real case studies showcasing measurable results from Kraviona projects.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: defaultRobots,
};

async function getPublicProjects() {
  try {
    const response = await fetch(`${API_URL}/projects`, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];

    const payload = await response.json();
    return Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload)
        ? payload
        : [];
  } catch {
    return [];
  }
}

export default async function CaseStudiesPage() {
  const projects = await getPublicProjects();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://www.kraviona.com" },
          { name: "Case Studies", url: "https://www.kraviona.com/case-studies" },
        ])}
      />
      <JsonLd
        data={webPageSchema({
          name: "Case Studies & Client Results | Kraviona",
          url: "https://www.kraviona.com/case-studies",
          description:
            "Explore Kraviona case studies showing how MERN stack development, technical SEO, and automation deliver measurable business results.",
        })}
      />
      <GalleryPage initialProjects={projects} />
    </>
  );
}
