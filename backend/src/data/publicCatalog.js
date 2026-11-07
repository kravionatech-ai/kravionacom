/**
 * publicCatalog.js
 * Default public catalog for fallback when database is initializing or unavailable.
 */
import { seedServicesData } from "./seedServicesData.js";

export const publicServices = seedServicesData;

export const publicProjects = [
  {
    title: "Enterprise AI Knowledge Assistant",
    category: "AI & Automation Solutions",
    image: "/images/office/case-study-product.webp",
    imageAlt: "Kraviona Enterprise AI Knowledge Assistant Case Study",
    description:
      "A high-security RAG assistant indexing thousands of enterprise documents with sub-second retrieval, strict tenant access control, and automated CRM routing.",
  },
  {
    title: "Autonomous Multi-Tenant SaaS Platform",
    category: "SaaS & Software Products",
    image: "/images/office/case-study-edtech.webp",
    imageAlt: "Kraviona Multi-Tenant Cloud SaaS Platform Case Study",
    description:
      "A cloud-native SaaS product architecture featuring automated tenant provisioning, Stripe billing webhooks, role-based access control, and high-concurrency microservices.",
  },
  {
    title: "AI-Powered E-Commerce Recommendation Engine",
    category: "E-commerce Solutions",
    image: "/images/office/case-study-commerce.webp",
    imageAlt: "Kraviona AI-Powered E-Commerce Platform Case Study",
    description:
      "A headless Next.js storefront integrated with real-time vector recommendation algorithms, marketplace catalog synchronization, and automated payout reconciliation.",
  },
];
