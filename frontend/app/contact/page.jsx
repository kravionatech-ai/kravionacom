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
  name: "Contact Kraviona - Start Your Web Development Project",
  description:
    "Contact Kraviona for MERN stack development, Next.js websites, backend APIs, technical SEO, AI automation, and web performance work.",
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
    absolute: "Contact Kraviona | Free Web & SEO Consultation",
  },
  description:
    "Book a free technical consultation with Kraviona for MERN stack development, Next.js websites, technical SEO, AI automation, and custom software projects.",
  keywords: [
    "Contact Kraviona",
    "Hire Web Developers India",
    "IT Consulting Contact",
    "Get a Quote Web Development",
    "MERN Stack Company Contact",
    "Web Development Inquiry",
    "Kraviona Contact Details",
    "Hire Next.js Developer",
  ],
  authors: [{ name: "Kraviona Tech", url: "https://www.kraviona.com" }],
  creator: "Kraviona Tech Solutions",
  alternates: { canonical: "https://www.kraviona.com/contact" },
  openGraph: {
    title: "Contact Kraviona - Start Your Web Development Project",
    description:
      "Talk to Kraviona about MERN stack development, Next.js websites, backend APIs, technical SEO, and custom software work.",
    url: "https://www.kraviona.com/contact",
    siteName: "Kraviona Tech Solutions",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Contact Kraviona Tech Solutions",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "Contact Kraviona - Start Your Web Development Project",
    description:
      "Talk to Kraviona about web development, backend APIs, technical SEO, and custom software work.",
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
