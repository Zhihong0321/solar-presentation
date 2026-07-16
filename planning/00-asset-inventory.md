# Asset & Content Inventory — Eternalgy Solar PV Proposal Reference

Source: [ee-proposal-production.up.railway.app](https://ee-proposal-production.up.railway.app) (shell.html, uid `8ca0972e-f184-4431-9724-eeb5fc439a7e` — a placeholder/demo quotation, "Sample Quotation", no real client financials). Pulled for branding, copy, structural reference, and reusable media only — **not** as the data source for the actual slide (that comes from the 6 user inputs, see `01-slide-plan.md`).

## Brand tokens (extracted from live CSS variables)

| Token | Value | Use |
|---|---|---|
| `--gp` | `#16a34a` | Primary green (CTAs, key numbers) |
| `--gl` | `#22c55e` | Light green (highlights, success states) |
| `--gb` | `#dcfce7` | Green surface/background tint |
| `--gbd` | `#86efac` | Green border |
| `--gd` | `#14532d` | Deep green (headings on light bg) |
| `--page-bg` | `#bbf7d0` | Outer page background (mint) |
| `--app-bg` | `#f1f5f1` | App surface background |
| `--navbar-bg` | `#0d1f0f` | Bottom nav / hero background (near-black green) |
| `--dark-card` | `#1a2e1c` | Dark card surface |
| `--darkest-card` | `#091407` | Darkest card surface |
| `--warning-bg` / `--warning-text` | `#fffbeb` / `#d97706` | Warning banners |
| Font | `'Plus Jakarta Sans'` | All text — bold, rounded, geometric sans |

Visual identity: near-black deep-green hero sections with bright green (`#22c55e`/`#16a34a`) accent numbers and pill badges, white text on dark, mint-green page backdrop. Card-based mobile layout with generous rounding.

## Downloaded assets (local paths, relative to project root)

### Logos — `assets/logo/`
| File | Source | Notes |
|---|---|---|
| `eternalgy.png` | Eternalgy company logo (white/transparent, for dark backgrounds) |
| `processed/jinko-logo.svg` | JinkoSolar logo (vector) |
| `processed/saj-logo.jpg` | SAJ inverter logo (red/white) |
| `myhijau_plain.jpg` | MyHIJAU equipment certification mark |
| `cidb-registered.png` | CIDB registered contractor badge |
| `Seda-Malaysia001.png` | SEDA Malaysia registered badge |
| `../msig_logo.png` | MSIG insurance logo (solar all-risk warranty) |

### Images — `assets/image/`
| File | Content |
|---|---|
| `certification.png` | Combined certification graphic |
| `processed/all-roof-type.webp` | "Proven Experience" — roof types (terrace/bungalow/farm/industrial) |
| `processed/quality-component.webp` | "No Compromise" — premium component visual |
| `processed/roof-specialist.webp` | "Roof Expertise" — in-house roofing specialist visual |
| `../group-photo.jpg` | Eternalgy team group photo |

### Videos — `assets/video/` (from the "Why Jinko" Tiger Neo 3.0 comparison tool)
| File | Comparison topic |
|---|---|
| `jinko-heat-coefficiency.mp4` | Heat coefficient vs Canadian Solar TOPHiKu6 |
| `jinko-low-light.mp4` | Low-light yield vs LONGi Hi-MO X6 Explorer |
| `jinko-bificial.mp4` | Bifacial gain vs LONGi Hi-MO X6 Guardian Bifacial |
| `jinko-anti-shading.mp4` | Anti-shading vs Trina Solar Vertex |
| `jinko-degradation.mp4` | Degradation rate vs JA Solar DeepBlue 3.0 |

These are short demo clips built for an interactive slider tool (panels/wattage/sun-hours/RM-per-kWh inputs recompute live savings) — in our static slide deck we'll use them as autoplay background/inline loops next to a static headline stat rather than rebuild the live calculator.

## Content gathered (for copywriting reference — not verbatim data)

### Package / system structure (from PROPOSAL tab, use as a template only)
- System sizing formula: `panel qty × panel wattage ÷ 1000 = kWp`
- Example package shown: 13 × 650W JinkoSolar N-Type TOPCon = 8.45 kWp, paired with [3P] SAJ R6 6kW String Inverter
- Standard warranty language: Panel "12 Years Product Warranty + 30 Years Linear Power Warranty"; Inverter "10 Years Product Warranty"; Install "1 Year Roof Leaking Warranty, 3 Years Workmanship Warranty, 3 Years MSIG Solar Insurance (all-risk)"
- Certifications to display: CIDB Registered Contractor, SEDA Registered PV Service Provider & Investor, MyHIJAU Equipment Certification (on inverter)

### Why Jinko (from tiger-neo3.html — "Tiger Neo 3.0")
Five technical advantage categories, each framed as "Tiger Neo 3.0 vs a named competitor panel," each with a 10-year kWh/RM extra-savings stat driven by an interactive assumptions panel (roof heat, sun hours, RM/kWh):
1. **Heat Co-efficiency** — temp coefficient −0.26%/°C vs −0.30%/°C for other N-type panels (Canadian Solar TOPHiKu6 etc.) — better performance on hot Malaysian roofs
2. **Low Light Response** — ~2.5% yield lift vs LONGi Hi-MO X6 Explorer (BC Tech) — keeps output through dawn/dusk/haze/monsoon overcast
3. **Bi-Facial Gain** — vs LONGi Hi-MO X6 Guardian Bifacial — transparent rear side harvests reflected roof-albedo light
4. **Anti-Shading** — vs Trina Solar Vertex (standard half-cut) — multi-cell power protection reduces losses from partial shade
5. **Degradation Rate** — vs JA Solar DeepBlue 3.0 (P-type PERC) — lower first-year + annual degradation over a 10-year warranty curve

Headline stat template: *"In 10 years, for your [X] kWp system, you can save a total of RM [Y] more compared with other Tier 1 panels."* (demo showed RM 5,566 for an 8.45 kWp system — recompute per real system size, don't reuse verbatim.)

### Why Eternalgy (from why-eternalgy.html) — 5 pillars, use near-verbatim (this is brand messaging, not per-client data)
1. **Efficiency** — systemized, disciplined in-house team; completed 140 projects in a single month; faster delivery = sooner green returns
2. **Experience** — proven across terrace houses, bungalows, farms, heavy industrial facilities; hands-on engineering refinement
3. **No Compromise** — "true value is safety, the real cost is risk"; premium components over cheapest-price competition; 20+ year investment horizon
4. **Roof Expertise** — dedicated in-house roofing specialists; minimizes install risk, can repair/reinforce roofs
5. **Authority** — SEDA, CIDB, Maybank Exclusive Partner, SAJ Sole Distributor of Malaysia, SHRDC CoE Partner, Malaysia Golden Bull Award

### Quotation structure (from quotation.html — template only, not real pricing)
- Line-item format: package lot price + included Jinko modules/SAJ inverter/installation (shown as "Included," no separate price)
- Payment schedule: 5% on sign-up, 60% on SEDA approval, 35% on installation complete
- Standard footer: warranty policy, refund policy, privacy policy blocks (available if the final deck needs a compliance/fine-print slide, but not required for a 30–60s pitch deck)

## Not available from this source (must come from the 6 user inputs per presentation)
Current TNB bill, expected new TNB bill, morning offset ratio, sun peak hours, and the actual package price/discount/promotion for a real client are **not** in this demo proposal — the demo has no consumption data at all ("Installation address pending", "Sample Quotation"). These are supplied fresh per presentation per the input spec in `01-slide-plan.md`.
