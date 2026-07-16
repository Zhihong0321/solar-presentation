# Presentation Script — v1 Draft (finalize before TTS)

Status: **script only — no TTS generated yet**, per workflow: finalize script → send to Xiaomi MiMo TTS → build slides + animation to support the speech.

- Voice target: warm Malaysian/Singaporean-accented English consultant (the `voicedesign` recipe validated in `docs/MIMO_TTS_GUIDE.md`), natural conversational pace with lively intonation — *not* the "slow and deliberate" instruction (user rated it flat).
- Numbers below use the agreed demo persona (RM380 → RM95, 75% best case, 8.45 kWp demo package). All swappable — see table at bottom.
- Pace budget: ~2.3–2.5 words/sec conversational. Total ≈ 360 words ≈ **~2 min 25 s** across 8 clips (slide 5 runs longest at ~30 s — it carries the golden quotes and earns the time). Each slide gets its own TTS clip, triggered on scroll-into-view.
- Numbers are written out as words where TTS pronunciation matters.

---

## Slide 0 — Cover (~8 s, 27 words)

> Hi — and thank you for your time. In the next two minutes, I'll show you exactly what solar can do for your home… and why it matters *who* installs it.

**Tone:** warm, unhurried welcome; slight emphasis on "who."
**Sync cue:** logo settles as "thank you" lands; headline appears on "solar."

## Slide 1 — Your Bill, Before & After (~13 s, 33 words)

> Right now, your electricity bill averages three hundred and eighty ringgit a month. With solar… that drops to around ninety-five. That's a seventy-five percent saving — every single month, for decades to come.

**Tone:** confident, upbeat; let "ninety-five" land with a small pause before it.
**Sync cue:** RM380 counts up during first sentence; drops to RM95 on "drops"; 75% badge pops on "seventy-five percent."

## Slide 2 — How We Calculated It (~19 s, 48 words)

> And this number is not a guess. Your panels will generate around eight hundred and sixty kilowatt-hours a month. About forty percent powers your home directly during the day — the rest is exported to the grid for credit, calculated against your actual TNB tariff, rate by rate.

**Tone:** measured, precise — the "engineer" moment of the deck; slow slightly on "rate by rate."
**Sync cue:** particle flow starts on "generate"; splits into two streams on "forty percent"; converges into the RM95 figure on "rate by rate."

## Slide 3 — Your Package (~12 s, 34 words)

> Here's the system that does it. Thirteen JinkoSolar panels — six hundred and fifty watts each, Tier-one, N-type — paired with an SAJ inverter. Eight-point-four-five kilowatts, sized precisely for your roof and your usage.

**Tone:** brisk, matter-of-fact — specs, not selling. (Deliberate: Jinko gets ten words, per strategy.)
**Sync cue:** kWp counts up on "eight-point-four-five"; panel and inverter lines slide in on their names.

## Slide 4 — A Forecast You Can Trust (~24 s, 62 words)

> Now — before you compare quotes, one thing you deserve to know. The most common trick in this industry is overclaimed savings. Even a small exaggeration — just fifty ringgit a month — compounds to over twelve thousand ringgit that never arrives, across your system's lifetime. That's why we built Malaysia's *first* solar simulator. The numbers you saw just now? They're not estimates.

**Tone:** drop to a quieter, more serious register on "trick"; rebuild warmth and pride on "Malaysia's first"; the last line almost a smile.
**Sync cue:** RM50 appears small on "fifty ringgit"; multiplies ×12 → ×20 → RM12,000 during "compounds"; simulator badge lands on "Malaysia's first"; callback flash of Slide 2's flow diagram on "the numbers you saw just now."

## Slide 5 — Built to Survive 20 Years (~30 s, 76 words)

> Second — let me ask you something. When we don't understand a product… we pick the cheapest. When we truly understand it — we avoid the cheapest. So… are you looking for the cheapest right now? Because this system will sit on your roof for fifteen to twenty years. Cheap components fail early. At best, a dead system. At worst… a fire, on your own home. Remember this: a real bargain is honesty. What's truly expensive… is risk.

**Tone:** the gravest slide of the deck. Opens conversational, almost playful on the paradox; the question lands and *pauses* — let silence sit for a beat. Then lower and slower through the fear section; "fire" said once, plainly. The closing couplet delivered like a proverb — measured, final.
**Sync cue:** the paradox renders as a two-line pull-quote building word-by-word; on the question, everything else fades — question alone on screen, hold through the pause; "15–20 YEARS" numeral on the year count; screen dims on "at worst"; the golden couplet (真正的划算是诚信，真正的昂贵是风险) types on in Chinese with English subtitle as the closing line is spoken — stays on screen into the slide transition.

**Golden quotes embedded (user-supplied, keep verbatim in 中文 version):**
1. 「你不了解的产品，你选最便宜。你真正了解过的产品，一定避开最便宜。请问你现在是不是在找最便宜？」 — opens this slide
2. 「真正的划算是诚信，真正的昂贵是风险。」 — closes this slide; on-screen in Chinese even in the EN deck (typographic hero treatment), because it doubles as a brand proverb
3. Note: in the 中文 audio version these are spoken exactly as written above — the EN narration is a rendering, the Chinese is the original.

## Slide 6 — We Don't Disappear (~17 s, 44 words)

> And third — we don't disappear after installation. Our in-house roof maintenance team responds to any roof issue, for the life of your system. One hundred and forty projects in a single month. Every roof type in Malaysia. Certified by SEDA, CIDB, and MyHIJAU.

**Tone:** warm and steady, rising confidence through the proof stack; a touch of pride on "one hundred and forty."
**Sync cue:** maintenance-team image on the first sentence; "140" counts up on its line; roof-type tags stack on "every roof type"; cert stamps land one-by-one on the three names; group photo crossfades in as the clip ends.

## Slide 7 — The Package & The Ask (~14 s, 37 words)

> So here it is — panels, inverter, installation, and every warranty — at twenty-four thousand two hundred ringgit after discount. Payback in around six years. Everything after that… is pure savings. Shall we get your roof assessed?

**Tone:** relaxed close, no pressure; genuine invitation on the final question.
**Sync cue:** price counts down from list price to discounted on "after discount"; warranty strip slides in on "every warranty"; CTA button glows on the final question.

---

## Placeholder swap table (update before real-client TTS)

| Placeholder | Demo value | Slides affected |
|---|---|---|
| Current bill | RM 380/month | 1 |
| New bill | RM 95/month | 1, 2 |
| Saving % | 75% | 1 |
| Monthly generation | 860 kWh | 2 |
| Morning offset | 40% | 2 |
| Panel qty × model | 13 × 650 W JinkoSolar N-type | 3 |
| Inverter | SAJ (model TBD) | 3 |
| System size | 8.45 kWp | 3 |
| Package price | RM 24,200 after discount | 7 |
| Payback | ~6 years | 7 |

Sun peak hours (input #5) intentionally not voiced — it lives on-screen as a stat chip on Slide 2 to keep the clip tight.

## Open items before TTS

1. User review/edit of every line above — this is the finalize gate.
2. Chinese (中文) version: translate after EN is locked, one pass, using a Chinese built-in voice (白桦 tested well) or a matching voicedesign description.
3. Decide per-slide clip filenames + whether Slide 0 autoplays or waits for first tap (mobile browsers block autoplay audio — likely need a "tap to start" gesture on the cover).
