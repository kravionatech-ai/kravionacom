import AboutBanner from "@/components/About/AboutBanner";
import OurStory from "@/components/About/OurStory";
import CoreValues from "@/components/About/CoreValues";
import TeamSection from "@/components/About/TeamSection";
import BlogCTA from "@/components/Blog/BlogCTA";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { defaultRobots } from "@/app/seoConfig.js";

const aboutPageSchema = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://www.kraviona.com/about#webpage",
  url: "https://www.kraviona.com/about",
  name: "About Kraviona – AI-First Technology & Digital Solutions Company",
  description:
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

export const dynamic = "force-static";

export const metadata = {
  title: {
    absolute: "About Kraviona | AI-First Technology & Software Company",
  },
  description:
    "Meet Kraviona, an AI-first technology company helping businesses build intelligent software, develop AI-powered solutions, and automate complex workflows.",
  authors: [{ name: "Kraviona", url: "https://www.kraviona.com" }],
  creator: "Kraviona",
  alternates: { canonical: "https://www.kraviona.com/about" },
  openGraph: {
    title: "About Kraviona | AI-First Technology & Software Company",
    description:
      "Building Intelligent Businesses Through AI, Technology & Automation. Meet the engineering team behind Kraviona.",
    url: "https://www.kraviona.com/about",
    siteName: "Kraviona",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About Kraviona – AI-First Technology & Digital Solutions",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "About Kraviona | AI-First Technology & Software Company",
    description:
      "Building Intelligent Businesses Through AI, Technology & Automation.",
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
};

const AboutPage = () => {
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
      <AboutBanner />
      <OurStory />
      <CoreValues />
      <TeamSection />
      <BlogCTA />
    </div>
  );
};

export default AboutPage;
