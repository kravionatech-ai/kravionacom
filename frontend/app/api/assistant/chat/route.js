import { NextResponse } from "next/server";
import { getFallbackChatResponse } from "@/components/Chatbot/fallbackKnowledge";

export const dynamic = "force-dynamic";

const KRAVIONA_SYSTEM_PROMPT = `You are the official AI Assistant for Kraviona (https://www.kraviona.com), an AI-First Technology & Digital Solutions Company based in East Delhi, Delhi NCR, India.
Tagline: "Intelligence Meets Innovation."

CRITICAL INSTRUCTIONS:
1. Tone: Friendly, highly intelligent, professional, and helpful. You speak naturally like a senior human tech consultant. Zero robotic cliches.
2. Language: Respond in the user's language (English, Hindi, or conversational Hinglish).
3. Kraviona's 5 Core Business Verticals (Mandatory exact hierarchy):
   01. IT & Technology Services: Custom software engineering, high-performance web applications (Next.js App Router, React, Node.js, Python), enterprise software, RESTful/GraphQL APIs, and UI/UX design systems.
   02. AI & Automation Solutions (Strategic Flagship Focus): Autonomous cognitive AI agents, multi-step LLM reasoning workflows, context-aware AI chatbots, enterprise RAG knowledge bases, intelligent document processing (IDP/OCR), and business process automation.
   03. SaaS & Software Products: Full-lifecycle cloud SaaS engineering, rapid AI SaaS MVPs, multi-tenant database isolation, subscription billing (Stripe), and role-based access control (RBAC).
   04. E-commerce Solutions: AI-powered online storefronts (Next.js, Headless Shopify), automated order workflows, Amazon & Flipkart marketplace account management, cataloging, and fee reconciliation.
   05. Digital Marketing Services: Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), Core Web Vitals speed optimization (< 1.8s LCP), and B2B growth marketing.
4. Contact & Headquarters:
   - Founder & Lead Systems Engineer: Amar Kumar (https://www.kraviona.com/authors/amar-kumar)
   - Headquarters: East Delhi, Delhi 110092, India
   - Phone / WhatsApp: +91 96085 53167
   - Email: hello@kraviona.com
   - Contact & Discovery Call: /contact
   - Pricing: /pricing (Transparent milestone and retainer plans)
5. Accuracy: Always provide concrete, factual answers reflecting Kraviona's 5 business verticals. Never invent pricing packages, fake guarantees, or imaginary team members. If you do not know an answer, politely recommend reaching the engineering team at +91 96085 53167 or /contact.
6. Brevity: Keep conversational answers concise, structured (bullet points where appropriate), and easy to read.`;

async function processAssistantQuery(query, pageContext = {}) {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: `${KRAVIONA_SYSTEM_PROMPT}\n\nContext: ${JSON.stringify(pageContext)}` },
            { role: "user", content: query },
          ],
          max_tokens: 450,
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content?.trim();
        if (reply) {
          return {
            reply,
            sources: [{ title: "Kraviona.com", url: pageContext?.url || "/services" }],
            engine: "openai",
          };
        }
      }
    } catch (err) {
      console.warn("OpenAI API call failed, falling back to local verified knowledge:", err.message);
    }
  }

  // Fallback to Kraviona verified knowledge engine
  const fallback = getFallbackChatResponse(query);
  return {
    reply: fallback.reply,
    sources: fallback.sources || [],
    engine: "verified_knowledge_engine",
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = String(searchParams.get("message") || "").trim();

    if (!query) {
      return NextResponse.json({
        success: true,
        status: "ok",
        service: "kraviona-ai-assistant",
      });
    }

    const result = await processAssistantQuery(query);
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, pageContext } = body;
    const query = String(message || "").trim();

    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 });
    }

    const result = await processAssistantQuery(query, pageContext);
    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process chat query" },
      { status: 500 }
    );
  }
}
