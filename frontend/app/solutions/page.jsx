import Solutions from "@/components/Solutions/Solutions";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/app/seoConfig";

const solutionsPageSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://www.kraviona.com/solutions#webpage",
  url: "https://www.kraviona.com/solutions",
  name: "AI & Industry Technology Solutions | Kraviona",
  description:
    "Explore Kraviona's AI solutions, custom software, and intelligent automation systems for finance, e-commerce, healthcare, real estate, SaaS, and logistics.",
  isPartOf: { "@id": "https://www.kraviona.com/#website" },
  about: [
    "Artificial intelligence solutions",
    "Custom software development",
    "Business process automation",
    "Digital transformation",
  ],
};

export const dynamic = "force-static";

export const metadata = buildMetadata({
  title: "AI Solutions & Industry Software | Kraviona",
  description:
    "Intelligent software, custom AI agents, and enterprise automation solutions for fintech, e-commerce, healthcare, real estate, and SaaS businesses.",
  path: "/solutions",
  image: "/og-solutions.jpg",
  imageAlt: "Kraviona AI and industry technology solutions",
  keywords: [
    "AI Solutions Company",
    "AI Agent Development",
    "Custom Software Solutions",
    "Business Process Automation",
    "FinTech AI Solutions",
    "E-commerce AI Automation",
    "Healthcare Software Development",
  ],
});

export default function SolutionsPage() {
  return (
    <>
      <JsonLd
        data={[
          solutionsPageSchema,
          breadcrumbSchema([
            { name: "Home", url: "https://www.kraviona.com" },
            { name: "Solutions", url: "https://www.kraviona.com/solutions" },
          ]),
        ]}
      />
      <Solutions />
    </>
  );
}
