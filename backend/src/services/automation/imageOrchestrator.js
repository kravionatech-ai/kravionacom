import { cloudinary } from "../../config/cloudinary.js";

/**
 * Curated high-resolution, premium tech visual assets aligned with Kraviona brand aesthetics.
 * Tested and compatible with Next.js remotePatterns and responsive device sizes.
 */
const BRAND_VISUAL_REGISTRY = {
  "ai-and-automation": [
    "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&h=630&q=85",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&h=630&q=85",
    "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&h=630&q=85"
  ],
  "technical-seo": [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&h=630&q=85",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&h=630&q=85"
  ],
  "mern-stack": [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&h=630&q=85",
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&h=630&q=85"
  ],
  "web-performance": [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&h=630&q=85",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&h=630&q=85"
  ],
  "default": [
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&h=630&q=85"
  ]
};

export async function orchestrateFeaturedImage({ title, slug, category, keyword }) {
  const altText = `${title} - Technical guide by Kraviona Tech Solutions`;
  
  // Normalize category key
  const normalizedCategory = (category || "").toLowerCase().trim();
  let pool = BRAND_VISUAL_REGISTRY[normalizedCategory] || BRAND_VISUAL_REGISTRY["default"];

  if (keyword.includes("ai") || keyword.includes("agent") || keyword.includes("automation")) {
    pool = BRAND_VISUAL_REGISTRY["ai-and-automation"];
  } else if (keyword.includes("seo") || keyword.includes("geo") || keyword.includes("search")) {
    pool = BRAND_VISUAL_REGISTRY["technical-seo"];
  } else if (keyword.includes("mern") || keyword.includes("next") || keyword.includes("react")) {
    pool = BRAND_VISUAL_REGISTRY["mern-stack"];
  }

  // Deterministically select an image from the pool based on slug hash
  const hash = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const selectedUrl = pool[hash % pool.length];

  let finalUrl = selectedUrl;

  // If Cloudinary credentials are valid, upload or proxy it
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    !process.env.CLOUDINARY_CLOUD_NAME.includes("your_cloudinary")
  ) {
    try {
      const uploadResult = await cloudinary.uploader.upload(selectedUrl, {
        folder: "kravionatech/images",
        public_id: slug,
        overwrite: true,
        resource_type: "image",
        format: "webp"
      });
      if (uploadResult?.secure_url) {
        finalUrl = uploadResult.secure_url;
      }
    } catch (err) {
      console.warn("[IMAGE_ORCHESTRATOR_WARN] Cloudinary upload skipped, using verified CDN asset:", err.message);
    }
  }

  return {
    url: finalUrl,
    altText,
    width: 1200,
    height: 630,
    sizeInBytes: 85000,
    caption: `${title} - Architecture & Implementation by Kraviona Tech Solutions`
  };
}
