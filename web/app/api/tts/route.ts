import { NextRequest, NextResponse } from "next/server";
import { getOrGenerateTTS } from "@/lib/ttsService";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voice_id } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Missing or invalid text parameter" }, { status: 400 });
    }

    const result = await getOrGenerateTTS(text, voice_id);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("TTS API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const text = req.nextUrl.searchParams.get("text");
    const voice_id = req.nextUrl.searchParams.get("voice_id") || undefined;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "Missing text query parameter" }, { status: 400 });
    }

    const result = await getOrGenerateTTS(text, voice_id);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("TTS API error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
