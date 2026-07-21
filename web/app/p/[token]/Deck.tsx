"use client";

import { useEffect, useRef, useState } from "react";
import type { PresentationData } from "@/lib/invoice";

const rm = (n: number | null, dp = 0) =>
  n === null
    ? "—"
    : `RM ${n.toLocaleString("en-MY", {
        minimumFractionDigits: dp,
        maximumFractionDigits: dp,
      })}`;

const SLIDES = 8;

// Narration clips per slide index, in play order. Files live in
// web/public/narration/<clip>.wav (English) and <clip>_zh.wav (Chinese).
const CLIPS: string[][] = [
  ["s0"],
  ["s1"],
  ["s2"],
  ["s3"],
  ["s4a", "s4b"],
  ["s5a", "s5b", "s5c"],
  ["s6"],
  ["s7"],
];

type Lang = "en" | "zh";

export default function Deck({ data }: { data: PresentationData }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const sections = Array.from(root.querySelectorAll<HTMLElement>(".slide"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            setActive(idx);
            e.target.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) =>
              el.classList.add("reveal"),
            );
          }
        });
      },
      { root, threshold: 0.55 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Play the active slide's narration once the presentation has started.
  // Each effect run owns its own `cancelled` flag, so scrolling to a new
  // slide (or flipping language) stops the current clip and starts fresh.
  useEffect(() => {
    if (!started) return;
    const seq = CLIPS[active] ?? [];
    let cancelled = false;
    let el: HTMLAudioElement | null = null;
    let i = 0;
    const playNext = () => {
      if (cancelled || i >= seq.length) return;
      const name = seq[i++];
      el = new Audio(`/narration/${name}${lang === "zh" ? "_zh" : ""}.wav`);
      audioRef.current = el;
      el.addEventListener("ended", playNext);
      el.play().catch(() => {
        /* autoplay blocked or interrupted — ignore */
      });
    };
    playNext();
    return () => {
      cancelled = true;
      if (el) el.pause();
      audioRef.current = null;
    };
  }, [active, started, lang]);

  const firstName = data.customerName?.split(" ")[0] ?? null;

  return (
    <div className="phone">
      {!started ? (
        <div className="start-overlay">
          <div className="start-brand">Eternalgy Solar</div>
          <h2 className="start-title">
            Your Solar PV Proposal
            {firstName ? (
              <>
                <br />
                for {firstName}
              </>
            ) : null}
          </h2>
          <p className="start-sub">
            A two-minute narrated walkthrough. Sound on.
          </p>
          <div className="start-lang">
            <button
              className={`lang-chip ${lang === "en" ? "on" : ""}`}
              onClick={() => setLang("en")}
            >
              English
            </button>
            <button
              className={`lang-chip ${lang === "zh" ? "on" : ""}`}
              onClick={() => setLang("zh")}
            >
              中文
            </button>
          </div>
          <button className="start-btn" onClick={() => setStarted(true)}>
            ▶ Start presentation
          </button>
        </div>
      ) : (
        <button
          className="lang-toggle"
          onClick={() => setLang((l) => (l === "en" ? "zh" : "en"))}
          aria-label="Toggle narration language"
        >
          {lang === "en" ? "EN · 中文" : "中文 · EN"}
        </button>
      )}

      <div className="progress-rail">
        {Array.from({ length: SLIDES }).map((_, i) => (
          <div key={i} className={`dot ${i === active ? "on" : ""}`} />
        ))}
      </div>

      <div className="deck" ref={scroller}>
        {/* 0 — Cover */}
        <section className="slide" data-idx={0}>
          <div className="slide-kicker" data-reveal>
            Eternalgy Solar
          </div>
          <h2 data-reveal>
            Your Solar PV Proposal
            {firstName ? (
              <>
                <br />
                for {firstName}
              </>
            ) : null}
          </h2>
          <p className="row-k" data-reveal>
            In the next two minutes — exactly what solar does for your home, and
            why it matters who installs it.
          </p>
          {data.invoiceNumber ? (
            <span className="pill" data-reveal>
              {data.invoiceNumber}
            </span>
          ) : null}
        </section>

        {/* 1 — Bill before vs after */}
        <section className="slide" data-idx={1}>
          <div className="slide-kicker" data-reveal>
            Your bill
          </div>
          <h2 data-reveal>Before &amp; after solar</h2>
          <div className="card" data-reveal>
            <div className="card-label">Current bill / month</div>
            <div className="stat-big">{rm(data.currentBill)}</div>
          </div>
          <div className="card" data-reveal>
            <div className="card-label">New bill / month</div>
            <div className="stat-big" style={{ color: "var(--accent-deep)" }}>
              {rm(data.newBill)}
            </div>
          </div>
          {data.savingPercent !== null ? (
            <span className="savings-badge" data-reveal>
              Save up to {Math.round(data.savingPercent)}% every month
            </span>
          ) : null}
        </section>

        {/* 2 — How we calculated it */}
        <section className="slide" data-idx={2}>
          <div className="slide-kicker" data-reveal>
            The maths
          </div>
          <h2 data-reveal>How we calculated it</h2>
          <div className="card" data-reveal>
            <div className="row">
              <span className="row-k">Est. monthly generation</span>
              <span className="row-v">
                {data.monthlyGenerationKwh !== null
                  ? `${data.monthlyGenerationKwh.toLocaleString()} kWh`
                  : "—"}
              </span>
            </div>
            <div className="row">
              <span className="row-k">Used directly (daytime)</span>
              <span className="row-v">
                {data.morningUsagePercent !== null
                  ? `${Math.round(data.morningUsagePercent)}%`
                  : "—"}
              </span>
            </div>
            <div className="row">
              <span className="row-k">Exported to grid</span>
              <span className="row-v">
                {data.morningUsagePercent !== null
                  ? `${Math.round(100 - data.morningUsagePercent)}%`
                  : "—"}
              </span>
            </div>
            <div className="row">
              <span className="row-k">New bill</span>
              <span className="row-v" style={{ color: "var(--accent-deep)" }}>
                {rm(data.newBill)}
              </span>
            </div>
          </div>
          {data.sunPeakHour !== null ? (
            <span className="pill" data-reveal>
              ☀️ {data.sunPeakHour} sun peak hours/day
            </span>
          ) : null}
          <p className="muted-note" data-reveal>
            Calculated against your actual TNB tariff structure — rate by rate.
          </p>
        </section>

        {/* 3 — Your package */}
        <section className="slide" data-idx={3}>
          <div className="slide-kicker" data-reveal>
            Your system
          </div>
          <h2 data-reveal>The package that does it</h2>
          <div data-reveal>
            <span className="stat-big">
              {data.systemKwp !== null ? data.systemKwp : "—"}
            </span>{" "}
            <span className="stat-unit">kWp</span>
          </div>
          <div className="card" data-reveal style={{ marginTop: 18 }}>
            <div className="row">
              <span className="row-k">Panels</span>
              <span className="row-v">
                {data.panelQty ?? "—"} ×{" "}
                {data.panelWatt ? `${data.panelWatt}W` : ""}
              </span>
            </div>
            <div className="row">
              <span className="row-k">Panel model</span>
              <span className="row-v">{data.panelName ?? "—"}</span>
            </div>
            <div className="row">
              <span className="row-k">Inverter</span>
              <span className="row-v">{data.inverterName ?? "—"}</span>
            </div>
          </div>
          {data.panelWarranty ? (
            <p className="muted-note" data-reveal>
              {data.panelWarranty.split("\n").join(" · ")}
            </p>
          ) : null}
        </section>

        {/* 4 — Forecast you can trust */}
        <section className="slide" data-idx={4}>
          <div className="slide-kicker" data-reveal>
            Why Eternalgy · 1
          </div>
          <h2 data-reveal>A forecast you can trust</h2>
          <p className="row-k" data-reveal>
            The most common trick in this industry is overclaimed savings. Even a
            small exaggeration — just RM50 a month — compounds to over{" "}
            <strong style={{ color: "var(--danger)" }}>RM12,000</strong> that
            never arrives, across your system&apos;s lifetime.
          </p>
          <p className="row-k" data-reveal style={{ marginTop: 14 }}>
            That&apos;s why we built <strong>Malaysia&apos;s first solar
            simulator</strong>. The numbers you just saw aren&apos;t estimates.
          </p>
        </section>

        {/* 5 — Built to survive 20 years */}
        <section className="slide" data-idx={5}>
          <div className="slide-kicker" data-reveal>
            Why Eternalgy · 2
          </div>
          <h2 data-reveal>Built to survive 20 years</h2>
          <div data-reveal>
            <span className="stat-big">15–20</span>{" "}
            <span className="stat-unit">years on your roof</span>
          </div>
          <p className="row-k" data-reveal style={{ marginTop: 16 }}>
            Cheap components fail early — a dead system at best, a fire at worst.
            We insist on the highest standard of components, engineered for the
            full system life.
          </p>
        </section>

        {/* 6 — We don't disappear */}
        <section className="slide" data-idx={6}>
          <div className="slide-kicker" data-reveal>
            Why Eternalgy · 3
          </div>
          <h2 data-reveal>We don&apos;t disappear</h2>
          <p className="row-k" data-reveal>
            Our in-house roof maintenance team responds to any roof issue, for
            the life of your system.
          </p>
          <div className="card" data-reveal style={{ marginTop: 16 }}>
            <div className="row">
              <span className="row-k">Projects in a single month</span>
              <span className="row-v">140+</span>
            </div>
            <div className="row">
              <span className="row-k">Roof types</span>
              <span className="row-v">Every type in Malaysia</span>
            </div>
            <div className="row">
              <span className="row-k">Certified by</span>
              <span className="row-v">SEDA · CIDB · MyHIJAU</span>
            </div>
          </div>
        </section>

        {/* 7 — The package & the ask */}
        <section className="slide" data-idx={7}>
          <div className="slide-kicker" data-reveal>
            The offer
          </div>
          <h2 data-reveal>{data.packageName ?? "Your package"}</h2>
          <div className="card" data-reveal>
            {data.listPrice !== null &&
            data.finalPrice !== null &&
            data.listPrice > data.finalPrice ? (
              <div className="card-label" style={{ textDecoration: "line-through" }}>
                {rm(data.listPrice)}
              </div>
            ) : null}
            <div className="card-label">Package price</div>
            <div className="stat-big">{rm(data.finalPrice)}</div>
            {data.paybackYears !== null ? (
              <span className="pill">Payback in ~{data.paybackYears} years</span>
            ) : null}
          </div>
          <button className="cta" data-reveal>
            Book your site assessment
          </button>
          <p className="muted-note" data-reveal>
            Panels, inverter, installation &amp; warranties included. Everything
            after payback is pure savings.
          </p>
        </section>
      </div>
    </div>
  );
}
