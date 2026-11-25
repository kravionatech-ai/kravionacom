import mongoose from "mongoose";
import { PostModel } from "../../models/blog/post.model.js";
import { CategoryModel } from "../../models/blog/category.model.js";
import { ContentPlanItem } from "../../models/ContentPlanItem.js";
import { KeywordItem } from "../../models/KeywordItem.js";
import { revalidateFrontend } from "../../utils/revalidateFrontend.js";
import { AUTOMATION_CONFIG } from "./config.js";

/**
 * Publishes the validated article directly into MongoDB Atlas using Kraviona's existing PostModel.
 * Ensures complete data integrity, prevents duplicate slugs, and purges the Next.js cache.
 */
export async function publishArticleToDatabase({ article, featuredImage, seoResult, originalityResult }) {
  // 1. Fetch category record
  const categoryConfig = AUTOMATION_CONFIG.categoryMap[article.categorySlug] || AUTOMATION_CONFIG.categoryMap["technical-seo"];
  let categoryRecord = await CategoryModel.findOne({ slug: categoryConfig.slug }).lean();
  
  if (!categoryRecord) {
    categoryRecord = await CategoryModel.findOne({ name: categoryConfig.name }).lean();
  }

  if (!categoryRecord && mongoose.connection.db) {
    categoryRecord = await mongoose.connection.db.collection("categories").findOne({
      $or: [
        { slug: categoryConfig.slug },
        { name: categoryConfig.name },
        { _id: new mongoose.Types.ObjectId(categoryConfig.id) }
      ]
    });
  }

  if (!categoryRecord) {
    throw new Error(`Category "${categoryConfig.slug}" not found in database.`);
  }

  // 2. Prevent duplicate slugs
  const existingPost = await PostModel.findOne({ slug: article.slug });
  if (existingPost) {
    throw new Error(`An article with slug "${article.slug}" already exists in the database.`);
  }

  const categorySnapshot = {
    name: categoryRecord.name,
    slug: categoryRecord.slug
  };

  const canonicalUrl = `${AUTOMATION_CONFIG.siteUrl}/${categoryRecord.slug}/${article.slug}`;

  // 3. Assemble complete document strictly adhering to PostModel schema
  const postDocument = new PostModel({
    title: article.title,
    slug: article.slug,
    content: article.content,
    excerpt: article.excerpt,
    quickAnswer: article.quickAnswer,
    keyTakeaways: article.keyTakeaways,
    tableOfContents: article.tableOfContents,
    primaryTopicCluster: article.primaryTopicCluster,
    supportingTopicClusters: ["AEO", "Generative Search", "Next.js Technical SEO"],
    tags: article.tags,
    wordCount: article.wordCount,
    readingTimeMinutes: article.readingTimeMinutes,

    userID: new mongoose.Types.ObjectId(article.userID),
    author: article.author,
    categoryID: categoryRecord._id,
    category: categorySnapshot,

    featuredImage: {
      url: featuredImage.url,
      altText: featuredImage.altText,
      width: featuredImage.width || 1200,
      height: featuredImage.height || 630,
      sizeInBytes: featuredImage.sizeInBytes,
      caption: featuredImage.caption
    },

    metaTitle: article.metaTitle,
    metaDescription: article.metaDescription,
    keywords: [...article.focusKeywords, ...article.semanticKeywords],
    focusKeywords: article.focusKeywords,
    semanticKeywords: article.semanticKeywords,
    canonicalUrl,
    schemaType: "Article",

    ogTitle: article.metaTitle,
    ogDescription: article.metaDescription,
    ogImage: featuredImage.url,
    twitterTitle: article.metaTitle,
    twitterDescription: article.metaDescription,
    twitterCard: "summary_large_image",

    faqSchema: article.faqSchema,
    sources: article.sources,
    contentType: "blog",
    status: "published",
    publishedAt: new Date(),
    contentSourceType: "Human", // High editorial quality standard
    isAccessibleForFree: true
  });

  // 4. Save to MongoDB
  const savedPost = await postDocument.save();

  // 5. Update KeywordItem and ContentPlanItem to keep planner synchronized
  try {
    await KeywordItem.findOneAndUpdate(
      { keyword: article.focusKeywords[0]?.toLowerCase().trim() },
      {
        status: "Published",
        targetUrl: canonicalUrl
      }
    );

    await ContentPlanItem.create({
      title: article.title,
      keyword: article.focusKeywords[0] || "",
      type: "Blog",
      status: "Published",
      priority: "High",
      plannedDate: new Date(),
      publishedDate: new Date(),
      targetUrl: canonicalUrl,
      linkedPostSlug: article.slug,
      notes: `Published by Kraviona Autonomous Engine. SEO Score: ${seoResult.totalScore}/100.`
    });
  } catch (err) {
    console.warn("[PLANNER_SYNC_WARN] Non-critical planner item sync warning:", err.message);
  }

  // 6. Purge Next.js cache so the article appears immediately on live site
  try {
    await revalidateFrontend({
      paths: [
        "/sitemap.xml",
        "/sitemap",
        "/blog",
        `/${categoryRecord.slug}`,
        `/${categoryRecord.slug}/${article.slug}`,
        "/llms.txt",
        "/ai.txt",
        "/"
      ],
      tags: ["posts", "sitemap"]
    });
  } catch (revalErr) {
    console.warn("[REVALIDATION_WARN] Revalidation dispatch warning:", revalErr.message);
  }

  return {
    success: true,
    post: savedPost,
    canonicalUrl
  };
}
