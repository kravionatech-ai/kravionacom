import DigitalVisitingCard from "@/components/Card/DigitalVisitingCard";
import { JsonLd } from "@/components/JsonLd";
import { canonicalUrl, defaultRobots } from "@/app/seoConfig.js";

export const revalidate = 3600;

export const metadata = {
  title: {
    absolute: "Kraviona — Digital Business Card | Amar Kumar, Founder & CEO",
  },
  description:
    "Official digital e-visiting card for Kraviona — AI-First Technology & Digital Solutions based in East Delhi, Delhi 110092, India. Connect with Founder & CEO Amar Kumar for AI agents, SaaS, web apps, and digital growth.",
  alternates: {
    canonical: canonicalUrl("/card"),
  },
  openGraph: {
    title: "Kraviona — Digital Business Card | Amar Kumar, Founder & CEO",
    description:
      "Official digital e-visiting card for Kraviona — AI-First Technology & Digital Solutions. Connect with Founder & CEO Amar Kumar.",
    url: canonicalUrl("/card"),
    siteName: "Kraviona Tech Solutions",
    locale: "en_IN",
    type: "profile",
    images: [
      {
        url: "https://www.kraviona.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kraviona Digital Business Card – Amar Kumar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "Kraviona — Digital Business Card | Amar Kumar",
    description:
      "Official digital e-visiting card for Kraviona — AI-First Technology & Digital Solutions.",
    images: ["https://www.kraviona.com/og-image.jpg"],
  },
  robots: defaultRobots,
};

const vcardSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.kraviona.com/authors/amar-kumar#person",
      name: "Amar Kumar",
      jobTitle: "Founder & Lead Technical Architect",
      worksFor: {
        "@type": "Organization",
        "@id": "https://www.kraviona.com/#org",
        name: "Kraviona Tech Solutions",
        url: "https://www.kraviona.com",
        logo: "https://www.kraviona.com/full-logo.webp",
        telephone: "+91-9608553167",
        email: "hello@kraviona.com",
        address: {
          "@type": "PostalAddress",
          addressLocality: "East Delhi",
          addressRegion: "Delhi",
          postalCode: "110092",
          addressCountry: "IN",
        },
      },
      url: "https://www.kraviona.com/card",
      sameAs: [
        "https://www.linkedin.com/company/kravionai",
        "https://www.linkedin.com/in/amarkumar96085/",
        "https://x.com/KravionaTech",
      ],
    },
    {
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
          name: "Digital Business Card",
          item: "https://www.kraviona.com/card",
        },
      ],
    },
  ],
};

export default function CardPage() {
  return (
    <>
      <JsonLd data={vcardSchema} />
      <main className="min-h-screen bg-[#030809] text-white selection:bg-[#2dd4bf]/20 selection:text-[#5eead4] flex flex-col justify-center">
        <DigitalVisitingCard />
      </main>
    </>
  );
}
