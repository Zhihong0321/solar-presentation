# Xiaomi MiMo TTS — Builder's Guide

Field notes from getting this working end-to-end for the Presentation Tools project. Read this before wiring MiMo TTS into anything — it covers the API shape, the three model variants, style/accent/speed control (there is no numeric "speed" parameter — it's all natural language), and the exact curl gotcha that will burn an hour if you don't know about it.

## 1. Credentials & endpoint

- API key lives in the credential store as `mimo-0726` (subtype `xiaomi-mimo`). Treat it like any other secret — don't paste it into files that get committed or shared.
- This is a **Token Plan** key, not a standard platform key. It has its own base URL, distinct from the one shown in the public docs:
  - Token Plan base URL: `https://token-plan-sgp.xiaomimimo.com/v1`
  - Public docs default (for standard/platform keys): `https://api.xiaomimimo.com/v1`
  - Always check the credential's `remark` field for the base URL that actually applies — don't assume the docs' default works with every key.
- Single endpoint for everything: `POST {base_url}/chat/completions` — it's OpenAI-Chat-Completions-shaped, just with an `audio` object in the request and response.
- Auth header: `api-key: $MIMO_API_KEY` (not `Authorization: Bearer ...`).

## 2. The three models

| Model | Use for | Notes |
|---|---|---|
| `mimo-v2.5-tts` | Built-in preset voices | Fast, cheap, supports singing mode. Voice fixed to one of the built-ins (see below). |
| `mimo-v2.5-tts-voicedesign` | Custom voice from a text description | No audio sample needed. This is how you get accents/ages/textures the presets don't cover (e.g. "Asian-accented English"). No singing mode. |
| `mimo-v2.5-tts-voiceclone` | Clone a voice from an audio sample | Pass base64 audio (`data:{mime};base64,...`, max 10MB, mp3/wav only) as `audio.voice`. No singing mode, no built-ins. |

Only one model per call — you can't mix voice design with a built-in voice.

## 3. Request shape

```json
{
    "model": "mimo-v2.5-tts",
    "messages": [
        { "role": "user", "content": "<style/accent/pace instructions, or voice description for voicedesign>" },
        { "role": "assistant", "content": "<the exact text to be spoken>" }
    ],
    "audio": { "format": "wav", "voice": "Mia" }
}
```

**Critical rule:** the text that actually gets spoken MUST be in the `assistant` message. The `user` message is never spoken — it's instructions only (style, tone, accent, pace). For `voicedesign`, the `user` message is required and is the voice description itself.

- `audio.format`: `wav` for a normal complete file; `pcm16` for streaming (see below).
- `audio.voice`: built-in voice name (only for `mimo-v2.5-tts`), or omitted for `voicedesign` (unless you pass `optimize_text_preview`), or a base64 data URI for `voiceclone`.
- `optimize_text_preview` (voicedesign only, bool): if `true`, the model can polish/expand the assistant text itself and you can omit the assistant message entirely. Leave `false` if you're hand-writing the exact script (recommended for anything client-facing — you want to control the words verbatim).
- `stream: true` switches to streaming mode — set `audio.format` to `pcm16` when streaming so chunks splice cleanly (see the docs' Python example for concatenating pcm16 chunks with numpy + soundfile).

Response: `choices[0].message.audio.data` is base64. Decode and write to a file:

```python
import json, base64
d = json.load(open("response.json"))
audio_bytes = base64.b64decode(d["choices"][0]["message"]["audio"]["data"])
open("out.wav", "wb").write(audio_bytes)
```

Output is always **24kHz mono PCM16** regardless of which model/voice you use.

## 4. Built-in voices (`mimo-v2.5-tts` only)

| Voice ID | Language | Gender |
|---|---|---|
| `mimo_default` | varies by cluster (冰糖 for China cluster, Mia elsewhere) | — |
| 冰糖 | Chinese | Female |
| 茉莉 | Chinese | Female |
| 苏打 | Chinese | Male |
| 白桦 | Chinese | Male |
| Mia | English | Female |
| Chloe | English | Female |
| Milo | English | Male |
| Dean | English | Male |

**Important limitation:** the English built-ins (Mia/Chloe/Milo/Dean) are American-accented and this is NOT controllable via style instructions — the accent is baked into the preset voice. If you need a non-American English accent (e.g. Asian-accented English for an APAC-facing client), don't fight the built-ins — switch to `mimo-v2.5-tts-voicedesign` and describe the accent directly (see §6).

## 5. Style control — two independent mechanisms

Both work with built-in voices AND voicedesign/voiceclone.

**A. Natural language control** (goes in the `user` message): describe tone, pace, emotion, accent, character, scene, and direction in plain English or Chinese. Supports lightweight one-liners up to full "director mode" (character + scene + guidance blocks) for high-stakes VO work. There is **no numeric speed/rate parameter** — "slower" is achieved purely by instruction text, e.g. "speaking slowly and deliberately, unhurried pace, clear enunciation, with natural pauses between phrases." Ellipses (`...`) in the assistant text itself also reliably slow the model down and add natural pauses — cheap, effective trick, use it in the script text, not just the instructions.

**B. Audio tag control** (goes inline in the `assistant` text, i.e. the spoken text itself): bracketed tags like `(Sighing)`, `(Lazy)`, `(Northeastern dialect)`, `(Cantonese)`, or singing via `(唱歌)lyrics` / `(sing)lyrics`. Brackets can be `()`, `（）`, or `[]`. You can also drop `[audio tag]`-style inline markers mid-sentence for breathing, coughs, trembling voice, etc. Use tag control when you want a specific moment in the script to shift style; use natural-language control when you want the whole clip in one consistent register.

Don't mix contradictory instructions (e.g. "childish voice" + "authoritative CEO") — the docs explicitly warn this produces poor results.

## 6. Getting a non-American / Asian-accented voice

Confirmed working approach: use `mimo-v2.5-tts-voicedesign` and describe the accent explicitly in the `user` message. Vague words ("normal", "foreign") don't work — name the accent/region.

```json
{
  "role": "user",
  "content": "Middle-aged Southeast Asian man in his 40s, speaking English with a warm Malaysian-Singaporean accent. Calm, trustworthy consultant voice, silky and reassuring. Speaking slowly and deliberately, unhurried pace, clear enunciation, with natural pauses between phrases."
}
```

A good voice-design prompt covers: gender/age, voice texture, mood/tone, speed/rhythm, and optionally role/character, speaking style, scene, era. Keep it to 1-4 sentences — piling on more dimensions doesn't help. Avoid audio-quality/post-processing terms (reverb, EQ, compression) — those aren't things this model controls.

## 7. Chinese-language pitches

Just write the `assistant` content in Chinese and pick a Chinese built-in voice (苏打/白桦 male, 冰糖/茉莉 female), or use voicedesign with a Chinese description (the model supports voice descriptions in either language — use whichever you can be most precise in). Style/pace instructions in the `user` message can also be written in Chinese.

## 8. Timing a script to a target duration

There's no direct control over output duration — you're managing it via word count + pace instructions. Rough calibration observed in this project (24kHz output, `mimo-v2.5-tts-voicedesign`, "slow and deliberate" instruction):

- ~70 words + "slower pace" instruction → ~39.5 sec
- ~55 words + same "slower pace" instruction → ~29.8 sec

So budget roughly **~1.8-2.0 words per second** when the instruction explicitly asks for a slow/deliberate pace, vs. the more typical **~2.5-3 words/sec** for a normal conversational pace (the first, un-slowed English pitch in this project: ~70 words → 27 sec). Always generate once, check `afinfo`/duration, and trim the script rather than trying to guess word count up front — it's cheap to iterate since billing is currently free.

**Pace instructions affect more than duration — they affect energy.** "Slow and deliberate" / "unhurried" wording reliably slows the clip down, but user feedback in this project was that it also came out flat/boring, not just slow. Swapping to "natural conversational pace, not rushed but not slow either, with lively intonation" (plus an exclamation point in the script itself) fixed both the pace and the energy in one pass — ~55 words → 25.3 sec, rated better than both the plain "slow" version and the original un-accented take. Lesson: don't reach for "slow" alone when the actual complaint is "too fast" — pair it with an explicit energy/liveliness cue, or you trade speed for flatness.

## 9. The curl gotcha that costs you a `400 Invalid JSON` error

`--data-raw @file.json` does **NOT** read the file — `--data-raw` sends its argument completely literally, so curl sends the 14-character string `@file.json` as the request body, and the API correctly rejects it as invalid JSON. This is a real trap because the docs' own example curl snippets use inline `--data-raw '{...}'` and never show the `@file` pattern, so it's easy to assume `--data-raw @file` behaves like `--data @file`.

If you want to load the JSON payload from a file, use one of:
```bash
curl ... --data @request.json          # interprets @ as "read from file"
curl ... --data-binary @request.json   # same, preserves exact bytes/newlines — prefer this one
```
Never `--data-raw @file`.

## 10. Verifying a key / smoke test

Minimal working request (confirmed against the Token Plan endpoint above):

```bash
curl -s -o response.json -w "%{http_code}\n" \
  --location --request POST 'https://token-plan-sgp.xiaomimimo.com/v1/chat/completions' \
  --header "api-key: $MIMO_API_KEY" \
  --header 'Content-Type: application/json' \
  --data-binary '{
    "model": "mimo-v2.5-tts",
    "messages": [
      {"role": "user", "content": "Warm, confident, friendly narrator tone."},
      {"role": "assistant", "content": "Hello, this is a quick test of the Xiaomi MiMo text to speech API."}
    ],
    "audio": {"format": "wav", "voice": "Mia"}
  }'
```
`200` + a `choices[0].message.audio.data` field with a long base64 blob means the key and endpoint are good.

## 11. Reference examples in this project

- [audio/solar_pv_pitch_30s.wav](../audio/solar_pv_pitch_30s.wav) — English, built-in voice "Dean", normal pace, ~27s
- [audio/solar_pv_pitch_asian_en.wav](../audio/solar_pv_pitch_asian_en.wav) — English, voicedesign (Malaysian-Singaporean accent), slow pace, ~29.8s
- [audio/solar_pv_pitch_zh.wav](../audio/solar_pv_pitch_zh.wav) — Chinese, built-in voice "白桦", ~25s

Request JSON payloads used to generate these are throwaway scratch files (not checked into the repo) — reconstruct from the templates in §3/§6/§7 above if you need to regenerate or vary them.

## 12. Pricing

Billing is free for a limited time (per the docs as of this writing). Usage is visible in the Console's Billing page. Don't assume this stays free indefinitely — check before building high-volume usage into anything production-facing.
