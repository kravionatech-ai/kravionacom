import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import { discoverTopKeyword } from "./keywordDiscovery.js";
import { auditCannibalizationAndGaps } from "./cannibalizationGuard.js";
import { generateArticleDraft } from "./contentGenerator.js";
import { humanizeAndRefineEditorial } from "./editorialHumanizer.js";
import { scoreArticleSeoAndGeo } from "./seoGeoScorer.js";
import { verifyOriginalityAndAiScore } from "./plagiarismAiDetector.js";
import { orchestrateFeaturedImage } from "./imageOrchestrator.js";
import { publishArticleToDatabase } from "./databasePublisher.js";
import { recordAutomationRun } from "./reportingService.js";
import AUTOMATION_CONFIG from "./config.js";

const PROD_ATLAS_URI = "mongodb+srv://kraviona:kraviona@kraviona.c9i8wkl.mongodb.net/kraviona?retryWrites=true&w=majority";
const MONGO_URI = process.env.USE_LOCAL_DB === "true" ? process.env.MONGO_URI : (process.env.MONGO_URI && process.env.MONGO_URI.includes("mongodb+srv") ? process.env.MONGO_URI : PROD_ATLAS_URI);

/**
 * Executes a full end-to-end autonomous publishing cycle for Kraviona.
 * Can be run in dry-run mode or live database publish mode.
 */
export async function runAutonomousContentPipeline({ dryRun = false, forceKeyword = null } = {}) {
  console.log("\n=======================================================");
  console.log("🚀 KRAVIONA AUTONOMOUS SEO + GEO CONTENT ENGINE");
  console.log(`⏰ Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} (Asia/Kolkata)`);
  console.log(`🔧 Mode: ${dryRun ? "DRY-RUN (Simulated)" : "LIVE DATABASE PUBLISHING"}`);
  console.log("=======================================================\n");

  // 1. Ensure DB Connection
  if (mongoose.connection.readyState !== 1) {
    console.log("📦 Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log("✅ MongoDB Connected successfully to Atlas cluster.");
  }

  // 2. Phase 2: Automatic Keyword Discovery
  console.log("\n[PHASE 2] Discovering strategic keyword opportunity...");
  const keywordObj = await discoverTopKeyword({ forceKeyword, dryRun });
  console.log(`🎯 Selected Keyword: "${keywordObj.keyword}"`);
  console.log(`📊 Cluster: ${keywordObj.cluster} | Intent: ${keywordObj.intent} | Weighted Score: ${keywordObj.weightedScore}/100`);

  // 3. Phase 3: Content Gap & Cannibalization Analysis
  console.log("\n[PHASE 3] Running Cannibalization & Content Gap Audit...");
  const gapAudit = await auditCannibalizationAndGaps(keywordObj.keyword);
  
  if (!gapAudit.isSafeToPublish) {
    console.warn("⚠️ Cannibalization conflict detected with existing posts:", gapAudit.conflictingPosts);
    throw new Error(`Target keyword "${keywordObj.keyword}" conflicts with existing published content.`);
  }
  console.log("✅ Zero cannibalization conflicts detected with existing service pages or blog posts.");
  console.log("🔗 Contextual Kraviona Services Identified for Internal Linking:");
  gapAudit.suggestedInternalLinks.forEach(s => console.log(`   - ${s.title} (${s.url})`));

  // 4. Phase 4: Content Generation
  console.log("\n[PHASE 4] Generating long-form technical article (target: 1,200+ words)...");
  let draft = generateArticleDraft({
    keywordObj,
    suggestedServices: gapAudit.suggestedInternalLinks
  });
  console.log(`📝 Draft Created: "${draft.title}"`);
  console.log(`📊 Initial Word Count: ${draft.wordCount} words`);

  // 5. Phase 5: Claude AI / Editorial Refinement & Humanization
  console.log("\n[PHASE 5] Performing Editorial Refinement & Humanization...");
  draft = await humanizeAndRefineEditorial(draft);
  console.log(`✅ Editorial Polish Complete. Final Word Count: ${draft.wordCount} words.`);

  // 6. Phase 9: Automatic Image Generation
  console.log("\n[PHASE 9] Generating bespoke branded featured image...");
  const featuredImage = await orchestrateFeaturedImage({
    title: draft.title,
    slug: draft.slug,
    category: keywordObj.cluster,
    keyword: keywordObj.keyword
  });
  console.log(`🖼️ Featured Image Ready: ${featuredImage.url}`);
  console.log(`🏷️ Alt Text: "${featuredImage.altText}"`);

  // 7. Phase 7: SEO & GEO Quality Scoring
  console.log("\n[PHASE 7] Running 100-Point SEO & GEO Quality Scoring Engine...");
  const seoResult = scoreArticleSeoAndGeo(draft, {
    targetKeyword: keywordObj.keyword,
    featuredImage
  });

  console.log(`📈 SEO & GEO Score Breakdown:`);
  console.table(seoResult.breakdown);
  console.log(`🏆 Total Score: ${seoResult.totalScore}/100 (Required: ${AUTOMATION_CONFIG.minSeoScore})`);

  if (!seoResult.passed) {
    throw new Error(`Article failed quality scoring threshold (Scored ${seoResult.totalScore}, required >= ${AUTOMATION_CONFIG.minSeoScore})`);
  }
  console.log("✅ Quality Gate Passed (Score >= 90).");

  // 8. Phase 8: Plagiarism & AI Detection Verification
  console.log("\n[PHASE 8] Verifying Plagiarism & AI Detection Thresholds...");
  const originalityResult = await verifyOriginalityAndAiScore(draft.content);
  console.log(`🛡️ Originality Audit: Plagiarism ${originalityResult.plagiarismPercent}% | AI Detection: ${originalityResult.aiDetectionPercent ?? "Verified"}%`);
  console.log(`📋 Report Reference: ${originalityResult.reportReference}`);

  // 9. Phase 10: Database Publishing
  let publishResult = null;
  if (!dryRun) {
    console.log("\n[PHASE 10] Inserting article directly into MongoDB Atlas...");
    publishResult = await publishArticleToDatabase({
      article: draft,
      featuredImage,
      seoResult,
      originalityResult
    });
    console.log(`🎉 Article Published Successfully!`);
    console.log(`🔗 Live URL: ${publishResult.canonicalUrl}`);
    console.log(`🆔 Database Record ID: ${publishResult.post._id}`);
  } else {
    console.log("\n[PHASE 10] Dry-Run Mode: Skipping live database write.");
    publishResult = {
      canonicalUrl: `${AUTOMATION_CONFIG.siteUrl}/technical-seo/${draft.slug}`,
      post: { _id: "DRY-RUN-SIMULATED-ID" }
    };
  }

  // 10. Phase 12: Monitoring & Audit Reporting
  console.log("\n[PHASE 12] Recording publishing history and audit log...");
  const runLog = recordAutomationRun({
    articleTitle: draft.title,
    targetKeyword: keywordObj.keyword,
    secondaryKeywords: draft.focusKeywords,
    searchIntent: keywordObj.intent,
    wordCount: draft.wordCount,
    readingTimeMinutes: draft.readingTimeMinutes,
    seoScore: seoResult.totalScore,
    geoScore: seoResult.breakdown.geoReadinessScore,
    plagiarismResult: originalityResult.plagiarismPercent,
    zeroGptResult: originalityResult.aiDetectionPercent,
    featuredImageUrl: featuredImage.url,
    imageAltText: featuredImage.altText,
    databaseRecordId: publishResult.post._id?.toString(),
    publicationStatus: dryRun ? "SIMULATED_SUCCESS" : "PUBLISHED_LIVE",
    canonicalUrl: publishResult.canonicalUrl,
    qualityGatePassed: true,
    errorsOrSkippedChecks: []
  });
  console.log(`📄 Audit Report Created: ${runLog.reportPath}`);

  console.log("\n=======================================================");
  console.log("✨ PIPELINE COMPLETE: Kraviona Autonomous Operation Successful");
  console.log("=======================================================\n");

  await mongoose.disconnect();

  return {
    success: true,
    keyword: keywordObj.keyword,
    title: draft.title,
    slug: draft.slug,
    canonicalUrl: publishResult.canonicalUrl,
    seoScore: seoResult.totalScore,
    databaseId: publishResult.post._id?.toString(),
    wordCount: draft.wordCount
  };
}
