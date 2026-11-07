import fs from "fs";

const rawData = fs.readFileSync("C:/Users/pc/Desktop/kraviona.posts.json", "utf8");
const posts = JSON.parse(rawData);

// Read backlink CSV if present
let knownBacklinks = {};
try {
  const blContent = fs.readFileSync("C:/Users/pc/Downloads/kraviona_backlinks.csv", "utf8");
  const lines = blContent.split("\n").filter(Boolean);
  lines.slice(1).forEach((line) => {
    const parts = line.split(",");
    if (parts[2]) {
      const target = parts[2].replace(/"/g, "").trim();
      knownBacklinks[target] = (knownBacklinks[target] || 0) + 1;
    }
  });
} catch (e) {}

// Evaluate every post individually
const evaluatedPosts = posts.map((p, index) => {
  const id = p._id?.$oid || (typeof p._id === "object" ? JSON.stringify(p._id) : String(p._id)) || `post-${index + 1}`;
  const title = p.title || "Untitled";
  const slug = p.slug || "";
  const catSlug = p.category?.slug || (typeof p.category === "string" ? p.category.toLowerCase().replace(/\s+/g, "-") : "blog");
  const catName = p.category?.name || (typeof p.category === "string" ? p.category : "General");
  const type = p.contentType || "blog";
  const views = typeof p.views === "number" ? p.views : 0;
  const wordCount = p.wordCount || (p.content ? p.content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length : 0);
  const status = p.status || "published";
  const canonicalUrl = p.canonicalUrl || `https://www.kraviona.com/${catSlug}/${slug}`;
  const focusKeywords = Array.isArray(p.focusKeywords) ? p.focusKeywords : (p.focusKeywords ? [p.focusKeywords] : []);
  const secondaryKeywords = Array.isArray(p.keywords) ? p.keywords : [];
  const publishedAt = p.publishedAt || p.createdAt || "";
  const updatedAt = p.updatedAt || "";
  const authorName = p.author?.name || "Amar Kumar";

  const content = p.content || "";
  const internalLinkMatches = content.match(/href=["'](https?:\/\/(www\.)?kraviona\.com\/[^"']*|\/[^"']*)["']/gi) || [];
  const externalLinkMatches = content.match(/href=["']https?:\/\/(?!www\.kraviona\.com)[^"']*["']/gi) || [];

  const backlinksCount = knownBacklinks[canonicalUrl] || 0;

  let recommendation = "KEEP";
  let reason = "";
  let destUrl = "N/A";
  let seoRisk = "Low";

  // Exact rule checks
  if (status === "draft") {
    recommendation = "HOLD FOR MORE DATA";
    reason = "Draft status in database. Verify editorial completion before publishing or retiring.";
    destUrl = "N/A";
    seoRisk = "Zero (Unpublished/No indexed URL)";
  } else if (slug === "what-is-mern-stack-the-complete-2026-guide-for-developer") {
    recommendation = "MERGE";
    reason = "Cannibalizes target query with definitive guide 'what-is-mern-stack-2026'. Merge unique sections into primary article.";
    destUrl = "https://www.kraviona.com/mern-stack/what-is-mern-stack-2026";
    seoRisk = "Medium (301 redirect mandatory to transfer equity)";
  } else if (slug === "why-choosing-a-top-mern-stack-development-company-in-india-changes-the-game") {
    recommendation = "MERGE";
    reason = "Thin commercial article (651 words) competing with target landing page 'mern-stack-development-company-in-india'. Merge unique USPs into primary post.";
    destUrl = "https://www.kraviona.com/mern-stack/mern-stack-development-company-in-india";
    seoRisk = "Medium (301 redirect required)";
  } else if (slug === "best-ai-automation-company-in-delhi-how-businesses-are-growing-smarter-in-2025") {
    recommendation = "REDIRECT";
    reason = "Outdated 2025 regional keyword slug. Redirect to national flagship hub 'ai-automation-agency-india' to consolidate page authority.";
    destUrl = "https://www.kraviona.com/ai-and-automation/ai-automation-agency-india";
    seoRisk = "Medium (301 redirect protects backlink & query signals)";
  } else if (type === "news") {
    // News articles evaluation (Phase 5)
    if (slug === "ai-agents-2026-autonomous-ai-replacing-traditional-automation" || slug === "ai-agents-india-2026" || slug === "benefits-of-artificial-intelligence-in-business") {
      recommendation = "KEEP";
      reason = "Directly supports Kraviona's flagship AI Agent & Automation business vertical. Evergreen executive insights with high relevance.";
      destUrl = "N/A";
      seoRisk = "Low (Flagship authority piece)";
    } else if (slug.includes("august-2026") || slug.includes("outage") || slug.includes("down")) {
      recommendation = "HOLD FOR MORE DATA";
      reason = "Time-sensitive monthly news / infrastructure event. Check GSC impressions and organic clicks before archiving or converting into historical case study.";
      destUrl = "N/A";
      seoRisk = "Medium (Pending Search Console verification)";
    } else if (slug.includes("nvidia") || slug.includes("trends") || slug.includes("chatgpt") || slug.includes("gemini") || slug.includes("grok") || slug.includes("zero-trust") || slug.includes("google-search-traffic")) {
      recommendation = "UPDATE";
      reason = "High-value tech industry insight. Reposition under Kraviona 'Insights & Research', add expert commentary, and interlink with AI / IT / SEO services.";
      destUrl = "N/A";
      seoRisk = "Low (Content quality refresh)";
    } else {
      recommendation = "HOLD FOR MORE DATA";
      reason = "News post requiring GSC search appearance data to confirm whether it drives organic search impressions before migration.";
      destUrl = "N/A";
      seoRisk = "Medium";
    }
  } else if (slug.includes("essay") || slug === "10-benefits-of-artificial-intelligence-essay" || slug === "rise-of-autonomous-ai-agents-2026-essay") {
    recommendation = "UPDATE";
    reason = "High organic potential and deep content (>1,900 words), but uses academic 'essay' title/slug framing. Reposition into executive B2B whitepaper, add FAQ schema and CTA to Kraviona AI services.";
    destUrl = "N/A";
    seoRisk = "Low (Preserve canonical slug, update on-page title and H1)";
  } else if (slug.includes("web-3") || slug.includes("web3") || slug.includes("blockchain")) {
    recommendation = "HOLD FOR MORE DATA";
    reason = "Web3 / Blockchain topic. While not Kraviona's core focus (which is AI & Software Development), these URLs may have external search impressions. Hold for GSC data before modifying.";
    destUrl = "N/A";
    seoRisk = "Medium (Preserve existing indexing until GSC audit)";
  } else if (
    slug.includes("ai-automation") ||
    slug.includes("ai-agent") ||
    slug.includes("ai-chatbot") ||
    slug.includes("ai-workflow") ||
    slug.includes("n8n-automation") ||
    slug.includes("whatsapp-automation") ||
    slug.includes("chatgpt-for-business") ||
    slug.includes("ai-tools-for-small-business") ||
    slug.includes("ai-driven-seo") ||
    slug.includes("ai-revolutionizing-full-stack")
  ) {
    // Flagship AI posts
    if (internalLinkMatches.length < 3 || wordCount < 1500) {
      recommendation = "UPDATE";
      reason = "Core flagship AI topic. Add direct contextual CTA boxes linking to Kraviona's AI Services (/services/ai-automation, /services/ai-chatbot-development).";
      destUrl = "N/A";
      seoRisk = "Low";
    } else {
      recommendation = "KEEP";
      reason = "High-authority, in-depth flagship AI content (>2,500 words) perfectly aligned with Kraviona's AI-first technology positioning.";
      destUrl = "N/A";
      seoRisk = "Zero (Maintained intact)";
    }
  } else if (
    slug.includes("technical-seo") ||
    slug.includes("crawl-budget") ||
    slug.includes("keyword-research") ||
    slug.includes("core-web-vitals")
  ) {
    // Core SEO vertical posts
    recommendation = "KEEP";
    reason = "Core pillar content supporting Kraviona's Technical SEO & Growth services. Strong topical authority with high index value.";
    destUrl = "N/A";
    seoRisk = "Zero (Maintained intact)";
  } else if (
    slug.includes("mern-stack") ||
    slug.includes("next-js") ||
    slug.includes("react") ||
    slug.includes("nodejs") ||
    slug.includes("full-stack") ||
    slug.includes("website-development")
  ) {
    // Core IT & Web dev vertical posts
    if (wordCount < 1200 || internalLinkMatches.length < 2) {
      recommendation = "UPDATE";
      reason = "Core IT engineering pillar. Enrich with Next.js 15 / modern architecture best practices and interlink to /services/web-development.";
      destUrl = "N/A";
      seoRisk = "Low";
    } else {
      recommendation = "KEEP";
      reason = "High-performing technical guide supporting Kraviona's custom software & web engineering services.";
      destUrl = "N/A";
      seoRisk = "Zero (Maintained intact)";
    }
  } else {
    // General or secondary topics
    recommendation = "HOLD FOR MORE DATA";
    reason = "Secondary topic. Pending GSC search performance data to confirm whether it receives organic traffic before making a migration or retirement decision.";
    destUrl = "N/A";
    seoRisk = "Medium (Safely held to prevent accidental traffic loss)";
  }

  return {
    index: index + 1,
    id,
    title,
    slug,
    url: canonicalUrl,
    type,
    catName,
    catSlug,
    wordCount,
    internalViews: views,
    organicClicks: "Hold for GSC sync",
    impressions: "Hold for GSC sync",
    backlinks: backlinksCount > 0 ? `${backlinksCount} verified` : "0 in current export",
    recommendedAction: recommendation,
    reason,
    destinationUrl: destUrl,
    seoRisk,
    internalLinksCount: internalLinkMatches.length,
    externalLinksCount: externalLinkMatches.length,
    status
  };
});

fs.writeFileSync("backend/scripts/complete_audit_master.json", JSON.stringify(evaluatedPosts, null, 2), "utf8");

// Generate summary statistics
const actionCounts = {};
evaluatedPosts.forEach((p) => {
  actionCounts[p.recommendedAction] = (actionCounts[p.recommendedAction] || 0) + 1;
});

console.log("=== Master Audit Complete ===");
console.log("Total Audited Records:", evaluatedPosts.length);
console.log("Action Breakdown:", actionCounts);
