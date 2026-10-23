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
  name: "About Kraviona – Engineering Digital Ecosystems",
  description:
    "Learn about Kraviona, the founder-led team building MERN stack products, Next.js websites, backend systems, and technical SEO foundations.",
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
    absolute: "About Kraviona | Founder-Led Web Engineering Team",
  },
  description:
    "Meet Kraviona Tech Solutions, a Delhi NCR team building fast websites, scalable MERN web apps, backend APIs, and technical SEO systems for growing brands.",
  keywords: [
    "About Kraviona",
    "Kraviona Team",
    "IT Company India",
    "Web Development Company About",
    "MERN Stack Company India",
    "Kraviona Mission & Vision",
    "Tech Company Delhi",
  ],
  authors: [{ name: "Kraviona Tech", url: "https://www.kraviona.com" }],
  creator: "Kraviona Tech Solutions",
  alternates: { canonical: "https://www.kraviona.com/about" },
  openGraph: {
    title: "About Kraviona | Founder-Led Web Development Team",
    description:
      "Meet the team behind Kraviona's MERN stack development, Next.js websites, backend systems, and technical SEO work.",
    url: "https://www.kraviona.com/about",
    siteName: "Kraviona Tech Solutions",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "About Kraviona Tech Solutions",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "About Kraviona | Founder-Led Web Development Team",
    description:
      "Meet the team behind Kraviona's development and technical SEO work.",
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
