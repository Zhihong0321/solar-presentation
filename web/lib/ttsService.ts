import crypto from "crypto";
import fs from "fs";
import path from "path";
import { getStorageDir, getStorageFilePath, isStorageAvailable } from "./storage";

function getMinimaxApiKey(): string {
  if (process.env.MINIMAX_API_KEY) {
    return process.env.MINIMAX_API_KEY;
  }
  // Hermes vault check (local dev)
  const vaultPath = "C:\\Users\\Eternalgy\\.hermes\\vault.json";
  try {
    if (fs.existsSync(vaultPath)) {
      const data = JSON.parse(fs.readFileSync(vaultPath, "utf-8"));
      const creds = data.credentials || [];
      for (const cred of creds) {
        if (cred.id === "minimax" || cred.id === "minimax-2.7-hspeed") {
          return cred.credential;
        }
      }
    }
  } catch (err) {
    console.warn("Vault access error:", err);
  }
  throw new Error(
    "MINIMAX_API_KEY environment variable is missing. Please set MINIMAX_API_KEY in your Railway environment variables.",
  );
}

export async function getOrGenerateTTS(
  text: string,
  voiceId?: string,
): Promise<{ url: string; cached: boolean }> {
  const isChinese = /[\u4e00-\u9fa5]/.test(text);
  const effectiveVoiceId =
    voiceId || (isChinese ? "presenter_male" : "English_expressive_narrator");

  const hash = crypto
    .createHash("sha256")
    .update(`${effectiveVoiceId}:${text.trim()}`)
    .digest("hex")
    .slice(0, 16);
  const fileName = `tts_${hash}.mp3`;
  const relativePath = path.join("narration", "cache", fileName);

  // 1. Check if already cached in /storage or public/
  const existingPath = getStorageFilePath(relativePath);
  if (existingPath) {
    return {
      url: `/api/storage/${relativePath.replace(/\\/g, "/")}`,
      cached: true,
    };
  }

  // 2. Not cached - generate on the fly via MiniMax API
  const apiKey = getMinimaxApiKey();
  if (!apiKey) {
    throw new Error("No MiniMax API key available for on-the-fly TTS generation");
  }

  const url = "https://api.minimax.io/v1/t2a_v2";
  const payload = {
    model: "speech-02-hd",
    text: text.trim(),
    stream: false,
    voice_setting: {
      voice_id: effectiveVoiceId,
      speed: 1.0,
      vol: 1.0,
      pitch: 0,
    },
    audio_setting: {
      sample_rate: 32000,
      bitrate: 128000,
      format: "mp3",
      channel: 1,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`MiniMax API HTTP error ${response.status}: ${errText}`);
  }

  const data = await response.json();
  const baseResp = data.base_resp || {};
  if (baseResp.status_code !== 0 || !data.data || !data.data.audio) {
    throw new Error(`MiniMax API returned error: ${JSON.stringify(baseResp)}`);
  }

  const hexAudio = data.data.audio;
  const audioBuffer = Buffer.from(hexAudio, "hex");

  // 3. Save to persistent storage / storage cache directory
  const cacheDir = getStorageDir("narration", "cache");
  const targetFile = path.join(cacheDir, fileName);
  fs.writeFileSync(targetFile, audioBuffer);

  return {
    url: `/api/storage/${relativePath.replace(/\\/g, "/")}`,
    cached: false,
  };
}
