# Deck EN Audio Manifest

Generated via `mimo-v2.5-tts-voiceclone`, all cloned from anchor `audio/solar_pv_pitch_asian_en_v2.wav` (consistent Malaysian-accented male consultant voice). 24kHz mono WAV. Script: `planning/02-presentation-script.md`. Demo-persona numbers (RM380/RM95/8.45kWp/RM24,200).

| Clip | Slide | Duration | Player gap after | Notes |
|---|---|---|---|---|
| s0.wav | 0 Cover | 10.9s | scroll | |
| s1.wav | 1 Bill | 13.8s | scroll | |
| s2.wav | 2 Calculation | 19.2s | scroll | |
| s3.wav | 3 Package | 17.9s | scroll | |
| s4a.wav | 4 Forecast (scam+math) | 18.4s | ~0.4s | → s4b |
| s4b.wav | 4 Forecast (simulator reveal) | 13.0s | scroll | |
| s5a.wav | 5 Safety (paradox+question) | 17.1s | **~1.2s** | deliberate silence after the question |
| s5b.wav | 5 Safety (fear) | 16.0s | ~0.6s | → s5c |
| s5c.wav | 5 Safety (proverb) | 9.1s | scroll | |
| s6.wav | 6 Team | 22.6s | scroll | |
| s7.wav | 7 Close | 18.7s | end | |

**Total narration: ~2 min 57 s** (+ ~2.2s of player-inserted gaps).

Ran ~30s longer than the script estimate — the cloned voice speaks a touch more deliberately than the conversational word/sec assumption. Fine for a considered sales pitch; if a tighter runtime is wanted, s3 (17.9s for a spec line) and s6 (22.6s) are the trim candidates.

## Regeneration
- Payloads in `payloads/*.json` (each embeds the base64 anchor). Regenerate any clip with:
  `curl -s --location --request POST 'https://token-plan-sgp.xiaomimimo.com/v1/chat/completions' --header 'api-key: $KEY' --header 'Content-Type: application/json' --data-binary @payloads/sX.json` then decode `choices[0].message.audio.data`.
- Client-specific clips (swap when real numbers arrive): **s1, s2, s3, s7**. Brand/Eternalgy clips (s0, s4a, s4b, s5a, s5b, s5c, s6) never change.
- `payloads/` + `_anchor.b64` are ~19MB of intermediate files — safe to delete once clips are final; regenerate the base64 from the anchor wav if needed.
