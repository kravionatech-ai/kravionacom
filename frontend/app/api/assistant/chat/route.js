import { NextResponse } from "next/server";
import { getFallbackChatResponse } from "@/components/Chatbot/fallbackKnowledge";

export const runtime = "nodejs";

const KRAVIONA_SYSTEM_PROMPT = `You are the official AI Assistant for Kraviona Tech Solutions (https://www.kraviona.com), a premier digital engineering and technical SEO agency based in Noida, Delhi NCR, India.

CRITICAL INSTRUCTIONS:
1. Tone: Friendly, highly intelligent, professional, and helpful. You speak naturally like a human tech consultant.
2. Language: Respond in the user's language (English, Hindi, or conversational Hinglish).
3. Core Services:
   - Full-Stack Web Development: Next.js 14/15, React, Node.js, MERN stack web apps
   - Technical SEO & Core Web Vitals: Sub-second load times, 90+ mobile PageSpeed scores, structured schema, crawl budget fixes
   - AI Automation & Agents: Custom LLMs, n8n pipelines, WhatsApp bots, and autonomous workflows
   - Custom APIs & Backend: Scalable cloud microservices, MongoDB/PostgreSQL architecture
   - UI/UX Design & SaaS MVPs: Modern, high-converting interfaces
4. Contact & Headquarters:
   - Location: Noida, Delhi NCR, India (serves clients across India and globally)
   - Phone / WhatsApp: +91 96085 53167
   - Email: kravionatech@gmail.com
   - Contact Form: /contact
5. Accuracy: Never invent pricing packages, fake guarantees, or imaginary team members. If you do not know an answer, politely recommend reaching the team at +91 96085 53167 or /contact.
6. Brevity: Keep conversational answers concise (2 to 4 sentences or bullet points) suitable for both reading and voice playback.`;

export async function POST(request) {
  try {
    const body = await request.json();
    const { message, pageContext, history = [] } = body;

    const query = String(message || "").trim();
    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 });
    }

    // Check if an OpenAI or Gemini API key is configured
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const messages = [
          { role: "system", content: `${KRAVIONA_SYSTEM_PROMPT}\n\nCurrent Page Context: ${JSON.stringify(pageContext || {})}` },
          ...history.slice(-6).map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
          })),
          { role: "user", content: query },
        ];

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages,
            max_tokens: 450,
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content?.trim();
          if (reply) {
            return NextResponse.json({
              success: true,
              data: {
                reply,
                sources: [{ title: "Kraviona.com", url: pageContext?.url || "/services" }],
                engine: "openai",
              },
            });
          }
        }
      } catch (err) {
        console.warn("OpenAI API call failed, falling back to local verified knowledge:", err.message);
      }
    }

    // High-fidelity fallback to Kraviona verified knowledge engine
    const fallback = getFallbackChatResponse(query);
    return NextResponse.json({
      success: true,
      data: {
        reply: fallback.reply,
        sources: fallback.sources || [],
        engine: "verified_knowledge_engine",
      },
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process chat query" },
      { status: 500 }
    );
  }
}
