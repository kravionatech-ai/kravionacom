import LegalDocumentPage from "@/components/Legal/LegalDocumentPage";
import {
  canonicalUrl,
  defaultRobots,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_TWITTER,
  SITE_URL,
} from "@/app/seoConfig.js";

const canonical = canonicalUrl("/privacy-policy");
const title = "Privacy Policy & Cookie Standards";
const description =
  "Official Privacy Policy of Kraviona Technologies: Learn how we collect, store, and protect your personal information, manage cookies, anti-bot CAPTCHA security, and comply with the India DPDP Act 2023 and GDPR.";

export const dynamic = "force-static";

export const metadata = {
  title: { absolute: "Privacy Policy | Kraviona Tech Solutions" },
  description,
  keywords: [
    "Kraviona privacy policy",
    "Kraviona cookie policy",
    "DPDP Act India compliance",
    "Kraviona data protection",
    "IT services privacy policy Delhi",
    "web development company privacy policy",
  ],
  alternates: { canonical },
  robots: defaultRobots,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: canonical,
    title: "Privacy Policy | Kraviona Tech Solutions",
    description,
    siteName: SITE_NAME,
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Kraviona Privacy Policy & Cookie Standards",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_TWITTER,
    creator: SITE_TWITTER,
    title: "Privacy Policy | Kraviona Tech Solutions",
    description,
    images: [DEFAULT_OG_IMAGE],
  },
};

const sections = [
  {
    id: "who-we-are",
    title: "1. Who We Are & Scope",
    hindiTitle: "Hum Kaun Hain Aur Kshetradhikar",
    body: [
      "Kraviona Technologies is an AI-first digital engineering and software technology firm founded by Amar Kumar, headquartered in East Delhi, India. We engineer enterprise software, custom AI autonomous agents, SaaS MVPs, cloud architectures, full-stack web applications, and technical search systems for businesses across India and worldwide.",
      "Kraviona Technologies ek AI-first technology company hai jo East Delhi, India se operate karti hai. Hum modern businesses ke liye intelligent software, AI agents, SaaS products, aur digital growth systems build karte hain. Yeh Privacy Policy kraviona.com aur hamare sabhi digital touchpoints par laagu hoti hai.",
    ],
    items: [
      { label: "Entity", text: "Kraviona Technologies" },
      { label: "Founder & Tech Director", text: "Amar Kumar" },
      { label: "Official Website", text: "https://www.kraviona.com" },
      { label: "Official Support Email", text: "kravionatech@gmail.com / contact@kraviona.com" },
      { label: "Phone & WhatsApp", text: "+91 96085 53167" },
      { label: "Operating Jurisdiction", text: "East Delhi, Delhi - 110092, India" },
    ],
  },
  {
    id: "information-we-collect",
    title: "2. What Information We Collect",
    hindiTitle: "Hum Kya Jankari Ikattha Karte Hain",
    body: [
      "We collect information necessary to deliver software engineering consultations, manage client projects, defend our infrastructure from malicious automated bots, and respond to commercial inquiries.",
      "Direct Inquiries & Project Briefs: When you complete our contact forms, request a strategy consultation, or submit a project requirement via lead popups, we collect your full name, business email, phone number, company name, requirement brief, and estimated budget.",
      "Anti-Bot Security & CAPTCHA Verification: To protect our forms and infrastructure from spam, DDOS, and automated scraping, we collect and process cryptographic HMAC challenge tokens (`captchaToken`) and solver timestamps. We do not store biometric data or sensitive identifiers.",
      "Technical & Automated Analytics: When you navigate kraviona.com, our servers log standard technical information including your IP address, browser user-agent, device characteristics, operating system, pages visited, dwell time, and referring domain.",
    ],
    items: [
      {
        label: "Contact & Lead Data",
        text: "Full Name, email address, WhatsApp/phone number, company name, and project requirements.",
      },
      {
        label: "Anti-Bot Verification",
        text: "HMAC-signed CAPTCHA challenge tokens, verification timestamps, and submission validity status.",
      },
      {
        label: "Technical Telemetry",
        text: "IP address, browser version, operating system, screen resolution, and referring URL.",
      },
      {
        label: "Billing & Invoicing",
        text: "Client GSTIN, billing address, and bank transaction confirmation IDs. We never store credit/debit card numbers directly.",
      },
    ],
  },
  {
    id: "ai-privacy",
    title: "3. Artificial Intelligence & Automated Assistant Privacy",
    hindiTitle: "AI Chatbot Aur Automated Assistant Ki Privacy",
    body: [
      "Zero Training on Proprietary Data: Any queries, messages, or technical prompts you submit to Kraviona's AI Assistant or website Chatbot are processed strictly in real-time to answer your questions. Your data is NEVER sold, shared, or used to train public foundation models (such as public OpenAI, Anthropic, or Gemini models).",
      "Local Session Memory: The AI Assistant and cursor-following companion maintain short-term interaction state only within your browser's local memory during your active session. You can clear your conversation anytime using the 'New Chat' or 'Clear' action in the assistant panel.",
      "Page Context Analysis: Interactive cursor text explainers evaluate on-page technical terms using locally compiled dictionaries in your client browser, without transmitting your reading behavior to external advertising networks.",
    ],
    items: [
      {
        label: "Zero Model Training",
        text: "Your prompts and inquiries are never used to train public generative AI foundation models.",
      },
      {
        label: "Local In-Memory Evaluation",
        text: "Page explanations and hover tooltips are generated client-side with zero cross-site surveillance.",
      },
    ],
  },
  {
    id: "cookies",
    title: "4. Cookies & Tracking Technologies Policy",
    hindiTitle: "Cookies Aur Tracking Ki Niti",
    body: [
      "Kraviona uses first-party and third-party cookies and local storage tokens to deliver a secure, responsive browsing experience and to understand aggregated website performance.",
      "What are Cookies? Cookies are small data files placed on your device by your browser. Under the Digital Personal Data Protection Act (DPDP) 2023 and GDPR, we give you full control over non-essential tracking.",
      "Managing Your Preferences: You can update or withdraw your cookie consent at any time by clicking the 'Cookie Preferences' link in the footer of any page on kraviona.com, or by adjusting your browser settings.",
    ],
    items: [
      {
        label: "Strictly Necessary / Security (Always Active)",
        text: "Required for core security, session state, CSRF prevention, and anti-bot CAPTCHA challenge validation (`kraviona_cookie_consent`, `captchaToken`). These cannot be disabled.",
      },
      {
        label: "Performance & Analytics (Optional)",
        text: "Google Analytics 4 cookies (`_ga`, `_ga_*`) that collect anonymous, aggregated traffic statistics to help us measure page speed and content popularity. Only loaded with your consent.",
      },
      {
        label: "Functional & Preferences (Optional)",
        text: "Stores user preferences such as AI assistant launcher state, dismissal of promotional banners, and visual theme settings.",
      },
    ],
  },
  {
    id: "how-we-use-information",
    title: "5. How We Use Your Data",
    hindiTitle: "Aapki Jankari Ka Upyog Kaise Hota Hai",
    body: [
      "We process your personal information exclusively for legitimate, transparent business purposes:",
      "• To evaluate, scope, and deliver agreed software engineering, AI agent development, and technical SEO services.",
      "• To communicate project milestones, provide weekly engineering demos, and issue GST invoices.",
      "• To verify human form submissions and defend against automated fraud or spam attacks.",
      "• To comply with applicable Indian statutory, taxation, and company law obligations.",
      "We never sell, rent, monetize, or trade your personal information with third-party data brokers or marketing aggregators.",
    ],
  },
  {
    id: "data-security",
    title: "6. Security & Infrastructure Safeguards",
    hindiTitle: "Data Suraksha Aur Infrastructure Safeguards",
    body: [
      "We apply enterprise-grade technical and organizational security controls across our systems:",
      "• 256-Bit SSL/TLS Encryption: All data in transit between your browser and our servers is encrypted using modern TLS protocols.",
      "• Strict Role-Based Access Control (RBAC): Production databases and project repositories are restricted to vetted senior engineers with multi-factor authentication.",
      "• Server Firewalls & Rate Limiting: High-frequency spam and malicious automated traffic are blocked at the Nginx and Cloudflare edge layers.",
      "• Secure Backend Validation: All database CRUD operations enforce parameter sanitization, HMAC cryptographic challenge validation, and comprehensive error handling.",
    ],
  },
  {
    id: "your-rights",
    title: "7. Your Rights Under DPDP Act 2023 & GDPR",
    hindiTitle: "Aapke Adhikar (DPDP Act 2023 Aur GDPR Ke Tahat)",
    body: [
      "Under the Digital Personal Data Protection (DPDP) Act 2023 (India), the General Data Protection Regulation (GDPR), and applicable privacy legislation, you have the following rights as a Data Principal:",
      "• Right to Access: Request a summary of the personal data we hold about you and the processing activities undertaken.",
      "• Right to Correction & Erasure: Request the correction of inaccurate data or the deletion of data when it is no longer required for legitimate business purposes.",
      "• Right to Grievance Redressal: Access a dedicated Grievance Officer for prompt resolution of privacy concerns.",
      "• Right to Withdraw Consent: Withdraw your consent for non-essential cookies or marketing communications at any time.",
      "To exercise any of these rights, email our Grievance Officer at kravionatech@gmail.com. We acknowledge requests within 48 hours and resolve them within 30 days.",
    ],
    items: [
      { label: "Right to Access", text: "Receive a transparent summary of your personal information held by Kraviona." },
      { label: "Right to Rectification", text: "Update or correct outdated or incomplete personal records." },
      { label: "Right to Erasure", text: "Request permanent removal of your data where statutory retention is not required." },
      { label: "Right of Grievance Redressal", text: "Expedited dispute resolution through our resident Data Grievance Officer." },
    ],
  },
  {
    id: "data-retention",
    title: "8. Data Retention Policy",
    hindiTitle: "Data Kitne Samay Tak Rakhte Hain",
    body: [
      "We retain personal data only for as long as necessary to fulfill the purpose for which it was gathered:",
      "• Contact & Strategy Inquiries: Retained for up to 2 years to facilitate ongoing communications, after which they are securely archived or purged.",
      "• Client Invoices & GST Tax Records: Retained for 7 years to satisfy mandatory Indian statutory accounting and Goods and Services Tax (GST) requirements.",
      "• Web Server Security Logs: Kept for 90 days for forensic intrusion detection and operational debugging.",
      "• Anti-Bot CAPTCHA Challenge Records: Ephemeral HMAC challenge signatures automatically expire after 10 minutes.",
    ],
  },
  {
    id: "privacy-contact",
    title: "9. Grievance Redressal Officer & Contact Details",
    hindiTitle: "Grievance Officer Aur Sampark Sutra",
    body: [
      "In compliance with the Information Technology Act 2000, the IT (Intermediary Guidelines and Digital Media Ethics Code) Rules 2021, and the DPDP Act 2023, the details of our designated Data Grievance Redressal Officer are as follows:",
    ],
    items: [
      { label: "Grievance Redressal Officer", text: "Amar Kumar" },
      { label: "Designation", text: "Founder & Technical Director" },
      { label: "Company", text: "Kraviona Technologies" },
      { label: "Official Grievance Email", text: "kravionatech@gmail.com / contact@kraviona.com" },
      { label: "Direct Telephone / WhatsApp", text: "+91 96085 53167" },
      { label: "Office Address", text: "East Delhi, Delhi - 110092, India" },
      { label: "Response Window", text: "Acknowledgment within 48 hours; resolution within 30 days" },
    ],
  },
];

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${canonical}#webpage`,
    url: canonical,
    name: "Privacy Policy | Kraviona Technologies",
    description,
    inLanguage: ["en-IN", "hi-Latn"],
    isPartOf: { "@id": `${SITE_URL}/#website` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    datePublished: "2025-06-01",
    dateModified: "2026-11-22",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Privacy Policy",
        item: canonical,
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    email: "kravionatech@gmail.com",
    logo: `${SITE_URL}/full-logo.webp`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-96085-53167",
      contactType: "customer support and privacy grievance",
      email: "kravionatech@gmail.com",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentPage
      title={title}
      hindiTitle="Gopaneeyata Niti Aur Cookie Niyam"
      eyebrow="Legal Documents / Privacy & Data Governance"
      description={description}
      canonical={canonical}
      sections={sections}
      structuredData={structuredData}
      relatedHref="/terms"
      relatedLabel="View Terms"
    />
  );
}
