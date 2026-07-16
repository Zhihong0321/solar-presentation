# Build Brief for Claude Design — Eternalgy Solar Pitch Deck

> Paste everything below the line into Claude Design. All files referenced live in this repo (`/Users/ganzhihong/project/solar-presentation/`). Numbers are a demo persona and can be swapped later.

---

Build an animated, **mobile-only** sales presentation for a Malaysian residential solar company (Eternalgy). This is a narrated pitch deck — every slide has a pre-generated voiceover clip, and the on-screen animation must be timed to the narration. Treat this as a premium, cinematic product pitch (think Apple/Tesla keynote energy), not a corporate proposal.

## Hard constraints (do not deviate)

- **Mobile portrait only.** Design for a tall phone screen (~390×844, fluid 360–430 wide). No desktop or tablet layout. Never allow horizontal page scroll.
- **One full-viewport section per slide**, vertical scroll-snap between them, with a slim progress indicator. 8 slides total.
- **Audio-driven.** Each slide has its own narration WAV (list below). On entering a slide, its clip plays; the slide's animations are choreographed to land on specific words (cues below). Mobile browsers block autoplay with sound, so the Cover must have a "tap to begin" gesture that unlocks audio for the whole deck.
- **Animation-heavy** — this is the top priority after the content. Entrance animations on scroll-into-view, number count-ups, staggered reveals, the works. Respect `prefers-reduced-motion` with graceful fallbacks.
- **Deliverable:** a self-contained build that runs in a mobile browser. Vanilla HTML/CSS/JS or a light framework — your call. Keep assets referenced from the repo paths below.

## Visual direction

Full creative freedom on the theme. Suggested default if you have no strong preference: **"midnight & solar-gold"** — near-black canvas, a warm gold/amber energy accent, big bold confident typography, cinematic depth and parallax. The deck has a deliberate emotional arc (confidence → a fear beat → relief → pride), so the visual system should be able to shift tone, especially darkening for the safety slide. Do NOT feel bound to the company's existing green branding.

## THE core strategic principle (this shapes where the design weight goes)

**This deck sells the installer (Eternalgy), not the panel brand (JinkoSolar).** Every competitor sells the same Jinko panels, so persuading the customer that Jinko is great just sends them shopping. Jinko/SAJ appear only as small credibility logos/spec lines on the package slide — never a sales argument. **The three "Why Eternalgy" slides (4, 5, 6) are the heart of the deck and deserve the most design ambition, animation budget, and emotional weight.** Slides 1–3 set up the money; slides 4–6 are why they buy from *us*; slide 7 asks.

## Assets (in repo)

Logos (`assets/logo/`): `eternalgy.png` (white, for dark bg), `processed/jinko-logo.svg`, `processed/saj-logo.jpg`, `myhijau_plain.jpg`, `cidb-registered.png`, `Seda-Malaysia001.png`; also `assets/msig_logo.png`.
Images (`assets/image/`): `certification.png`, `processed/all-roof-type.webp`, `processed/quality-component.webp`, `processed/roof-specialist.webp`; team photo `assets/group-photo.jpg`.
Videos (`assets/video/`, short silent loops usable as ambient background texture): `jinko-heat-coefficiency.mp4`, `jinko-low-light.mp4`, `jinko-bificial.mp4`, `jinko-anti-shading.mp4`, `jinko-degradation.mp4`.

## Audio clips (in `audio/deck-en/`) — narration is fixed, sync visuals to it

| Clip | Slide | Dur | Notes |
|---|---|---|---|
| s0.wav | 0 | 10.9s | |
| s1.wav | 1 | 13.8s | |
| s2.wav | 2 | 19.2s | |
| s3.wav | 3 | 17.9s | |
| s4a.wav | 4 | 18.4s | play, then ~0.4s gap → s4b |
| s4b.wav | 4 | 13.0s | |
| s5a.wav | 5 | 17.1s | then **~1.2s silence** (hold the question on screen) → s5b |
| s5b.wav | 5 | 16.0s | then ~0.6s → s5c |
| s5c.wav | 5 | 9.1s | |
| s6.wav | 6 | 22.6s | |
| s7.wav | 7 | 18.7s | |

Slides 4 and 5 use multiple clips played in sequence within the one slide (with the gaps above) so animation beats can be triggered between them. Total narration ≈ 3 min.

## Slide-by-slide content, narration & animation cues

### Slide 0 — Cover  (s0)
Narration: *"Hi — and thank you for your time. In the next two minutes, I'll show you exactly what solar can do for your home… and why it matters who installs it."*
On screen: Eternalgy logo, a title, and a "Tap to begin" affordance (this unlocks audio). Ambient animated background (slow gold glow / light rays). Logo settles as narration starts; the phrase "who installs it" is the thesis — let it linger.

### Slide 1 — Your Bill, Before & After  (s1)
Narration: *"Right now, your electricity bill averages three hundred and eighty ringgit a month. With solar… that drops to around ninety-five. That's a seventy-five percent saving — every single month, for decades to come."*
On screen: current bill **RM 380/mo** vs new bill **RM 95/mo**; a **75%** savings badge. Anim: RM380 counts up on the first line; transitions/drops to RM95 on "drops"; the 75% badge pops last with impact. Current bill neutral, new bill in the accent color.

### Slide 2 — How We Calculated It  (s2)
Narration: *"And this number is not a guess. Your panels will generate around eight hundred and sixty kilowatt-hours a month. About forty percent powers your home directly during the day — the rest is exported to the grid for credit, calculated against your actual TNB tariff, rate by rate."*
On screen: a flow diagram — **860 kWh/mo generation** splits into **40% used directly** and **60% exported to grid**, converging into the **RM 95** new-bill figure. A small stat chip: "☀️ ~4 sun peak hours/day." A quiet tag: "Calculated by Malaysia's first solar simulator — on your actual TNB tariff." Anim: signature moment of the deck — animate a particle/energy flow from the generation node, splitting proportionally down two paths, converging on RM95 as it counts into place on "rate by rate."

### Slide 3 — Your Package  (s3)
Narration: *"Here's the system that does it. Thirteen JinkoSolar panels — six hundred and fifty watts each, Tier-one, N-type — paired with an SAJ inverter. Eight-point-four-five kilowatts, sized precisely for your roof and your usage."*
On screen: headline **8.45 kWp**; a panel line "13 × 650W JinkoSolar N-Type TOPCon" + Jinko logo + a small badge "Tier-1 · 12yr product / 30yr power warranty"; an inverter line "SAJ String Inverter" + SAJ logo; a small formula strip `13 × 650W ÷ 1000 = 8.45 kWp`. Keep this slide understated — specs, not selling. (Jinko is deliberately given minimal weight.) Anim: kWp counts up; the two equipment lines slide in staggered.

### Slide 4 — A Forecast You Can Trust  (s4a → s4b)  ★ Why Eternalgy #1
s4a: *"Now — before you compare quotes, one thing you deserve to know. The most common trick in this industry is overclaimed savings. Even a small exaggeration — just fifty ringgit a month — compounds to over twelve thousand ringgit that never arrives, across your system's lifetime."*
s4b: *"That's why we built Malaysia's first solar simulator. Your forecast is calculated on your actual TNB tariff structure. The numbers you saw just now? They're not estimates."*
On screen / anim: during s4a, show the compounding math building — **RM 50/mo → × 12 → × 20 years → RM 12,000** — the number starts innocent and counts up into an alarming figure; land the line "small lies compound." Then s4b: reveal a **"Malaysia's First Solar Simulator"** badge with warmth/pride, and a callback flash to Slide 2's flow diagram on "the numbers you saw just now." This slide's job: make every competitor's higher savings claim read as a red flag afterward.

### Slide 5 — Built to Survive 20 Years  (s5a → 1.2s silence → s5b → s5c)  ★ Why Eternalgy #2 — the emotional peak
s5a: *"Second — let me ask you something. When we don't understand a product… we pick the cheapest. When we truly understand it — we avoid the cheapest. So… are you looking for the cheapest right now?"*
s5b: *"Because this system will sit on your roof for fifteen to twenty years. Cheap components fail early. At best, a dead system. At worst… a fire, on your own home."*
s5c: *"Remember this: a real bargain is honesty. What's truly expensive… is risk."*
On screen / anim: This is the deck's darkest, most serious slide — shift the palette heavier/darker here for tonal contrast. During s5a, render the paradox as a building pull-quote, then on the final question **fade everything else out and hold the question alone on screen through the ~1.2s silence.** s5b: hero numeral **"15–20 YEARS"**; screen dims on "at worst"; the word "fire" appears once, plainly, no drama — restraint is the weight. s5c: the golden proverb types on **in Chinese with an English subtitle**, given hero typographic treatment, and stays up into the transition:
> **真正的划算是诚信，真正的昂贵是风险。**
> *(A real bargain is honesty; what's truly expensive is risk.)*
Also usable on this slide: `quality-component.webp`, and a Jinko video as ambient background texture (muted). The full opening quote for reference: 「你不了解的产品，你选最便宜。你真正了解过的产品，一定避开最便宜。请问你现在是不是在找最便宜？」

### Slide 6 — We Don't Disappear  (s6)  ★ Why Eternalgy #3
Narration: *"And third — we don't disappear after installation. Our in-house roof maintenance team responds to any roof issue, for the life of your system. One hundred and forty projects in a single month. Every roof type in Malaysia. Certified by SEDA, CIDB, and MyHIJAU."*
On screen: roof-maintenance message (`roof-specialist.webp`); proof stats — **140 projects/month**, **every roof type** (`all-roof-type.webp` — terrace/bungalow/farm/industrial), certification stamps landing one-by-one: **SEDA, CIDB, MyHIJAU, MSIG**; plus badges "Maybank Exclusive Partner", "SAJ Sole Distributor of Malaysia", "Golden Bull Award". Close on the **team group photo** (`group-photo.jpg`) with a slow Ken Burns drift. Anim: "140" counts up; roof-type tags stack in; cert logos stamp with an impact-settle motion; warm, rising confidence.

### Slide 7 — The Package & The Ask  (s7)
Narration: *"So here it is — panels, inverter, installation, and every warranty — at twenty-four thousand two hundred ringgit after discount. Payback in around six years. Everything after that… is pure savings. Shall we get your roof assessed?"*
On screen: price card **RM 24,200** (show a struck-through higher list price → discounted), a promotion badge, a warranty summary strip (Panel 12yr product / 30yr power · Inverter 10yr · Install 1yr roof-leak / 3yr workmanship / 3yr MSIG all-risk), and a primary CTA button "Book Your Free Roof Assessment." Anim: price counts down to the discounted figure; warranty strip slides in; CTA has a gentle pulsing glow on the closing question. No-pressure, warm close.

## Reference numbers (demo persona — all swappable later)
Current bill RM380/mo · New bill RM95/mo · 75% saving · 860 kWh/mo generation · 40% morning self-use / 60% export · ~4 sun peak hours · 13 × 650W Jinko N-Type TOPCon · SAJ inverter · 8.45 kWp · RM24,200 after discount · ~6yr payback · 15–20yr system life · RM50/mo overclaim → ~RM12,000 lifetime.

Deliver the build; the requesting team will review look/feel/sync and iterate.
