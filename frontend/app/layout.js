import "./globals.css";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

import { Suspense } from "react";
import Script from "next/script";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import GAPageTracker from "@/components/GAPageTracker";
import { JsonLd } from "@/components/JsonLd";
import ThirdPartyScripts from "@/components/ThirdPartyScripts";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import KravionaAIAssistant from "@/components/AIAssistant/KravionaAIAssistant";
import SiteEventPopup from "@/components/Events/SiteEventPopup";
import { rootGraphSchema } from "@/lib/schema";

import {
  SITE_URL,
  SITE_NAME,
  SITE_TWITTER,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  defaultRobots,
} from "./seoConfig.js";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f5960" },
    { media: "(prefers-color-scheme: dark)", color: "#0a454b" },
  ],
};

/* SEO Metadata */
export const metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Kraviona — AI-First Technology & Digital Solutions Company",
    template: "%s | Kraviona",
  },

  description:
    "Kraviona is an AI-first technology company building intelligent software, AI agents, SaaS products, and automated digital solutions that help businesses scale.",

  authors: [
    {
      name: "Kraviona",
      url: SITE_URL,
    },
  ],

  creator: "Kraviona",

  publisher: "Kraviona",

  robots: defaultRobots,

  openGraph: {
    type: "website",

    locale: "en_IN",

    url: SITE_URL,

    title: "Kraviona — AI-First Technology & Digital Solutions Company",

    description:
      "Building Intelligent Businesses Through AI, Technology & Automation. Kraviona builds intelligent software, AI agents, SaaS products, and automated digital systems.",

    siteName: "Kraviona",

    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: DEFAULT_OG_IMAGE_ALT,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    site: SITE_TWITTER,

    creator: SITE_TWITTER,

    title: "Kraviona — AI-First Technology & Digital Solutions Company",

    description:
      "Building Intelligent Businesses Through AI, Technology & Automation. Custom AI agents, intelligent software, and enterprise automation.",

    images: [DEFAULT_OG_IMAGE],
  },

  alternates: {
    languages: {
      "en-IN": SITE_URL,
    },
    types: {
      "application/rss+xml": `${SITE_URL}/rss.xml`,
      "text/plain": `${SITE_URL}/llms.txt`,
    },
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/site.webmanifest",

  verification: {
    google: "yYmrp2HizDB-EGRruieHxpCxHFLCqmFsQblkGULJHtc",
  },

  other: {
    "google-adsense-account": "ca-pub-2639855770462648",
  },

  category: "technology",
  classification: "AI-First Technology & Digital Solutions",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${plusJakartaSans.variable} ${inter.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://api.kraviona.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://api.kraviona.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link
          rel="preconnect"
          href="https://pagead2.googlesyndication.com"
          crossOrigin="anonymous"
        />
        <link
          rel="dns-prefetch"
          href="https://pagead2.googlesyndication.com"
        />
        <Script
          id="google-adsense"
          async
          strategy="lazyOnload"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2639855770462648"
          crossOrigin="anonymous"
        />
      </head>

      <body className="font-sans antialiased bg-[#F7F5F1] text-[#5A7A82]">
        <Suspense fallback={null}>
          <GAPageTracker />
        </Suspense>
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[100] rounded-lg bg-primary px-4 py-3 font-bold text-white focus:not-sr-only focus:outline-none focus:ring-4 focus:ring-accent/40"
        >
          Skip to main content
        </a>
        <JsonLd data={rootGraphSchema} />

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5LX2JWGD"
            height="0"
            width="0"
            style={{
              display: "none",
              visibility: "hidden",
            }}
          />
        </noscript>

        <Header />

        <main id="main-content">{children}</main>

        <Footer />

        <SiteEventPopup />
        <WhatsAppFloat />
        <KravionaAIAssistant />
        <ThirdPartyScripts />

      </body>
    </html>
  );
}
