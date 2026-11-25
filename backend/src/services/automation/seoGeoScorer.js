import { AUTOMATION_CONFIG } from "./config.js";

/**
 * Deterministic SEO & GEO Quality Scoring Engine.
 * Evaluates the article across the 9 mandatory dimensions (Total 100 points).
 * Rejects any content scoring below 90 points.
 */
export function scoreArticleSeoAndGeo(article, { targetKeyword, featuredImage } = {}) {
  let searchIntentScore = 0;
  let contentQualityScore = 0;
  let keywordOptimizationScore = 0;
  let onPageSeoScore = 0;
  let technicalSeoScore = 0;
  let geoReadinessScore = 0;
  let internalLinkingScore = 0;
  let imageOptimizationScore = 0;
  let readabilityOriginalityScore = 0;

  const content = article.content || "";
  const title = article.title || "";
  const metaDesc = article.metaDescription || "";
  const kwWords = (targetKeyword || "").toLowerCase().split(/\s+/).filter(w => w.length > 3);

  // 1. Search Intent Satisfaction (Max 15)
  // Has direct answer, answers the core question upfront, practical steps provided
  if (article.quickAnswer && article.quickAnswer.length >= 40) searchIntentScore += 6;
  if (content.includes("Direct Answer:") || content.includes("quick-answer-card")) searchIntentScore += 5;
  if (article.faqSchema && article.faqSchema.length >= 3) searchIntentScore += 4;

  // 2. Content Quality and Usefulness (Max 20)
  // Depth, real code snippet, actionable checklist, technical specifics
  if (article.wordCount >= 1200) contentQualityScore += 8;
  if (content.includes("<pre") || content.includes("<code")) contentQualityScore += 6; // Technical code/diagram present
  if (content.includes("Roadmap") || content.includes("Checklist") || content.includes("<ol") || content.includes("<table")) contentQualityScore += 6;

  // 3. Keyword Optimization (Max 10)
  // Target keywords or semantic stems present in title, meta description, and focusKeywords
  const titleMatches = kwWords.some(w => title.toLowerCase().includes(w));
  const metaMatches = kwWords.some(w => metaDesc.toLowerCase().includes(w));
  if (titleMatches) keywordOptimizationScore += 4;
  if (metaMatches) keywordOptimizationScore += 3;
  if (article.focusKeywords && article.focusKeywords.length >= 3) keywordOptimizationScore += 3;

  // 4. On-Page SEO (Max 15)
  // Meta title, meta description length, H2/H3 structure, slug format
  if (article.metaTitle && article.metaTitle.length <= 75) onPageSeoScore += 3;
  if (metaDesc && metaDesc.length >= 80 && metaDesc.length <= 190) onPageSeoScore += 4;
  if (article.tableOfContents && article.tableOfContents.length >= 5) onPageSeoScore += 4;
  if (article.slug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) onPageSeoScore += 4;

  // 5. Technical SEO (Max 10)
  // Minimum word count, clean HTML, correct category, author E-E-A-T metadata
  if (article.wordCount >= 1200) technicalSeoScore += 4;
  if (article.author && article.author.name && article.author.jobTitle) technicalSeoScore += 3;
  if (article.categorySlug) technicalSeoScore += 3;

  // 6. GEO Readiness (Generative Engine Optimization) (Max 15)
  // Direct answer quickAnswer, Key Takeaways for bullet lifting, Entity references, FAQ schema
  if (article.quickAnswer) geoReadinessScore += 4;
  if (article.keyTakeaways && article.keyTakeaways.length >= 3) geoReadinessScore += 4;
  if (article.faqSchema && article.faqSchema.length >= 3) geoReadinessScore += 4;
  if (article.sources && article.sources.length >= 2) geoReadinessScore += 3;

  // 7. Internal Linking (Max 5)
  // Links to Kraviona commercial service pages contextually
  if (content.includes("/services/")) internalLinkingScore += 5;

  // 8. Image Optimization (Max 5)
  // Featured image exists, has descriptive altText, is WebP/SVG vector
  if (featuredImage && featuredImage.url) {
    imageOptimizationScore += 2;
    if (featuredImage.altText && featuredImage.altText.length > 5) imageOptimizationScore += 2;
    if (featuredImage.url.endsWith(".webp") || featuredImage.url.endsWith(".svg") || featuredImage.url.includes("image")) imageOptimizationScore += 1;
  }

  // 9. Readability and Originality (Max 5)
  // Varied sentence length, absence of AI tropes, clear tone
  if (!content.includes("in the rapidly evolving landscape of") && !content.includes("delve into")) {
    readabilityOriginalityScore += 5;
  } else {
    readabilityOriginalityScore += 2;
  }

  const totalScore = (
    searchIntentScore +
    contentQualityScore +
    keywordOptimizationScore +
    onPageSeoScore +
    technicalSeoScore +
    geoReadinessScore +
    internalLinkingScore +
    imageOptimizationScore +
    readabilityOriginalityScore
  );

  const passed = totalScore >= AUTOMATION_CONFIG.minSeoScore;

  return {
    totalScore,
    passed,
    breakdown: {
      searchIntentScore,
      contentQualityScore,
      keywordOptimizationScore,
      onPageSeoScore,
      technicalSeoScore,
      geoReadinessScore,
      internalLinkingScore,
      imageOptimizationScore,
      readabilityOriginalityScore
    },
    status: passed ? "PASSED_QUALITY_GATE" : "FAILED_QUALITY_GATE"
  };
}
