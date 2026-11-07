import AboutBanner from "@/components/About/AboutBanner";
import OurStory from "@/components/About/OurStory";
import CoreValues from "@/components/About/CoreValues";
import TeamSection from "@/components/About/TeamSection";
import BlogCTA from "@/components/Blog/BlogCTA";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { defaultRobots, canonicalUrl } from "@/app/seoConfig.js";
import { getDynamicPage } from "@/lib/pagesApi";

export const revalidate = 3600;

export async function generateMetadata() {
  const dynamicPage = await getDynamicPage("about");
  const seo = dynamicPage?.seo || {};

  const title = seo.metaTitle || "About Kraviona | AI-First Technology & Software Company";
  const description =
    seo.metaDescription ||
    "Meet Kraviona, an AI-first technology company helping businesses build intelligent software, develop AI-powered solutions, and automate complex workflows.";
  const canonical = seo.canonicalUrl || canonicalUrl("/about");
  const ogImage = seo.ogImage || "/og-image.jpg";

  return {
    title: { absolute: title },
    description,
    authors: [{ name: "Kraviona", url: "https://www.kraviona.com" }],
    creator: "Kraviona",
    alternates: { canonical },
    openGraph: {
      title: seo.ogTitle || title,
      description: seo.ogDescription || description,
      url: canonical,
      siteName: "Kraviona",
      type: "website",
      locale: "en_IN",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "About Kraviona – AI-First Technology & Digital Solutions",
        },
      ],
    },
    twitter: {
      card: seo.twitterCard || "summary_large_image",
      site: "@KravionaTech",
      creator: "@KravionaTech",
      title: seo.twitterTitle || title,
      description: seo.twitterDescription || description,
      images: [ogImage],
    },
    robots: seo.noIndex ? { index: false, follow: false } : defaultRobots,
  };
}

export default async function AboutPage() {
  const dynamicPage = await getDynamicPage("about");

  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": dynamicPage?.seo?.schemaType || "AboutPage",
    "@id": "https://www.kraviona.com/about#webpage",
    url: dynamicPage?.seo?.canonicalUrl || "https://www.kraviona.com/about",
    name: dynamicPage?.seo?.metaTitle || "About Kraviona – AI-First Technology & Digital Solutions Company",
    description:
      dynamicPage?.seo?.metaDescription ||
      "Learn about Kraviona, an AI-first technology company building intelligent software, autonomous AI agents, SaaS products, and automated digital systems.",
    isPartOf: { "@id": "https://www.kraviona.com/#website" },
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
          name: "About Us",
          item: "https://www.kraviona.com/about",
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        data={[
          aboutPageSchema,
          breadcrumbSchema([
            { name: "Home", url: "https://www.kraviona.com" },
            { name: "About Us", url: "https://www.kraviona.com/about" },
          ]),
        ]}
      />
      <AboutBanner dynamicHero={dynamicPage?.hero} />
      <OurStory dynamicSections={dynamicPage?.sections} />
      <CoreValues />
      <TeamSection />
      <BlogCTA />
    </div>
  );
}
