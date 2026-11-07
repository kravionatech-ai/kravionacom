import ContactBanner from "@/components/Contact/ContactBanner";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import ContactMap from "@/components/Contact/ContactMap";
import BlogCTA from "@/components/Blog/BlogCTA";
import ContactFAQ from "@/components/Contact/ContactFAQ";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, contactFaqSchema } from "@/lib/schema";
import { defaultRobots, canonicalUrl } from "@/app/seoConfig.js";
import { getDynamicPage } from "@/lib/pagesApi";

export const revalidate = 3600;

export async function generateMetadata() {
  const dynamicPage = await getDynamicPage("contact");
  const seo = dynamicPage?.seo || {};

  const title = seo.metaTitle || "Contact Kraviona | Free AI & Technology Consultation";
  const description =
    seo.metaDescription ||
    "Book a free technical consultation with Kraviona for AI agents, workflow automation, custom software, SaaS development, and digital solutions.";
  const canonical = seo.canonicalUrl || canonicalUrl("/contact");
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
          alt: "Contact Kraviona – AI-First Technology & Digital Solutions",
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

export default async function ContactPage() {
  const dynamicPage = await getDynamicPage("contact");

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": dynamicPage?.seo?.schemaType || "ContactPage",
    "@id": "https://www.kraviona.com/contact#webpage",
    url: dynamicPage?.seo?.canonicalUrl || "https://www.kraviona.com/contact",
    name: dynamicPage?.seo?.metaTitle || "Contact Kraviona - Start Your AI & Technology Project",
    description:
      dynamicPage?.seo?.metaDescription ||
      "Contact Kraviona for custom AI solutions, intelligent automation, custom software development, SaaS products, and technical SEO.",
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
          name: "Contact",
          item: "https://www.kraviona.com/contact",
        },
      ],
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <JsonLd
        data={[
          contactPageSchema,
          contactFaqSchema,
          breadcrumbSchema([
            { name: "Home", url: "https://www.kraviona.com" },
            { name: "Contact", url: "https://www.kraviona.com/contact" },
          ]),
        ]}
      />
      <ContactBanner dynamicHero={dynamicPage?.hero} />
      <ContactFormDetails />
      <ContactMap />
      <BlogCTA />
      <ContactFAQ />
    </div>
  );
}
