import ContactBanner from "@/components/Contact/ContactBanner";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import ContactMap from "@/components/Contact/ContactMap";
import BlogCTA from "@/components/Blog/BlogCTA";
import ContactFAQ from "@/components/Contact/ContactFAQ";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, contactFaqSchema } from "@/lib/schema";
import { defaultRobots } from "@/app/seoConfig.js";

// JSON-LD: ContactPage
const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": "https://www.kraviona.com/contact#webpage",
  url: "https://www.kraviona.com/contact",
  name: "Contact Kraviona - Start Your AI & Technology Project",
  description:
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

export const dynamic = "force-static";

export const metadata = {
  title: {
    absolute: "Contact Kraviona | Free AI & Technology Consultation",
  },
  description:
    "Book a free technical consultation with Kraviona for AI agents, workflow automation, custom software, SaaS development, and digital solutions.",
  authors: [{ name: "Kraviona", url: "https://www.kraviona.com" }],
  creator: "Kraviona",
  alternates: { canonical: "https://www.kraviona.com/contact" },
  openGraph: {
    title: "Contact Kraviona - Start Your AI & Technology Project",
    description:
      "Talk directly to Kraviona's engineering team about AI agents, custom software, SaaS products, and workflow automation.",
    url: "https://www.kraviona.com/contact",
    siteName: "Kraviona",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Kraviona – AI-First Technology & Digital Solutions",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "Contact Kraviona - Start Your AI & Technology Project",
    description:
      "Talk to Kraviona about AI agents, custom software, SaaS platforms, and enterprise automation.",
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
};

const Contact = () => {
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
      <ContactBanner />
      <ContactFormDetails />
      <ContactMap />
      <BlogCTA />
      <ContactFAQ />
    </div>
  );
};

export default Contact;
