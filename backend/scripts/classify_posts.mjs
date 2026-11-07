import fs from "fs";

const posts = JSON.parse(fs.readFileSync("backend/scripts/posts_inventory.json", "utf8"));

const analysis = posts.map((p, idx) => {
  const t = p.title.toLowerCase();
  const s = p.slug.toLowerCase();

  let recommendation = "KEEP";
  let reason = "";
  let destUrl = "";
  let seoRisk = "Low";

  // Check for duplicate / cannibalizing / outdated topics
  // Case 1: Redundant MERN Stack guides
  if (s.includes("what-is-mern-stack-the-complete-2026-guide-for-developer")) {
    recommendation = "MERGE";
    reason = "Exact topic and search intent redundancy with authoritative primary article 'what-is-mern-stack-2026'.";
    destUrl = "https://www.kraviona.com/mern-stack/what-is-mern-stack-2026";
    seoRisk = "Medium (Preserve query equity via 301 redirect)";
  } else if (s.includes("why-choosing-a-top-mern-stack-development-company-in-india-changes-the-game")) {
    recommendation = "MERGE";
    reason = "Cannibalizes commercial keyword 'MERN stack development company in India' with target landing article.";
    destUrl = "https://www.kraviona.com/mern-stack/mern-stack-development-company-in-india";
    seoRisk = "Medium";
  } else if (s.includes("best-ai-automation-company-in-delhi-how-businesses-are-growing-smarter-in-2025")) {
    recommendation = "REDIRECT";
    reason = "Outdated 2025 regional keyword post. Consolidate into authoritative evergreen AI automation hub.";
    destUrl = "https://www.kraviona.com/ai-and-automation/ai-automation-agency-india";
    seoRisk = "Medium";
  } else if (p.status === "draft") {
    recommendation = "HOLD FOR MORE DATA";
    reason = "Draft status in database. Verify publication intent and quality before indexing or retiring.";
    seoRisk = "Zero (Unpublished)";
  } else if (p.type === "news") {
    // Phase 5 News cleanup rules
    if (s.includes("august-2026") || s.includes("outage") || s.includes("down")) {
      recommendation = "HOLD FOR MORE DATA";
      reason = "Time-sensitive monthly news / outage report. Check GSC impressions before deciding to archive or convert to historical engineering case study.";
      seoRisk = "Medium";
    } else if (s.includes("nvidia") || s.includes("ai-agents") || s.includes("trends") || s.includes("openai") || s.includes("model")) {
      recommendation = "UPDATE";
      reason = "Strategic industry analysis news. Update into evergreen Kraviona Insights article with authoritative commentary and links to AI services.";
      seoRisk = "Low (Content enhancement)";
    } else {
      recommendation = "HOLD FOR MORE DATA";
      reason = "News post requiring GSC click/impression verification to measure historical organic search demand.";
      seoRisk = "Medium";
    }
  } else if (
    s.includes("essay") ||
    s.includes("10-benefits-of-artificial-intelligence-essay") ||
    s.includes("rise-of-autonomous-ai-agents-2026-essay")
  ) {
    recommendation = "UPDATE";
    reason = "Contains 'essay' in slug/title from academic origin. Reposition as professional B2B whitepaper/insights guide, optimize for commercial intent, add FAQs and CTA to AI Agent service page.";
    seoRisk = "Low (Preserve original slug, update internal text & title tag)";
  } else if (
    s.includes("web-3") ||
    s.includes("web3") ||
    s.includes("blockchain")
  ) {
    // Check if Web3 aligns with core Kraviona pillars
    recommendation = "HOLD FOR MORE DATA";
    reason = "Web3/Blockchain topic. Kraviona's primary focus is AI & Software Development. Hold to verify existing Google rankings/backlinks before deciding whether to retain as secondary tech authority or retire.";
    seoRisk = "Medium";
  } else if (
    s.includes("ai-automation") ||
    s.includes("ai-agent") ||
    s.includes("ai-chatbot") ||
    s.includes("autonomous") ||
    s.includes("technical-seo") ||
    s.includes("mern-stack") ||
    s.includes("nextjs") ||
    s.includes("full-stack")
  ) {
    // Core pillar posts!
    if (p.wordCount < 800 || p.internalLinksCount < 2) {
      recommendation = "UPDATE";
      reason = "Core AI/IT/SEO vertical post. Expand depth, humanize tone, add FAQ schema and contextual links to relevant service pages.";
      seoRisk = "Low (Improvement)";
    } else {
      recommendation = "KEEP";
      reason = "High-relevance flagship article aligned with Kraviona's AI-first technology positioning and strong word count.";
      seoRisk = "Zero (Maintained intact)";
    }
  } else {
    recommendation = "HOLD FOR MORE DATA";
    reason = "Requires Google Search Console impressions, clicks, and backlink audit to assess organic equity before finalizing.";
    seoRisk = "Medium";
  }

  return {
    ...p,
    recommendation,
    reason,
    destUrl,
    seoRisk
  };
});

// Group by recommendation
const groups = {
  KEEP: [],
  UPDATE: [],
  MERGE: [],
  REDIRECT: [],
  REMOVE: [],
  "HOLD FOR MORE DATA": []
};

analysis.forEach(a => {
  if (!groups[a.recommendation]) groups[a.recommendation] = [];
  groups[a.recommendation].push(a);
});

console.log("Summary Counts:");
Object.keys(groups).forEach(k => {
  console.log(`${k}: ${groups[k].length}`);
});

fs.writeFileSync("backend/scripts/posts_classification.json", JSON.stringify(analysis, null, 2), "utf8");
console.log("Saved posts_classification.json");
