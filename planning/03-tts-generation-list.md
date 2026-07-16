# TTS Generation List — MiMo Batch (EN deck, v1 script)

Hand this file to the generation agent. It contains everything needed: strategy, exact payload template, and the full clip list with per-clip instruction + spoken text. Script source: `02-presentation-script.md` (locked draft). API reference: `docs/MIMO_TTS_GUIDE.md`.

## Strategy (already decided — do not change)

- **11 clips**: one wav per slide, EXCEPT slide 4 (2 clips) and slide 5 (3 clips), split at animation-sync boundaries. Clip boundaries are the sync mechanism (player triggers the next animation beat on `onended`); MiMo provides no word timestamps.
- **Model: `mimo-v2.5-tts-voiceclone` for ALL clips**, cloning from the approved anchor sample. Do NOT use `voicedesign` per-clip — it invents a slightly different voice each call and the deck would sound inconsistent.
- **Anchor sample**: `audio/solar_pv_pitch_asian_en_v2.wav` (validated Malaysian/Singaporean-accented male consultant voice). Base64-encode it once and reuse in every request's `audio.voice` field.
- Deliberate pauses (slide 5 question, slide 4 reveal) are **player-inserted silence between clips**, not baked into TTS.

## Mechanical setup

- Endpoint: `POST https://token-plan-sgp.xiaomimimo.com/v1/chat/completions`
- Headers: `api-key: <MIMO_API_KEY from credential store, id mimo-0726>` and `Content-Type: application/json`
- curl MUST use `--data-binary @file.json` (never `--data-raw @file` — sends the literal string, 400 error)
- Response audio is base64 at `choices[0].message.audio.data` → decode to `.wav`
- Output directory: `audio/deck-en/` (create it), 24kHz mono PCM16 wav files

### Payload template (identical for every clip; only the two content fields change)

```json
{
    "model": "mimo-v2.5-tts-voiceclone",
    "messages": [
        { "role": "user", "content": "<TONE INSTRUCTION from the table below>" },
        { "role": "assistant", "content": "<SPOKEN TEXT from the table below>" }
    ],
    "audio": {
        "format": "wav",
        "voice": "data:audio/wav;base64,<BASE64 OF audio/solar_pv_pitch_asian_en_v2.wav>"
    }
}
```

Base64 encode once: `base64 -i audio/solar_pv_pitch_asian_en_v2.wav | tr -d '\n'` (result ≈1.6MB, under the 10MB limit).

## Clip list

### s0.wav — Cover (~8 s target)
**Tone instruction:** Warm, unhurried, welcoming consultant tone. Natural conversational pace. A slight knowing emphasis on the word "who".
**Spoken text:** Hi — and thank you for your time. In the next two minutes, I'll show you exactly what solar can do for your home… and why it matters who installs it.

### s1.wav — Bill Before/After (~13 s)
**Tone instruction:** Confident and upbeat, genuinely pleased to deliver good news. Small pause before "ninety-five", let the savings number land proudly.
**Spoken text:** Right now, your electricity bill averages three hundred and eighty ringgit a month. With solar… that drops to around ninety-five. That's a seventy-five percent saving — every single month, for decades to come.

### s2.wav — Calculation (~19 s)
**Tone instruction:** Measured, precise, trustworthy — an engineer explaining, not a salesman pitching. Slow down slightly on "rate by rate" for emphasis.
**Spoken text:** And this number is not a guess. Your panels will generate around eight hundred and sixty kilowatt-hours a month. About forty percent powers your home directly during the day — the rest is exported to the grid for credit, calculated against your actual TNB tariff, rate by rate.

### s3.wav — Package (~12 s)
**Tone instruction:** Brisk and matter-of-fact, stating specifications plainly with quiet confidence. No selling energy on this one.
**Spoken text:** Here's the system that does it. Thirteen JinkoSolar panels — six hundred and fifty watts each, Tier-one, N-type — paired with an SAJ inverter. Eight-point-four-five kilowatts, sized precisely for your roof and your usage.

### s4a.wav — Forecast: the scam + compounding math (~15 s)
**Tone instruction:** Drop to a quieter, more serious, confiding register — sharing an uncomfortable industry truth with the listener. Deliberate pacing on the numbers so they register.
**Spoken text:** Now — before you compare quotes, one thing you deserve to know. The most common trick in this industry is overclaimed savings. Even a small exaggeration — just fifty ringgit a month — compounds to over twelve thousand ringgit that never arrives, across your system's lifetime.

### s4b.wav — Forecast: the simulator reveal (~9 s)
**Tone instruction:** Warmth and pride returning, building to quiet confidence. The last sentence delivered almost with a smile.
**Spoken text:** That's why we built Malaysia's first solar simulator. Your forecast is calculated on your actual TNB tariff structure. The numbers you saw just now? They're not estimates.

### s5a.wav — Safety: the cheapest paradox + question (~12 s)
**Tone instruction:** Conversational and almost playful at first, like posing a riddle, then the final question turns direct and sincere — genuinely asking the listener, not accusing. End cleanly on the question with a rising tone.
**Spoken text:** Second — let me ask you something. When we don't understand a product… we pick the cheapest. When we truly understand it — we avoid the cheapest. So… are you looking for the cheapest right now?

### s5b.wav — Safety: the fear section (~11 s)
**Tone instruction:** Grave, low, slow, deliberate — the most serious moment of the entire presentation. Say "a fire" plainly, once, without any added drama; the plainness is the weight.
**Spoken text:** Because this system will sit on your roof for fifteen to twenty years. Cheap components fail early. At best, a dead system. At worst… a fire, on your own home.

### s5c.wav — Safety: the golden proverb (~8 s)
**Tone instruction:** Delivered like a proverb — measured, final, wise. Slow, even pacing with a pause at the ellipsis. This is the moral of the story.
**Spoken text:** Remember this: a real bargain is honesty. What's truly expensive… is risk.

### s6.wav — Team (~17 s)
**Tone instruction:** Warm and steady with rising confidence through the list of proof points. A touch of earned pride on "one hundred and forty projects".
**Spoken text:** And third — we don't disappear after installation. Our in-house roof maintenance team responds to any roof issue, for the life of your system. One hundred and forty projects in a single month. Every roof type in Malaysia. Certified by SEDA, CIDB, and MyHIJAU.

### s7.wav — Close (~14 s)
**Tone instruction:** Relaxed, unhurried close with zero pressure. The final question is a genuine, friendly invitation — end warm and open.
**Spoken text:** So here it is — panels, inverter, installation, and every warranty — at twenty-four thousand two hundred ringgit after discount. Payback in around six years. Everything after that… is pure savings. Shall we get your roof assessed?

## QC checklist (per clip, after generation)

1. HTTP 200 and `choices[0].message.audio.data` present; decoded file is valid RIFF WAV 24kHz mono (`file` / `afinfo`).
2. Duration within ±30% of the target above — if far off, the pace instruction didn't take; regenerate.
3. Listen: voice must match the anchor sample across ALL clips (same person). Any clip that drifts → regenerate.
4. Listen: no truncation of the final word, no artifacts on the ellipsis pauses.
5. Slide 5 clips (s5a/b/c): confirm tonal progression playful → grave → proverb reads as one performance when played with ~1.2 s gap after s5a and ~0.5 s gaps elsewhere.

## Player gap map (for the deck build later, not TTS)

| Boundary | Gap |
|---|---|
| s4a → s4b | ~0.4 s (math lands, then reveal) |
| s5a → s5b | **~1.2 s** (the deliberate silence after the question) |
| s5b → s5c | ~0.6 s (breath before the proverb) |
| All other clips | one per slide; trigger on scroll-into-view |

## Not in this batch

- 中文 version: separate batch after EN is approved — golden quotes spoken verbatim (「你不了解的产品，你选最便宜。你真正了解过的产品，一定避开最便宜。请问你现在是不是在找最便宜？」 and 「真正的划算是诚信，真正的昂贵是风险。」); needs its own Chinese anchor voice decision (built-in 白桦 tested well vs. cloning a Chinese sample).
- Any real-client numbers: this batch uses the demo persona (RM380/RM95/8.45kWp/RM24,200). Regenerate affected clips (s1, s2, s3, s7) when real inputs arrive — the per-slide split means the Eternalgy clips (s4–s6) never need regenerating.
