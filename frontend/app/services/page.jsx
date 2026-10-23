import ServicesBanner from "@/components/Services/ServicesBanner";
import FeaturedServices from "@/components/Home/FeaturedServices";
import WhyChooseUs from "@/components/Services/WhyChooseUs";
import ContactFormDetails from "@/components/Contact/ContactFormDetails";
import { JsonLd } from "@/components/JsonLd";
import Link from "next/link";
import { SERVICE_LINKS, SERVICE_CATEGORY_HUBS } from "./serviceData.js";
import { defaultRobots } from "@/app/seoConfig.js";
import { breadcrumbSchema } from "@/lib/schema";
import { API_URL } from "@/utils/api";

export const revalidate = 3600;

async function getServicePages() {
  try {
    const response = await fetch(`${API_URL}/services`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (response.ok) {
      const json = await response.json();
      if (json?.data?.length) {
        const dynamicLinks = json.data.map((service) => ({
          name: service.title || service.name,
          href: `/services/${service.slug}`,
          category: service.category,
        }));
        const byHref = new Map(SERVICE_LINKS.map((item) => [item.href, item]));
        dynamicLinks.forEach((item) => byHref.set(item.href, item));
        return Array.from(byHref.values());
      }
    }
  } catch {}
  return SERVICE_LINKS;
}

// JSON-LD: Service Page Schema
const servicesPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.kraviona.com/services#webpage",
  url: "https://www.kraviona.com/services",
  name: "MERN Stack Development & Technical SEO Services | Kraviona",
  description:
    "Explore Kraviona's full suite of web development, technical SEO, AI automation, digital marketing, e-commerce, marketplace seller, and brand services.",
  isPartOf: { "@id": "https://www.kraviona.com/#website" },
};

const servicesBreadcrumbSchema = breadcrumbSchema([
  { name: "Home", url: "https://www.kraviona.com" },
  { name: "Services", url: "https://www.kraviona.com/services" },
]);

export const metadata = {
  title: { absolute: "Web Development & Technical SEO Services | Kraviona" },
  description:
    "Explore Kraviona services for MERN stack development, Next.js websites, technical SEO, AI automation, UI/UX design, performance, APIs, and SaaS.",
  keywords: [
    "Web Development Services India",
    "MERN Stack Development Company",
    "Technical SEO Services India",
    "React.js Development Services",
    "Node.js Backend Development",
    "UI UX Design Services India",
    "Custom Software Development",
    "Digital Marketing Company India",
    "Web App Development Company",
    "IT Solutions Company Delhi",
    "Full Stack Development Services",
    "SEO Company India",
    "Kraviona Services",
  ],
  authors: [{ name: "Kraviona Tech", url: "https://www.kraviona.com" }],
  creator: "Kraviona Tech Solutions",
  alternates: {
    canonical: "https://www.kraviona.com/services",
  },
  openGraph: {
    title: "MERN Stack Development & Technical SEO Services | Kraviona",
    description:
      "Explore Kraviona's web development, AI automation, digital marketing, marketplace seller, and technical SEO services.",
    url: "https://www.kraviona.com/services",
    siteName: "Kraviona Tech Solutions",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kraviona Tech Solutions – IT Services",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@KravionaTech",
    creator: "@KravionaTech",
    title: "MERN Stack Development & Technical SEO Services | Kraviona",
    description:
      "Custom MERN stack apps, technical SEO, AI automation, marketing, and seller services. Built to scale.",
    images: ["/og-image.jpg"],
  },
  robots: defaultRobots,
};

const MainServices = async () => {
  const servicePages = await getServicePages();
  return (
    <>
      <JsonLd data={[servicesPageSchema, servicesBreadcrumbSchema]} />
      <ServicesBanner />

      {/* Service Category Hubs */}
      <section className="py-12 bg-[#F5F7F8] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <p className="text-xs font-black uppercase tracking-widest text-[#E8622A] mb-1">
              Core Technical Domains
            </p>
            <h2 className="text-2xl font-black text-dark">
              Explore Our Service Hubs
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.values(SERVICE_CATEGORY_HUBS).map((hub) => (
              <Link
                key={hub.slug}
                href={`/services/${hub.slug}`}
                className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 transition-all duration-200 hover:border-[#E8622A]/40 hover:shadow-brand-sm"
              >
                <div>
                  <h3 className="font-extrabold text-[#1A2E33] group-hover:text-[#E8622A] transition-colors text-base mb-2">
                    {hub.categoryLabel}
                  </h3>
                  <p className="text-xs text-brand-muted line-clamp-3 leading-relaxed">
                    {hub.metaDescription}
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:text-[#E8622A]">
                  View Hub &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Service Sub-Pages Navigation */}
      <section className="py-10 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-4">
            Explore Specific Services:
          </p>
          <div className="flex flex-wrap gap-3">
            {servicePages.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="px-4 py-2 text-sm font-semibold text-[#2A4A52] border border-[#2A4A52]/30 rounded-full hover:bg-[#2A4A52] hover:text-white transition-all duration-200"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <FeaturedServices />
      <WhyChooseUs />
      <ContactFormDetails />
    </>
  );
};

export default MainServices;
