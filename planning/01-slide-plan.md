# Solar PV Residential Pitch — Slide Plan (Mobile-Only, Animated)

Status: **planning only — no code yet.**

## Core strategic principle (read this before anything else)

**The pitch sells Eternalgy, not JinkoSolar.** Every competing installer in this market also sells Jinko panels. Spending the deck's persuasion budget proving Jinko is a great panel does nothing to win the sale — a convinced customer can walk away and buy the same Jinko panels from any other EPC. The panel brand is table stakes, not a differentiator. **Eternalgy — the installer, the workmanship, the warranty, the company — is the only thing in this pitch that's actually exclusive to us,** and it's the only argument that closes the deal. The deck's weight, slide count, and animation budget go to "Why Eternalgy." Jinko gets a brief credibility mention (Tier-1 badge, spec line) folded into the package slide — not its own deep-dive.

This overrides the earlier draft of this plan, which gave Jinko a full dedicated slide with 5 comparison videos. That structure is now wrong and has been corrected below.

## Format decision

- **Mobile viewport only.** Design at a tall portrait canvas — target `390×844` (iPhone-class) as the design reference, fluid between roughly `360×780` to `430×932`. No desktop/tablet layout is in scope.
- **Delivery model:** full-viewport-height scroll-snap sections (one "slide" = one 100vh section), swipe/scroll to advance, small progress-dot rail.
- **Animation-heavy**, per user preference — and full creative freedom on visual theme, not tied to Eternalgy's existing green branding. Every slide gets an entrance animation on scroll-into-view plus the specific micro-animations noted per slide.
- **Numbers**: real client inputs (bill, package, price) come later. Until then, use a clearly-fictional but sensible demo persona — e.g. RM380/month → RM95/month, "savings up to 75% in the best case" — so design/animation work isn't blocked on real data.

## Inputs (supplied fresh per client/presentation)

| # | Input | Used in |
|---|---|---|
| 1 | Current average TNB bill (RM/month) | Slide 1 |
| 2 | Expected new TNB bill after solar (RM/month) | Slide 1, Slide 2 |
| 3 | Solar package info: panel qty, panel model, inverter model, system size (kWp) | Slide 3 |
| 4 | Morning offset ratio (% self-consumed before export) | Slide 2 |
| 5 | Expected sun peak hours | Slide 2 |
| 6 | Package price, discount, promotion, warranty | Slide 7 |

## Slide-by-slide

### Slide 0 — Cover
- Eternalgy logo, headline ("Your Solar PV Proposal" / client name placeholder)
- Subtle animated background (soft glow pulse or slow-panning gradient)
- Entrance: logo fade+scale in, headline slides/types on

### Slide 1 — Bill: Before vs. After
Content flow item 1: brief current bill + expected saving.
- Two big stat cards: "Current Bill" (input #1) vs "New Bill" (input #2)
- Savings badge: `Current − New = RM saved/month`, framed with "savings up to 75%" as the demo headline stat
- Animation: current-bill number counts up, arrow/slide transitions to new-bill card counting down, savings badge pops in last with scale+bounce

### Slide 2 — How We Calculated It
Content flow item 2: generation → offset% direct use → export% to grid → new bill.
- Flow diagram: `Solar generation (kWh)` → splits into `[morning offset %] used directly` and `[100 − offset %] exported to grid` → converges into `New bill RM Y`
- Supporting stat chip: "☀️ X sun peak hours/day expected" (input #5)
- Provenance tag on this slide: "Calculated by Malaysia's first solar simulator — against your actual TNB tariff structure" — quietly plants the simulator claim here so Slide 4's Pillar 1 lands as a callback ("the numbers you just saw weren't estimates")
- Animation: particle-flow diagram — dots move from the generation node, split proportionally along two paths, converge on the new-bill number counting down into place. Signature animation of the deck.

### Slide 3 — Your Package (Jinko folded in here, not a separate slide)
Content flow item 3: panel qty + inverter model. Jinko's mention lives here as a spec/credibility line, not a sales argument.
- Big system-size stat (kWp) as headline number
- Panel line: quantity × model + Jinko logo + a single credibility badge ("Tier-1 Panel · N-Type TOPCon · 12yr product / 30yr power warranty") — one line, not a slide
- Inverter line: model + SAJ logo
- Formula strip: `panels × wattage ÷ 1000 = kWp`
- Animation: kWp number counts up; panel/inverter lines slide in staggered

### Slides 4–6 — Why Eternalgy (three full slides — the deck's core argument)
Content flow item 5, expanded per user's allocation (2026-07-16): **3 slides**. Each Tier-1 differentiator gets its own full-viewport slide with its own fear→relief arc. The site's five pillars are absorbed as supporting elements, not separate cards. Combined, slides 4–6 teach one lesson three ways: *what looks cheap or optimistic today compounds against you over 15–20 years — Eternalgy is built for the long run.*

#### Slide 4 — "A Forecast You Can Trust" (the Simulator)
- **Fear first:** overclaimed savings are the industry's most common scam — customers sign on a promised monthly saving that never materializes. The damage compounds: an overclaim of *just RM50/month* looks harmless on a quote, but over a 15–20 year system life it's **RM9,000–RM12,000 of savings that never arrive**, plus a payback period quietly stretching years past what was promised.
- **Signature animation:** the compounding math builds on screen — `RM50/mo → × 12 → × 20 yrs → RM12,000` — the number starts innocent and counts up into a disaster. Landing line: *"Small lies compound."*
- **Relief:** "That's why we built **Malaysia's First Solar Simulator** — your forecast is calculated against your actual TNB tariff structure." Callback to Slide 2: *"the numbers you saw earlier weren't estimates."*
- **Inoculation effect:** after this slide, every competitor's higher savings claim reads as a red flag, not a better deal.

#### Slide 5 — "Built to Survive 20 Years" (component safety)
- **Fear first:** a solar system must run 15–20 years on your roof, through heat, monsoon, and time. Cheap components fail early — a quick-dead PV system at best; at worst, **fire on your home**. Saving a few thousand ringgit up front can cost the entire system — or far more.
- Hero numeral: **"15–20 YEARS"**; the fire word appears once, deliberately, with weight — not repeated, not decorated.
- **Relief:** "We insist on the highest standard of solar components — durability and safety margins engineered for the full system life." Supporting imagery: `quality-component.webp`, Jinko B-roll as ambient texture.
- Visual direction: the darkest, most serious slide in the deck — tonal contrast is what makes the fear-beat land.

#### Slide 6 — "We Don't Disappear" (the team behind the system)
- **Fear first (light touch):** the industry's most common horror story — the installer who vanishes after collecting final payment.
- **Relief:** dedicated, experienced **roof maintenance team** that responds to any roof problem after installation, for the life of the system. Supporting: `roof-specialist.webp`.
- **Proof stack (absorbs the site's Tier-2 pillars):** 140 projects in a single month · in-house team · all roof types (terrace/bungalow/farm/industrial, `all-roof-type.webp` tag stack) · certification stamps landing one-by-one (SEDA, CIDB, MyHIJAU, MSIG) · Maybank Exclusive Partner · Golden Bull Award
- **Close:** full-bleed group photo (`group-photo.jpg`), Ken Burns drift — the deck's one human moment, immediately before the price ask.

- Animation across 4–6: strongest of the deck — count-ups, impact-settle stamp motion, per-slide parallax; each slide opens with its fear-beat before resolving to the Eternalgy answer.

### Slide 7 — Package, Price & Promotion
Content flow item 6.
- Price card: package price, strikethrough original if discounted, promotion badge
- Warranty summary strip (panel/inverter/install warranty)
- CTA button: "Get This Deal" / "Book Your Site Visit"
- Animation: price counts down to discounted price, promotion badge pop with shine flourish, CTA has pulsing glow

## Cross-cutting notes

- **Messaging discipline**: anywhere Jinko/SAJ appear outside Slide 3's credibility line, keep it to a logo/badge, never a persuasion argument. The persuasion budget is Eternalgy's.
- **Narration/TTS**: MiMo TTS pipeline validated earlier (`docs/MIMO_TTS_GUIDE.md`) can voice this slide-by-slide later — per-slide 5–10s clips triggered on scroll-into-view, not built yet.
- **Language**: EN/中文 toggle possible later, consistent with earlier Chinese pitch work.
- **Theme**: full creative freedom confirmed — not bound to Eternalgy's existing green branding. Direction TBD at build time.

## Open questions before build

1. Any real client inputs ready yet, or proceed with the demo persona (RM380→RM95, 75% savings) for the first build?
2. Visual theme direction — any reference/mood you want, or fully open for me to propose at build time?
3. TTS narration wired in for this first build, or visual-only for now?
