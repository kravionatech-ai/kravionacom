import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_SECRET = process.env.REVALIDATION_SECRET || "kraviona_live_sync_secure_token_2026";

export async function POST(request) {
  try {
    let body = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const { searchParams } = new URL(request.url);
    const secret =
      request.headers.get("x-revalidate-secret") ||
      searchParams.get("secret") ||
      body.secret;

    if (!secret || secret !== DEFAULT_SECRET) {
      return NextResponse.json(
        { success: false, message: "Invalid or missing revalidation secret token" },
        { status: 401 }
      );
    }

    const revalidated = {
      paths: [],
      tags: [],
    };

    // 1. Process Path Revalidations
    const rawPaths = body.paths || (body.path ? [body.path] : searchParams.getAll("path"));
    const paths = Array.isArray(rawPaths) ? rawPaths : [rawPaths];

    for (const p of paths) {
      if (typeof p === "string" && p.trim()) {
        const cleanPath = p.trim();
        try {
          revalidatePath(cleanPath);
          revalidated.paths.push(cleanPath);
        } catch (err) {
          console.error(`[REVALIDATE_PATH_ERROR] Failed to revalidate ${cleanPath}:`, err?.message);
        }
      }
    }

    // 2. Process Tag Revalidations
    const rawTags = body.tags || (body.tag ? [body.tag] : searchParams.getAll("tag"));
    const tags = Array.isArray(rawTags) ? rawTags : [rawTags];

    for (const t of tags) {
      if (typeof t === "string" && t.trim()) {
        const cleanTag = t.trim();
        try {
          revalidateTag(cleanTag);
          revalidated.tags.push(cleanTag);
        } catch (err) {
          console.error(`[REVALIDATE_TAG_ERROR] Failed to revalidate tag ${cleanTag}:`, err?.message);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cache revalidated successfully",
      timestamp: new Date().toISOString(),
      revalidated,
    });
  } catch (error) {
    console.error("[REVALIDATE_ENDPOINT_ERROR]", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error during revalidation" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  return POST(request);
}
