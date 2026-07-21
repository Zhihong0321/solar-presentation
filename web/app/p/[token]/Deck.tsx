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

// On-screen copy in both languages. Chinese wording follows the audio
// narration script from the original Solar Pitch deck.
const COPY = {
  en: {
    startSub: "A two-minute narrated walkthrough. Sound on.",
    startBtn: "▶ Start presentation",
    proposalTitle: "Your Solar PV Proposal",
    forName: (n: string) => `for ${n}`,
    coverSub:
      "In the next two minutes — exactly what solar does for your home, and why it matters who installs it.",
    s1kicker: "Your bill",
    s1h: "Before & after solar",
    curBill: "Current bill / month",
    newBillMo: "New bill / month",
    save: (p: number) => `Save up to ${p}% every month`,
    s2kicker: "The maths",
    s2h: "How we calculated it",
    genLabel: "Est. monthly generation",
    usedDirect: "Used directly (daytime)",
    exported: "Exported to grid",
    newBill: "New bill",
    sunPeak: (h: number) => `☀️ ${h} sun peak hours/day`,
    s2note: "Calculated against your actual TNB tariff structure — rate by rate.",
    s3kicker: "Your system",
    s3h: "The package that does it",
    panels: "Panels",
    panelModel: "Panel model",
    inverter: "Inverter",
    s4kicker: "Why Eternalgy · 1",
    s4h: "A forecast you can trust",
    s4p1a:
      "The most common trick in this industry is overclaimed savings. Even a small exaggeration — just RM50 a month — compounds to over ",
    s4strong: "RM12,000",
    s4p1b: " that never arrives, across your system's lifetime.",
    s4p2a: "That's why we built ",
    s4p2strong: "Malaysia's first solar simulator",
    s4p2b: ". The numbers you just saw aren't estimates.",
    s5kicker: "Why Eternalgy · 2",
    s5h: "Built to survive 20 years",
    yearsOnRoof: "years on your roof",
    s5p: "Cheap components fail early — a dead system at best, a fire at worst. We insist on the highest standard of components, engineered for the full system life.",
    s6kicker: "Why Eternalgy · 3",
    s6h: "We don't disappear",
    s6p: "Our in-house roof maintenance team responds to any roof issue, for the life of your system.",
    projMonth: "Projects in a single month",
    roofTypes: "Roof types",
    everyType: "Every type in Malaysia",
    certBy: "Certified by",
    s7kicker: "The offer",
    defaultPkg: "Your package",
    pkgPrice: "Package price",
    payback: (y: number) => `Payback in ~${y} years`,
    cta: "Book your site assessment",
    s7note:
      "Panels, inverter, installation & warranties included. Everything after payback is pure savings.",
  },
  zh: {
    startSub: "两分钟语音导览 — 请开启声音。",
    startBtn: "▶ 开始演示",
    proposalTitle: "您的太阳能发电方案",
    forName: (n: string) => `为 ${n} 准备`,
    coverSub:
      "接下来的两分钟，为您说明太阳能到底能为您的家带来什么，以及为什么选择安装的人很重要。",
    s1kicker: "您的电费",
    s1h: "安装前后对比",
    curBill: "目前每月电费",
    newBillMo: "安装后每月电费",
    save: (p: number) => `每月最高可省 ${p}%`,
    s2kicker: "计算方式",
    s2h: "我们如何计算",
    genLabel: "预计每月发电量",
    usedDirect: "白天直接使用",
    exported: "输出至电网换取回扣",
    newBill: "新电费",
    sunPeak: (h: number) => `☀️ 每日约 ${h} 小时日照高峰`,
    s2note: "根据您实际的 TNB 电费级距，逐级精算。",
    s3kicker: "您的系统",
    s3h: "为您配置的方案",
    panels: "太阳能板",
    panelModel: "板型号",
    inverter: "逆变器",
    s4kicker: "为什么选择 Eternalgy · 1",
    s4h: "值得信赖的预测",
    s4p1a:
      "这个行业最常见的手法，就是夸大节省金额。哪怕每月只多算 RM50，在系统的使用年限内，累积起来也会是超过 ",
    s4strong: "RM12,000",
    s4p1b: " 永远不会兑现的差距。",
    s4p2a: "这就是为什么，我们打造了 ",
    s4p2strong: "马来西亚首创的太阳能模拟系统",
    s4p2b: "。您刚才看到的数字，绝非随口估算。",
    s5kicker: "为什么选择 Eternalgy · 2",
    s5h: "为二十年使用而打造",
    yearsOnRoof: "年屋顶寿命",
    s5p: "廉价配件容易提早损坏 — 轻则系统瘫痪，重则引发火患。我们坚持采用最高标准的配件，专为完整的系统寿命而设计。",
    s6kicker: "为什么选择 Eternalgy · 3",
    s6h: "我们不会消失",
    s6p: "我们拥有自己的屋顶维护团队，在系统的整个使用年限内，随时处理任何屋顶问题。",
    projMonth: "单月完成项目",
    roofTypes: "屋顶类型",
    everyType: "马来西亚各种屋顶",
    certBy: "认证机构",
    s7kicker: "报价",
    defaultPkg: "您的方案",
    pkgPrice: "方案价格",
    payback: (y: number) => `约 ${y} 年回本`,
    cta: "预约免费屋顶评估",
    s7note:
      "包含太阳能板、逆变器、安装工程与所有保固。回本之后的每一分钱，都是纯粹的节省。",
  },
};

export default function Deck({ data }: { data: PresentationData }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [started, setStarted] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const t = COPY[lang];

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
            {t.proposalTitle}
            {firstName ? (
              <>
                <br />
                {t.forName(firstName)}
              </>
            ) : null}
          </h2>
          <p className="start-sub">{t.startSub}</p>
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
            {t.startBtn}
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
            {t.proposalTitle}
            {firstName ? (
              <>
                <br />
                {t.forName(firstName)}
              </>
            ) : null}
          </h2>
          <p className="row-k" data-reveal>
            {t.coverSub}
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
            {t.s1kicker}
          </div>
          <h2 data-reveal>{t.s1h}</h2>
          <div className="card" data-reveal>
            <div className="card-label">{t.curBill}</div>
            <div className="stat-big">{rm(data.currentBill)}</div>
          </div>
          <div className="card" data-reveal>
            <div className="card-label">{t.newBillMo}</div>
            <div className="stat-big" style={{ color: "var(--accent-deep)" }}>
              {rm(data.newBill)}
            </div>
          </div>
          {data.savingPercent !== null ? (
            <span className="savings-badge" data-reveal>
              {t.save(Math.round(data.savingPercent))}
            </span>
          ) : null}
        </section>

        {/* 2 — How we calculated it */}
        <section className="slide" data-idx={2}>
          <div className="slide-kicker" data-reveal>
            {t.s2kicker}
          </div>
          <h2 data-reveal>{t.s2h}</h2>
          <div className="card" data-reveal>
            <div className="row">
              <span className="row-k">{t.genLabel}</span>
              <span className="row-v">
                {data.monthlyGenerationKwh !== null
                  ? `${data.monthlyGenerationKwh.toLocaleString()} kWh`
                  : "—"}
              </span>
            </div>
            <div className="row">
              <span className="row-k">{t.usedDirect}</span>
              <span className="row-v">
                {data.morningUsagePercent !== null
                  ? `${Math.round(data.morningUsagePercent)}%`
                  : "—"}
              </span>
            </div>
            <div className="row">
              <span className="row-k">{t.exported}</span>
              <span className="row-v">
                {data.morningUsagePercent !== null
                  ? `${Math.round(100 - data.morningUsagePercent)}%`
                  : "—"}
              </span>
            </div>
            <div className="row">
              <span className="row-k">{t.newBill}</span>
              <span className="row-v" style={{ color: "var(--accent-deep)" }}>
                {rm(data.newBill)}
              </span>
            </div>
          </div>
          {data.sunPeakHour !== null ? (
            <span className="pill" data-reveal>
              {t.sunPeak(data.sunPeakHour)}
            </span>
          ) : null}
          <p className="muted-note" data-reveal>
            {t.s2note}
          </p>
        </section>

        {/* 3 — Your package */}
        <section className="slide" data-idx={3}>
          <div className="slide-kicker" data-reveal>
            {t.s3kicker}
          </div>
          <h2 data-reveal>{t.s3h}</h2>
          <div data-reveal>
            <span className="stat-big">
              {data.systemKwp !== null ? data.systemKwp : "—"}
            </span>{" "}
            <span className="stat-unit">kWp</span>
          </div>
          <div className="card" data-reveal style={{ marginTop: 18 }}>
            <div className="row">
              <span className="row-k">{t.panels}</span>
              <span className="row-v">
                {data.panelQty ?? "—"} ×{" "}
                {data.panelWatt ? `${data.panelWatt}W` : ""}
              </span>
            </div>
            <div className="row">
              <span className="row-k">{t.panelModel}</span>
              <span className="row-v">{data.panelName ?? "—"}</span>
            </div>
            <div className="row">
              <span className="row-k">{t.inverter}</span>
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
            {t.s4kicker}
          </div>
          <h2 data-reveal>{t.s4h}</h2>
          <p className="row-k" data-reveal>
            {t.s4p1a}
            <strong style={{ color: "var(--danger)" }}>{t.s4strong}</strong>
            {t.s4p1b}
          </p>
          <p className="row-k" data-reveal style={{ marginTop: 14 }}>
            {t.s4p2a}
            <strong>{t.s4p2strong}</strong>
            {t.s4p2b}
          </p>
        </section>

        {/* 5 — Built to survive 20 years */}
        <section className="slide" data-idx={5}>
          <div className="slide-kicker" data-reveal>
            {t.s5kicker}
          </div>
          <h2 data-reveal>{t.s5h}</h2>
          <div data-reveal>
            <span className="stat-big">15–20</span>{" "}
            <span className="stat-unit">{t.yearsOnRoof}</span>
          </div>
          <p className="row-k" data-reveal style={{ marginTop: 16 }}>
            {t.s5p}
          </p>
        </section>

        {/* 6 — We don't disappear */}
        <section className="slide" data-idx={6}>
          <div className="slide-kicker" data-reveal>
            {t.s6kicker}
          </div>
          <h2 data-reveal>{t.s6h}</h2>
          <p className="row-k" data-reveal>
            {t.s6p}
          </p>
          <div className="card" data-reveal style={{ marginTop: 16 }}>
            <div className="row">
              <span className="row-k">{t.projMonth}</span>
              <span className="row-v">140+</span>
            </div>
            <div className="row">
              <span className="row-k">{t.roofTypes}</span>
              <span className="row-v">{t.everyType}</span>
            </div>
            <div className="row">
              <span className="row-k">{t.certBy}</span>
              <span className="row-v">SEDA · CIDB · MyHIJAU</span>
            </div>
          </div>
        </section>

        {/* 7 — The package & the ask */}
        <section className="slide" data-idx={7}>
          <div className="slide-kicker" data-reveal>
            {t.s7kicker}
          </div>
          <h2 data-reveal>{data.packageName ?? t.defaultPkg}</h2>
          <div className="card" data-reveal>
            {data.listPrice !== null &&
            data.finalPrice !== null &&
            data.listPrice > data.finalPrice ? (
              <div className="card-label" style={{ textDecoration: "line-through" }}>
                {rm(data.listPrice)}
              </div>
            ) : null}
            <div className="card-label">{t.pkgPrice}</div>
            <div className="stat-big">{rm(data.finalPrice)}</div>
            {data.paybackYears !== null ? (
              <span className="pill">{t.payback(data.paybackYears)}</span>
            ) : null}
          </div>
          <button className="cta" data-reveal>
            {t.cta}
          </button>
          <p className="muted-note" data-reveal>
            {t.s7note}
          </p>
        </section>
      </div>
    </div>
  );
}
