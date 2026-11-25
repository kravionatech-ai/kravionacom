import { PostModel } from "../../models/blog/post.model.js";
import { seedServicesData } from "../../data/seedServicesData.js";
import slugify from "slugify";

function stringSimilarity(str1, str2) {
  const s1 = (str1 || "").toLowerCase().replace(/[^a-z0-9]/g, " ").trim();
  const s2 = (str2 || "").toLowerCase().replace(/[^a-z0-9]/g, " ").trim();
  if (s1 === s2) return 1.0;
  if (!s1 || !s2) return 0.0;

  const words1 = new Set(s1.split(/\s+/).filter(Boolean));
  const words2 = new Set(s2.split(/\s+/).filter(Boolean));
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  return intersection.size / union.size;
}

/**
 * Validates a target keyword against existing published posts and service pages.
 * Detects potential keyword cannibalization and identifies prime internal link anchors.
 */
export async function auditCannibalizationAndGaps(targetKeyword) {
  const normalizedKeyword = targetKeyword.toLowerCase().trim();
  const candidateSlug = slugify(normalizedKeyword, { lower: true, strict: true });

  // 1. Fetch published blog posts
  const existingPosts = await PostModel.find(
    { status: "published" },
    { title: 1, slug: 1, focusKeywords: 1, keywords: 1, primaryTopicCluster: 1, category: 1 }
  ).lean().catch(() => []);

  // 2. Check overlap against existing blog posts
  const conflictingPosts = [];
  for (const post of existingPosts) {
    const titleSim = stringSimilarity(targetKeyword, post.title);
    const slugSim = stringSimilarity(candidateSlug, post.slug);
    const exactKeywordMatch = (post.focusKeywords || []).some(
      k => k.toLowerCase().trim() === normalizedKeyword
    );

    if (titleSim > 0.65 || slugSim > 0.70 || exactKeywordMatch) {
      conflictingPosts.push({
        title: post.title,
        slug: post.slug,
        similarity: Math.max(titleSim, slugSim),
        exactKeywordMatch
      });
    }
  }

  // 3. Check overlap against existing commercial services
  const conflictingServices = [];
  const relevantServicesToLink = [];

  for (const service of seedServicesData) {
    const serviceTitle = service.title;
    const serviceSlug = service.slug;
    const serviceKeywords = [
      ...(service.seo?.keywords || []),
      service.seo?.primaryKeyword,
      ...(service.seo?.secondaryKeywords || [])
    ].filter(Boolean).map(k => k.toLowerCase().trim());

    const titleSim = stringSimilarity(targetKeyword, serviceTitle);
    const exactServiceKeywordMatch = serviceKeywords.some(k => k === normalizedKeyword);

    // If an informational post exactly duplicates a commercial service keyword without an informational modifier, flag it!
    if (titleSim > 0.85 || exactServiceKeywordMatch) {
      conflictingServices.push({
        title: serviceTitle,
        slug: serviceSlug,
        similarity: titleSim,
        warning: "Direct commercial intent overlap. Ensure the blog has clear informational intent (e.g. 'how to', 'guide', 'best practices')."
      });
    }

    // Measure topical synergy for internal linking
    const keywordWords = targetKeyword.toLowerCase().split(/\s+/);
    const matchCount = keywordWords.filter(w =>
      serviceTitle.toLowerCase().includes(w) ||
      (service.category && service.category.toLowerCase().includes(w)) ||
      serviceSlug.includes(w)
    ).length;

    if (matchCount >= 1) {
      relevantServicesToLink.push({
        title: serviceTitle,
        slug: serviceSlug,
        url: `/services/${serviceSlug}`,
        relevance: matchCount
      });
    }
  }

  // Sort relevant services by relevance
  relevantServicesToLink.sort((a, b) => b.relevance - a.relevance);

  const isSafeToPublish = conflictingPosts.length === 0;

  return {
    isSafeToPublish,
    conflictingPosts,
    conflictingServices,
    suggestedInternalLinks: relevantServicesToLink.slice(0, 3)
  };
}
