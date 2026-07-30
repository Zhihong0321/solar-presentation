import "server-only";
import { sql } from "./db";

interface LogVisitParams {
  token: string;
  invoiceId?: string;
  invoiceNumber?: string;
  customerName?: string;
  ip?: string;
  userAgent?: string;
  referer?: string;
}

interface LogTTSParams {
  text: string;
  voiceId: string;
  cached: boolean;
  durationMs?: number;
  inputTokens?: number;
  outputTokens?: number;
  costUsd?: number;
  error?: string;
}

export async function logVisit(params: LogVisitParams): Promise<void> {
  const {
    token,
    invoiceId,
    invoiceNumber,
    customerName,
    ip,
    userAgent,
    referer,
  } = params;

  try {
    await sql(
      `INSERT INTO activity_log (
        app,
        app_env,
        source_url,
        actor_kind,
        actor_name,
        action,
        entity_type,
        entity_id,
        entity_label,
        description,
        status,
        ip,
        user_agent,
        metadata,
        occurred_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, NOW()
      )`,
      [
        "solar-presentation",
        process.env.NODE_ENV || "production",
        referer || null,
        "visitor",
        customerName || "Anonymous",
        "visit",
        "presentation",
        invoiceId || null,
        invoiceNumber || token,
        `Viewed presentation for token ${token}`,
        "success",
        ip || null,
        userAgent || null,
        JSON.stringify({ token }),
      ],
    );
  } catch (err) {
    console.error("Failed to log visit:", err);
    // Don't throw - activity logging should never break the main flow
  }
}

export async function logAIActivity(params: LogTTSParams): Promise<void> {
  const {
    text,
    voiceId,
    cached,
    durationMs,
    inputTokens,
    outputTokens,
    costUsd,
    error,
  } = params;

  const textPreview = text.length > 100 ? text.slice(0, 100) + "..." : text;
  const isChinese = /[一-龥]/.test(text);

  try {
    await sql(
      `INSERT INTO ai_activity_log (
        app,
        app_env,
        agent,
        agent_kind,
        model,
        api_url,
        action,
        tool_name,
        entity_type,
        description,
        input_summary,
        output_summary,
        input_tokens,
        output_tokens,
        cost_usd,
        duration_ms,
        status,
        error_message,
        metadata,
        occurred_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW()
      )`,
      [
        "solar-presentation",
        process.env.NODE_ENV || "production",
        "minimax-tts",
        "tts_service",
        "speech-02-hd",
        "https://api.minimax.io/v1/t2a_v2",
        cached ? "tts_cache_hit" : "tts_generate",
        "MiniMax TTS",
        "audio",
        `Generated TTS audio (${isChinese ? "Chinese" : "English"}, ${voiceId})`,
        textPreview,
        cached ? "Returned from cache" : "Generated new audio",
        inputTokens || null,
        outputTokens || null,
        costUsd || null,
        durationMs || null,
        error ? "failed" : "success",
        error || null,
        JSON.stringify({
          voice_id: voiceId,
          text_length: text.length,
          language: isChinese ? "zh" : "en",
          cached,
        }),
      ],
    );
  } catch (err) {
    console.error("Failed to log AI activity:", err);
    // Don't throw - activity logging should never break the main flow
  }
}
