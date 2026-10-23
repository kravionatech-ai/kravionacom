import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    success: true,
    status: "ok",
    service: "kraviona-ai-tts",
  });
}

export async function POST(request) {
  try {
    const { text, voice = "nova", speed = 1.0 } = await request.json();

    const cleanText = String(text || "").trim();
    if (!cleanText) {
      return NextResponse.json({ success: false, error: "Text is required" }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/audio/speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "tts-1",
            input: cleanText.slice(0, 4096),
            voice: voice || "nova", // Nova is friendly, warm female voice
            speed: Math.max(0.75, Math.min(1.5, Number(speed) || 1.0)),
          }),
        });

        if (response.ok) {
          const audioBuffer = await response.arrayBuffer();
          return new Response(audioBuffer, {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "public, max-age=86400",
            },
          });
        }
      } catch (err) {
        console.warn("Server neural TTS error, falling back to Web Speech:", err.message);
      }
    }

    // Default: Signal client to use natural browser speech synthesis
    return NextResponse.json({
      success: false,
      fallback: "webspeech",
      message: "Server neural key not configured. Using client neural voice.",
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, fallback: "webspeech", error: err.message },
      { status: 500 }
    );
  }
}
