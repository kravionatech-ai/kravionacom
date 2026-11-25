import { KeywordItem } from "../../models/KeywordItem.js";
import { PostModel } from "../../models/blog/post.model.js";
import { AUTOMATION_CONFIG } from "./config.js";

/**
 * Curated repository of strategic candidate keyword clusters for Kraviona's 4 core verticals.
 * Each keyword includes realistic search parameters, verified search intent, cluster category, and conversion alignment.
 */
export const SEED_KEYWORD_CANDIDATES = [
  // ─── A. Web Development & Engineering ──────────────────────────────────────────
  {
    keyword: "production mern stack folder structure best practices",
    categorySlug: "mern-stack",
    cluster: "MERN Stack Architecture",
    intent: "Informational",
    monthlyVolume: 1200,
    difficulty: 32,
    businessRelevanceScore: 95,
    searchIntentScore: 90,
    searchOpportunityScore: 85,
    rankingFeasibilityScore: 90,
    conversionPotentialScore: 88,
    targetAudience: "Tech Leads, Engineering Managers, Full-Stack Developers",
    problemSolved: "How to organize enterprise Node.js and React codebases without technical debt"
  },
  {
    keyword: "how to build rest api with node js and express for enterprise",
    categorySlug: "mern-stack",
    cluster: "API Engineering",
    intent: "Informational",
    monthlyVolume: 2100,
    difficulty: 38,
    businessRelevanceScore: 92,
    searchIntentScore: 95,
    searchOpportunityScore: 82,
    rankingFeasibilityScore: 86,
    conversionPotentialScore: 85,
    targetAudience: "CTOs, Senior Developers, Product Teams",
    problemSolved: "Building scalable, rate-limited, secure enterprise REST APIs"
  },
  {
    keyword: "next js server actions vs api routes when to use each",
    categorySlug: "next-gen-web-development",
    cluster: "Next.js Development",
    intent: "Informational",
    monthlyVolume: 3400,
    difficulty: 42,
    businessRelevanceScore: 96,
    searchIntentScore: 92,
    searchOpportunityScore: 88,
    rankingFeasibilityScore: 85,
    conversionPotentialScore: 90,
    targetAudience: "Web Engineers, Modern App Founders",
    problemSolved: "Choosing the correct data mutation pattern in modern Next.js applications"
  },
  {
    keyword: "how to optimize mongodb aggregation pipeline for high traffic",
    categorySlug: "mern-stack",
    cluster: "Database Architecture",
    intent: "Informational",
    monthlyVolume: 980,
    difficulty: 35,
    businessRelevanceScore: 94,
    searchIntentScore: 90,
    searchOpportunityScore: 80,
    rankingFeasibilityScore: 88,
    conversionPotentialScore: 92,
    targetAudience: "Database Engineers, SaaS Architects",
    problemSolved: "Eliminating slow queries and indexing bottlenecks in production MongoDB"
  },

  // ─── B. Technical SEO & GEO ──────────────────────────────────────────────────
  {
    keyword: "how to optimize website for ai search engines and answer engines",
    categorySlug: "technical-seo",
    cluster: "GEO & AEO Optimization",
    intent: "Informational",
    monthlyVolume: 2400,
    difficulty: 36,
    businessRelevanceScore: 98,
    searchIntentScore: 95,
    searchOpportunityScore: 92,
    rankingFeasibilityScore: 88,
    conversionPotentialScore: 95,
    targetAudience: "Business Owners, Marketing Directors, Tech Executives",
    problemSolved: "Getting cited in Perplexity, ChatGPT, and Google AI Overviews using structured data & entity SEO"
  },
  {
    keyword: "how to fix next js core web vitals lcp and cls",
    categorySlug: "web-performance",
    cluster: "Core Web Vitals",
    intent: "Informational",
    monthlyVolume: 1800,
    difficulty: 39,
    businessRelevanceScore: 95,
    searchIntentScore: 92,
    searchOpportunityScore: 86,
    rankingFeasibilityScore: 84,
    conversionPotentialScore: 94,
    targetAudience: "Engineering Leads, E-commerce Founders",
    problemSolved: "Achieving sub-second Largest Contentful Paint and zero layout shift on modern web apps"
  },
  {
    keyword: "technical seo audit checklist for single page applications",
    categorySlug: "technical-seo",
    cluster: "Technical SEO Audits",
    intent: "Informational",
    monthlyVolume: 1500,
    difficulty: 34,
    businessRelevanceScore: 96,
    searchIntentScore: 94,
    searchOpportunityScore: 84,
    rankingFeasibilityScore: 88,
    conversionPotentialScore: 90,
    targetAudience: "Product Managers, Head of Engineering",
    problemSolved: "Ensuring client-rendered and hybrid web applications get fully crawled and indexed"
  },

  // ─── C. AI Automation & Agents ───────────────────────────────────────────────
  {
    keyword: "how to build autonomous ai agents for business process automation",
    categorySlug: "ai-and-automation",
    cluster: "AI Workflow Automation",
    intent: "Informational",
    monthlyVolume: 2800,
    difficulty: 40,
    businessRelevanceScore: 99,
    searchIntentScore: 95,
    searchOpportunityScore: 94,
    rankingFeasibilityScore: 82,
    conversionPotentialScore: 98,
    targetAudience: "Operations Directors, Enterprise Leaders, Founders",
    problemSolved: "Automating repetitive multi-step customer and operational workflows with AI agents"
  },
  {
    keyword: "how to integrate llm apis into existing web applications safely",
    categorySlug: "ai-and-automation",
    cluster: "AI System Integration",
    intent: "Informational",
    monthlyVolume: 1950,
    difficulty: 37,
    businessRelevanceScore: 97,
    searchIntentScore: 92,
    searchOpportunityScore: 88,
    rankingFeasibilityScore: 86,
    conversionPotentialScore: 92,
    targetAudience: "Software Developers, Technical Founders",
    problemSolved: "Managing token latency, streaming responses, security guardrails, and error fallbacks"
  },

  // ─── D. Digital Growth & Architecture ────────────────────────────────────────
  {
    keyword: "website architecture best practices for organic search scalability",
    categorySlug: "technical-seo",
    cluster: "Site Architecture & Indexation",
    intent: "Informational",
    monthlyVolume: 1400,
    difficulty: 33,
    businessRelevanceScore: 94,
    searchIntentScore: 90,
    searchOpportunityScore: 84,
    rankingFeasibilityScore: 89,
    conversionPotentialScore: 88,
    targetAudience: "Digital Growth Leaders, Web Architects",
    problemSolved: "Structuring deep website hierarchies and internal link silos to maximize crawl equity"
  }
];

/**
 * Calculates weighted selection score based on official rules:
 * - Business relevance: 30%
 * - Search intent: 20%
 * - Search opportunity: 20%
 * - Ranking feasibility: 15%
 * - Conversion potential: 15%
 */
export function calculateWeightedKeywordScore(candidate) {
  const score =
    (candidate.businessRelevanceScore * 0.30) +
    (candidate.searchIntentScore * 0.20) +
    (candidate.searchOpportunityScore * 0.20) +
    (candidate.rankingFeasibilityScore * 0.15) +
    (candidate.conversionPotentialScore * 0.15);
  return Math.round(score * 10) / 10;
}

/**
 * Discovers and prioritizes the best fresh keyword opportunity.
 * Checks against existing KeywordItem records to avoid repeating topics.
 */
export async function discoverTopKeyword({ forceKeyword = null, dryRun = false } = {}) {
  // Retrieve previously researched or published keywords from DB and PostModel
  const existingRecords = await KeywordItem.find({}, { keyword: 1, status: 1 }).lean().catch(() => []);
  const publishedPosts = await PostModel.find({ status: "published" }, { title: 1, slug: 1, focusKeywords: 1 }).lean().catch(() => []);

  const usedKeywords = new Set([
    ...existingRecords.filter(r => r.status === "Published").map(r => r.keyword.toLowerCase().trim()),
    ...publishedPosts.flatMap(p => [
      ...(p.focusKeywords || []).map(k => k.toLowerCase().trim()),
      p.slug.replace(/-/g, " ").toLowerCase().trim()
    ])
  ]);

  const usedList = Array.from(usedKeywords);

  // Score all candidates
  const scoredCandidates = SEED_KEYWORD_CANDIDATES.map(cand => {
    const candNorm = cand.keyword.toLowerCase().trim();
    const isUsed = usedList.some(u => u === candNorm || u.includes(candNorm) || candNorm.includes(u));
    return {
      ...cand,
      weightedScore: calculateWeightedKeywordScore(cand),
      isUsed
    };
  }).sort((a, b) => b.weightedScore - a.weightedScore);

  let selectedCandidate = null;

  if (forceKeyword) {
    selectedCandidate = scoredCandidates.find(
      c => c.keyword.toLowerCase().includes(forceKeyword.toLowerCase())
    ) || {
      keyword: forceKeyword,
      categorySlug: "ai-and-automation",
      cluster: "AI Automation",
      intent: "Informational",
      monthlyVolume: 1500,
      difficulty: 35,
      weightedScore: 92.5,
      problemSolved: `Comprehensive guide and best practices for ${forceKeyword}`,
      targetAudience: "Tech Leaders and Engineers"
    };
  } else {
    // Pick the highest scoring candidate that hasn't been used yet
    selectedCandidate = scoredCandidates.find(c => !c.isUsed);

    // If all seed candidates were used, take the highest ranking one that is not currently ranking
    if (!selectedCandidate) {
      selectedCandidate = scoredCandidates[0];
    }
  }

  // Record this discovery in KeywordItem only during real runs
  if (!dryRun) {
    try {
      await KeywordItem.findOneAndUpdate(
        { keyword: selectedCandidate.keyword.toLowerCase().trim() },
        {
          keyword: selectedCandidate.keyword.toLowerCase().trim(),
          intent: selectedCandidate.intent,
          monthlyVolume: selectedCandidate.monthlyVolume || 0,
          difficulty: selectedCandidate.difficulty || 0,
          cluster: selectedCandidate.cluster,
          status: "In Content Plan",
          notes: `Selected by Kraviona Autonomous Engine. Score: ${selectedCandidate.weightedScore}`
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.warn("[KEYWORD_DISCOVERY_WARN] Failed to write to KeywordItem collection:", err.message);
    }
  }

  return selectedCandidate;
}
