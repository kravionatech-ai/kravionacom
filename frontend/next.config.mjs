import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */

const scriptSources = [
  "'self'",
  "'unsafe-inline'",
  ...(process.env.NODE_ENV !== "production" ? ["'unsafe-eval'"] : []),
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://www.chatbase.co",
  "https://news.google.com",
  "https:",
].join(" ");

const connectSources = [
  "'self'",
  "https:",
  ...(process.env.NODE_ENV !== "production"
    ? ["http://localhost:5000", "http://127.0.0.1:5000", "http://localhost:3000"]
    : []),
].join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self' https://calendly.com https://wa.me",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://news.google.com",
  `script-src ${scriptSources}`,
  `connect-src ${connectSources}`,
  "frame-src 'self' https:",
].join("; ");

const nextConfig = {
  outputFileTracingRoot: fileURLToPath(new URL("./", import.meta.url)),
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  skipTrailingSlashRedirect: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 80, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
    dangerouslyAllowSVG: false,
    localPatterns: [
      {
        pathname: "/**",
        search: "",
      },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "img.freepik.com" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "api.kraviona.com", pathname: "/**" },
      { protocol: "https", hostname: "kraviona.com", pathname: "/**" },
      { protocol: "https", hostname: "cdn.jsdelivr.net", pathname: "/**" },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "index, follow",
          },
        ],
      },
      {
        source: "/((?!api|_next/static|_next/image|favicon.ico|blog/).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, s-maxage=1800, stale-while-revalidate=3600",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Robots-Tag", value: "index, follow" },
        ],
      },
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/blog/:slug*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/category/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(self), interest-cohort=(), browsing-topics=()",
          },
          {
            key: "Content-Security-Policy",
            value: contentSecurityPolicy,
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/_next/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        source: "/:path(robots.txt|sitemap.xml|rss.xml|llms.txt|ai.txt)",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, follow, noarchive" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/blog/10-benefits-of-artificial-intelligence-essay",
        destination: "/ai-and-automation/10-benefits-of-artificial-intelligence-essay",
        permanent: true,
      },
      {
        source: "/blog/mern-stack-development-company-delhi",
        destination: "/mern-stack/mern-stack-development-company-delhi",
        permanent: true,
      },
      {
        source: "/blog/next-js-vs-react-differences",
        destination: "/mern-stack/next-js-vs-react-differences",
        permanent: true,
      },
      {
        source: "/blog/bGF0ZXN0LW",
        destination: "/ai-news/latest-ai-news-august-2026",
        permanent: true,
      },
      {
        source: "/blog/ai-news-august-2026",
        destination: "/ai-news/latest-ai-news-august-2026",
        permanent: true,
      },
      {
        source: "/web-performance/mern-stack-development-company-in-india",
        destination: "/mern-stack/mern-stack-development-company-in-india",
        permanent: true,
      },
      {
        source: "/next-gen-web-development/why-choosing-a-top-mern-stack-development-company-in-india-changes-the-game",
        destination: "/mern-stack/mern-stack-development-company-in-india",
        permanent: true,
      },
      {
        source: "/mern-stack/mern-stack-development-company-india",
        destination: "/mern-stack/mern-stack-development-company-in-india",
        permanent: true,
      },
      {
        source: "/next-gen-web-development/what-is-mern-stack-the-complete-2026-guide-for-developer",
        destination: "/mern-stack/what-is-mern-stack-2026",
        permanent: true,
      },
      {
        source: "/next-gen-web-development/what-is-mern-stack-the-complete-2026-guide-for-developers",
        destination: "/mern-stack/what-is-mern-stack-2026",
        permanent: true,
      },
      {
        source: "/next-gen-web-development/complete-guide-for-developers",
        destination: "/mern-stack/what-is-mern-stack-2026",
        permanent: true,
      },
      {
        source: "/next-gen-web-development/complete-guide-for-developer",
        destination: "/mern-stack/what-is-mern-stack-2026",
        permanent: true,
      },
      {
        source: "/next-gen-web-development/a-complete-guide-for-developers",
        destination: "/mern-stack/what-is-mern-stack-2026",
        permanent: true,
      },
      {
        source: "/next-gen-web-development/a-complete-guide-for-developer",
        destination: "/mern-stack/what-is-mern-stack-2026",
        permanent: true,
      },
      {
        source: "/what-is-mern-stack-the-complete-2026-guide-for-developer",
        destination: "/mern-stack/what-is-mern-stack-2026",
        permanent: true,
      },
      {
        source: "/what-is-mern-stack-the-complete-2026-guide-for-developers",
        destination: "/mern-stack/what-is-mern-stack-2026",
        permanent: true,
      },
      {
        source: "/mern-stack/what-is-mern-stack",
        destination: "/mern-stack/what-is-mern-stack-2026",
        permanent: true,
      },
      {
        source: "/ai-and-automation/best-ai-automation-company-in-delhi-how-businesses-are-growing-smarter-in-2025",
        destination: "/ai-and-automation/ai-automation-agency-india",
        permanent: true,
      },
      {
        source: "/ai-and-automation/best-ai-automation-company-in-delhi-ncr-india-in-2025",
        destination: "/ai-and-automation/ai-automation-agency-india",
        permanent: true,
      },
      {
        source: "/next-gen-web-development/core-web-vitals-2026-guide",
        destination: "/technical-seo/core-web-vitals-2026-guide",
        permanent: true,
      },
      {
        source: "/services/ecommerce-development",
        destination: "/services/ecommerce-development-marketing",
        permanent: true,
      },
      {
        source: "/services/react-js-development",
        destination: "/services/react-development",
        permanent: true,
      },
      {
        source: "/services/node-js-development",
        destination: "/services/nodejs-development",
        permanent: true,
      },
      {
        source: "/service/:path*",
        destination: "/services/:path*",
        permanent: true,
      },
      {
        source: "/contact-us",
        destination: "/contact",
        permanent: true,
      },
      {
        source: "/terms-and-conditions",
        destination: "/terms",
        permanent: true,
      },
      {
        source: "/privacy",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/ai-trends-august-2026-what-is-changing",
        destination: "/ai-news/ai-trends-august-2026-what-is-changing",
        permanent: true,
      },
      {
        source: "/latest-ai-news-august-2026",
        destination: "/ai-news/latest-ai-news-august-2026",
        permanent: true,
      },
      {
        source: "/ai-agents-2026-autonomous-ai-replacing-traditional-automation",
        destination: "/ai-news/ai-agents-2026-autonomous-ai-replacing-traditional-automation",
        permanent: true,
      },
      {
        source: "/best-ai-tools-for-freelancers-india-2026",
        destination: "/ai-and-automation/best-ai-tools-for-freelancers-india-2026",
        permanent: true,
      },
      {
        source: "/claude-code-vs-cursor-vs-github-copilot-2026-india",
        destination: "/ai-and-automation/claude-code-vs-cursor-vs-github-copilot-2026-india",
        permanent: true,
      },
      {
        source: "/model-context-protocol-mcp-the-complete-2026-guide",
        destination: "/ai-and-automation/model-context-protocol-mcp-the-complete-2026-guide",
        permanent: true,
      },
      {
        source: "/what-is-mern-stack-2026",
        destination: "/mern-stack/what-is-mern-stack-2026",
        permanent: true,
      },
      {
        source: "/what-is-technical-seo-2026",
        destination: "/technical-seo/what-is-technical-seo-2026",
        permanent: true,
      },
      {
        source: "/blog/google-search-traffic-drop-2026",
        destination: "/ai-news/google-search-traffic-drop-2026",
        permanent: true,
      },
      {
        source: "/blog/technical-seo-checklist-2026",
        destination: "/technical-seo/technical-seo-checklist-2026",
        permanent: true,
      },
      {
        source: "/blog/fix-crawl-budget-waste-technical-seo-guide-2026",
        destination: "/technical-seo/fix-crawl-budget-waste-technical-seo-guide-2026",
        permanent: true,
      },
      {
        source: "/blog/benefits-of-artificial-intelligence-in-business",
        destination: "/ai-and-automation/benefits-of-artificial-intelligence-in-business",
        permanent: true,
      },
      {
        source: "/blog/how-to-choose-the-right-tech-stack-for-your-business-2026",
        destination: "/mern-stack/how-to-choose-the-right-tech-stack-for-your-business-2026",
        permanent: true,
      },
      {
        source: "/blog/chatgpt-6-vs-fable-5-1-september-2026",
        destination: "/ai-news/chatgpt-6-vs-fable-5-1-september-2026",
        permanent: true,
      },
      {
        source: "/blog/tokenized-real-world-assets-blockchain-2026",
        destination: "/blockchain/tokenized-real-world-assets-blockchain-2026",
        permanent: true,
      },
      {
        source: "/blog/best-ai-personal-finance-apps-2026",
        destination: "/ai-news/best-ai-personal-finance-apps-2026",
        permanent: true,
      },
      {
        source: "/blog/ai-agents-india-2026",
        destination: "/ai-news/ai-agents-india-2026",
        permanent: true,
      },
      {
        source: "/blog/nvidia-acquires-hugging-face-12-9-billion-open-source-ai-india",
        destination: "/ai-news/nvidia-acquires-hugging-face-12-9-billion-open-source-ai-india",
        permanent: true,
      },
      {
        source: "/blog/zero-trust-security-guide-2026",
        destination: "/ai-and-automation/zero-trust-security-guide-2026",
        permanent: true,
      },
      {
        source: "/blog/deploy-nodejs-app-aws-complete-guide-2026",
        destination: "/devops-and-cloud/deploy-nodejs-app-aws-complete-guide-2026",
        permanent: true,
      },
      {
        source: "/blog/chatgpt-ads-india-2026-what-it-means",
        destination: "/ai-news/chatgpt-ads-india-2026-what-it-means",
        permanent: true,
      },
      {
        source: "/blog/lt-india-largest-ai-factory-nvidia-b300-chennai-together-ai",
        destination: "/ai-news/lt-india-largest-ai-factory-nvidia-b300-chennai-together-ai",
        permanent: true,
      },
      {
        source: "/blog/keyword-research-for-seo-complete-guide",
        destination: "/technical-seo/keyword-research-for-seo-complete-guide",
        permanent: true,
      },
      {
        source: "/blog/google-adsense-approval-in-india-2026",
        destination: "/ai-and-automation/google-adsense-approval-in-india-2026",
        permanent: true,
      },
      {
        source: "/blog/best-ai-tools-for-freelancers-india-2026",
        destination: "/ai-and-automation/best-ai-tools-for-freelancers-india-2026",
        permanent: true,
      },
      {
        source: "/blog/chatgpt-plus-price-india-2026-gpt-56-plans-inr",
        destination: "/ai-news/chatgpt-plus-price-india-2026-gpt-56-plans-inr",
        permanent: true,
      },
      {
        source: "/blog/vibe-coding-kya-hai-2026-guide-india",
        destination: "/ai-news/vibe-coding-kya-hai-2026-guide-india",
        permanent: true,
      },
      {
        source: "/blog/claude-code-vs-cursor-vs-github-copilot-2026-india",
        destination: "/ai-and-automation/claude-code-vs-cursor-vs-github-copilot-2026-india",
        permanent: true,
      },
      {
        source: "/blog/github-down-august-2026-outage-what-happened",
        destination: "/ai-news/github-down-august-2026-outage-what-happened",
        permanent: true,
      },
      {
        source: "/blog/ai-trends-august-2026-what-is-changing",
        destination: "/ai-news/ai-trends-august-2026-what-is-changing",
        permanent: true,
      },
      {
        source: "/blog/javascript-vs-typescript-the-real-difference",
        destination: "/mern-stack/javascript-vs-typescript-the-real-difference",
        permanent: true,
      },
      {
        source: "/blog/latest-ai-news-august-2026",
        destination: "/ai-news/latest-ai-news-august-2026",
        permanent: true,
      },
      {
        source: "/blog/ai-agents-2026-autonomous-ai-replacing-traditional-automation",
        destination: "/ai-news/ai-agents-2026-autonomous-ai-replacing-traditional-automation",
        permanent: true,
      },
      {
        source: "/blog/nvidia-250-billion-ai-supremacy-race-2026",
        destination: "/ai-news/nvidia-250-billion-ai-supremacy-race-2026",
        permanent: true,
      },
      {
        source: "/blog/ai-chatbots-guide",
        destination: "/next-gen-web-development/ai-chatbots-guide",
        permanent: true,
      },
      {
        source: "/blog/machine-learning-the-technology-that-is-changing-the-future",
        destination: "/next-gen-web-development/machine-learning-the-technology-that-is-changing-the-future",
        permanent: true,
      },
      {
        source: "/blog/what-is-mern-stack-the-complete-2026-guide-for-developers",
        destination: "/mern-stack/what-is-mern-stack-2026",
        permanent: true,
      },
      {
        source: "/blog/web3-gaming-2026-play-to-earn-play-and-own-india",
        destination: "/web-3-development/web3-gaming-2026-play-to-earn-play-and-own-india",
        permanent: true,
      },
      {
        source: "/blog/web3-trends-2026-rwa-depin-ai-blockchain-india",
        destination: "/web-3-development/web3-trends-2026-rwa-depin-ai-blockchain-india",
        permanent: true,
      },
      {
        source: "/blog/core-web-vitals-2026-guide",
        destination: "/technical-seo/core-web-vitals-2026-guide",
        permanent: true,
      },
      {
        source: "/blog/blockchain-development-indian-businesses-guide-2026",
        destination: "/blockchain/blockchain-development-indian-businesses-guide-2026",
        permanent: true,
      },
      {
        source: "/blog/java-full-stack-developer-roadmap-2026-how-to-actually-get-job-ready",
        destination: "/technology-and-programming/java-full-stack-developer-roadmap-2026-how-to-actually-get-job-ready",
        permanent: true,
      },
      {
        source: "/blog/best-web3-development-tools-in-2026-the-real-stack-not-another-recycled-list",
        destination: "/web-3-development/best-web3-development-tools-in-2026-the-real-stack-not-another-recycled-list",
        permanent: true,
      },
      {
        source: "/blog/model-context-protocol-mcp-the-complete-2026-guide",
        destination: "/ai-and-automation/model-context-protocol-mcp-the-complete-2026-guide",
        permanent: true,
      },
      {
        source: "/blog/mern-stack-for-enterprise-and-business-applications-a-practical-2026-guide",
        destination: "/mern-stack/mern-stack-for-enterprise-and-business-applications-a-practical-2026-guide",
        permanent: true,
      },
      {
        source: "/blog/web3-for-businesses-a-practical-2026-guide-to-why-and-how-to-adopt-it",
        destination: "/web-3-development/web3-for-businesses-a-practical-2026-guide-to-why-and-how-to-adopt-it",
        permanent: true,
      },
      {
        source: "/blog/mern-stack-interview-questions-2026",
        destination: "/mern-stack/mern-stack-interview-questions-2026",
        permanent: true,
      },
      {
        source: "/blog/reactjs-development-company-india",
        destination: "/mern-stack/reactjs-development-company-india",
        permanent: true,
      },
      {
        source: "/blog/what-is-web3-complete-guide-decentralized-internet",
        destination: "/ai-and-automation/what-is-web3-complete-guide-decentralized-internet",
        permanent: true,
      },
      {
        source: "/blog/ai-in-healthcare-guide-2026",
        destination: "/ai-and-automation/ai-in-healthcare-guide-2026",
        permanent: true,
      },
      {
        source: "/blog/java-full-stack-development-for-businesses-cost-hiring-and-when-its-the-right-call",
        destination: "/next-gen-web-development/java-full-stack-development-for-businesses-cost-hiring-and-when-its-the-right-call",
        permanent: true,
      },
      {
        source: "/blog/top-programming-languages-to-learn-2026",
        destination: "/technology-and-programming/top-programming-languages-to-learn-2026",
        permanent: true,
      },
      {
        source: "/blog/technical-seo-agency-delhi",
        destination: "/technical-seo/technical-seo-agency-delhi",
        permanent: true,
      },
      {
        source: "/blog/mern-stack-vs-mean-stack-2026",
        destination: "/mern-stack/mern-stack-vs-mean-stack-2026",
        permanent: true,
      },
      {
        source: "/blog/hire-mern-stack-developer-india",
        destination: "/mern-stack/hire-mern-stack-developer-india",
        permanent: true,
      },
      {
        source: "/blog/web3-explained-what-it-is-how-it-works-india-2026",
        destination: "/web-3-development/web3-explained-what-it-is-how-it-works-india-2026",
        permanent: true,
      },
      {
        source: "/blog/ai-chatbot-development-company-india",
        destination: "/ai-and-automation/ai-chatbot-development-company-india",
        permanent: true,
      },
      {
        source: "/blog/whatsapp-automation-for-business-india",
        destination: "/ai-and-automation/whatsapp-automation-for-business-india",
        permanent: true,
      },
      {
        source: "/blog/how-to-use-ai-in-real-estate",
        destination: "/next-gen-web-development/how-to-use-ai-in-real-estate",
        permanent: true,
      },
      {
        source: "/blog/n8n-automation-agency-india",
        destination: "/ai-and-automation/n8n-automation-agency-india",
        permanent: true,
      },
      {
        source: "/blog/ai-workflow-automation-for-businesses",
        destination: "/ai-and-automation/ai-workflow-automation-for-businesses",
        permanent: true,
      },
      {
        source: "/blog/best-ai-automation-company-in-delhi-how-businesses-are-growing-smarter-in-2025",
        destination: "/ai-and-automation/ai-automation-agency-india",
        permanent: true,
      },
      {
        source: "/blog/ai-automation-agency-india",
        destination: "/ai-and-automation/ai-automation-agency-india",
        permanent: true,
      },
      {
        source: "/blog/what-is-mern-stack-2026",
        destination: "/mern-stack/what-is-mern-stack-2026",
        permanent: true,
      },
      {
        source: "/blog/what-is-technical-seo-2026",
        destination: "/technical-seo/what-is-technical-seo-2026",
        permanent: true,
      },
      {
        source: "/blog/mern-stack-development-company-in-india",
        destination: "/mern-stack/mern-stack-development-company-in-india",
        permanent: true,
      },
      {
        source: "/blog/how-to-use-chatgpt-for-business",
        destination: "/ai-and-automation/how-to-use-chatgpt-for-business",
        permanent: true,
      },
      {
        source: "/blog/ai-tools-for-small-business",
        destination: "/ai-and-automation/ai-tools-for-small-business",
        permanent: true,
      },
      {
        source: "/blog/why-choosing-a-top-mern-stack-development-company-in-india-changes-the-game",
        destination: "/mern-stack/mern-stack-development-company-in-india",
        permanent: true,
      },
      {
        source: "/blog/what-is-mern-stack-the-complete-2026-guide-for-developer",
        destination: "/mern-stack/what-is-mern-stack-2026",
        permanent: true,
      },
      {
        source: "/blog/website-development-company-in-delhi",
        destination: "/next-gen-web-development/website-development-company-in-delhi",
        permanent: true,
      },
      {
        source: "/blog/ai-driven-seo-machine-learning-organic-search-2026",
        destination: "/ai-and-automation/ai-driven-seo-machine-learning-organic-search-2026",
        permanent: true,
      },
      {
        source: "/blog/ai-revolutionizing-full-stack-web-development-2026",
        destination: "/ai-and-automation/ai-revolutionizing-full-stack-web-development-2026",
        permanent: true,
      },
      {
        source: "/blog/rise-of-autonomous-ai-agents-2026-essay",
        destination: "/ai-and-automation/rise-of-autonomous-ai-agents-2026-essay",
        permanent: true,
      },
      {
        source: "/blog/ultimate-mern-stack-developer-roadmap-2026",
        destination: "/next-gen-web-development/ultimate-mern-stack-developer-roadmap-2026",
        permanent: true,
      },
      {
        source: "/blog/10-game-changing-benefits-of-web3-the-future-of-ownership",
        destination: "/web-3-development/10-game-changing-benefits-of-web3-the-future-of-ownership",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;