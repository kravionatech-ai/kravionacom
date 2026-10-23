/**
 * AssistantPageContext.js
 * Scoped content extraction and route-level understanding for Kraviona.com
 */

export function extractPageContext() {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return {
      title: "Kraviona Tech Solutions",
      url: "/",
      headings: [],
      contentSnippet: "",
    };
  }

  const url = window.location.pathname;
  const title = document.title || "Kraviona Tech Solutions";
  const h1 = document.querySelector("h1")?.innerText?.trim() || "";

  const headings = Array.from(document.querySelectorAll("h1, h2, h3"))
    .map((el) => el.innerText?.trim())
    .filter(Boolean)
    .slice(0, 8);

  // Extract main readable content, strictly ignoring navigation, footers, scripts, and hidden blocks
  const mainEl = document.querySelector("main") || document.querySelector("article") || document.body;
  const clone = mainEl.cloneNode(true);

  // Strip non-content elements
  const ignoreSelectors = [
    "nav",
    "header",
    "footer",
    "script",
    "style",
    "noscript",
    "iframe",
    ".sr-only",
    "[aria-hidden='true']",
    "button",
    "input",
    "textarea",
  ];
  ignoreSelectors.forEach((sel) => {
    clone.querySelectorAll(sel).forEach((el) => el.remove());
  });

  const fullText = (clone.textContent || "")
    .replace(/\s+/g, " ")
    .trim();

  return {
    url,
    title,
    h1,
    headings,
    fullText,
    contentSnippet: fullText.slice(0, 1500),
  };
}

export function getRouteAnnouncement(pathname = "/") {
  const path = pathname.toLowerCase();

  if (path === "/") {
    return "Welcome to Kraviona Tech Solutions. I'm your AI assistant. You can ask me about our web engineering, technical SEO, or book a strategy call.";
  }
  if (path.startsWith("/services/nextjs-development")) {
    return "You're viewing our Next.js Development service. We build high-velocity React applications with server components and 90 plus PageSpeed scores.";
  }
  if (path.startsWith("/services/mern-stack-development")) {
    return "You're exploring our MERN Stack Development services. We architect enterprise applications with React, Node.js, Express, and MongoDB.";
  }
  if (path.startsWith("/services/technical-seo")) {
    return "Welcome to our Technical SEO service page. We help businesses resolve crawl bottlenecks, pass Core Web Vitals, and dominate search rankings.";
  }
  if (path.startsWith("/services/ai-automation")) {
    return "You're viewing our AI Automation and Workflows service. We engineer custom LLM pipelines, autonomous agents, and intelligent chatbots.";
  }
  if (path.startsWith("/services")) {
    return "Welcome to Kraviona's Services hub. Explore our web development, cloud architectures, and SEO solutions, or ask me for a recommendation.";
  }
  if (path.startsWith("/about")) {
    return "You're on the About Kraviona page. Learn about our founder-led engineering culture, agency roots in Delhi NCR, and client commitment.";
  }
  if (path.startsWith("/contact")) {
    return "You're on the Contact page. You can fill out the inquiry form or book a free 30-minute discovery consultation. I'm happy to help you fill it out!";
  }
  if (path.startsWith("/case-studies")) {
    return "Welcome to our Case Studies portfolio. Explore real client transformations, architectural scale-ups, and verified SEO results.";
  }
  if (path.startsWith("/blog")) {
    return "Welcome to the Kraviona Engineering & SEO Blog. You can click Read Page or select any paragraph to have me read it aloud.";
  }

  // Fallback using document title
  const context = extractPageContext();
  if (context.h1) {
    return `You're viewing ${context.h1}. Feel free to ask me questions or request a summary.`;
  }
  return "Welcome to Kraviona. How can I assist your project today?";
}

export function getSelectedText() {
  if (typeof window === "undefined") return "";
  const selection = window.getSelection();
  return selection ? selection.toString().trim() : "";
}
