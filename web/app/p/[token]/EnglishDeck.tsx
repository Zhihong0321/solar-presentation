import type { PresentationData } from "@/lib/invoice";

const rm = (amount: number | null, dp = 0) =>
  amount === null
    ? "—"
    : `RM ${amount.toLocaleString("en-MY", {
        minimumFractionDigits: dp,
        maximumFractionDigits: dp,
      })}`;

const value = (amount: number | null, suffix = "") =>
  amount === null ? "—" : `${amount.toLocaleString("en-MY")}${suffix}`;

function SlideHead({
  index,
  eyebrow,
  title,
  intro,
}: {
  index: string;
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="cn-head" data-reveal>
      <div className="cn-eyebrow">
        <span>{index}</span>
        {eyebrow}
      </div>
      <h2>{title}</h2>
      {intro ? <p>{intro}</p> : null}
    </header>
  );
}

function Metric({
  label,
  children,
  tone,
}: {
  label: string;
  children: React.ReactNode;
  tone?: "gold" | "green";
}) {
  return (
    <div className={`cn-metric ${tone ? `is-${tone}` : ""}`}>
      <span>{label}</span>
      <strong>{children}</strong>
    </div>
  );
}

export default function EnglishDeck({ data }: { data: PresentationData }) {
  const beforeBar = 100;
  const afterBar =
    data.currentBill && data.currentBill > 0 && data.newBill !== null
      ? Math.max(6, Math.min(100, (data.newBill / data.currentBill) * 100))
      : 34;
  const yearlySaving =
    data.monthlySaving !== null ? data.monthlySaving * 12 : null;

  return (
    <>
      <section className="slide cn-slide cn-cover" data-idx={0}>
        <div className="cn-grid" aria-hidden="true" />
        <div className="cn-sun-stage" aria-hidden="true">
          <div className="cn-orbit cn-orbit-one" />
          <div className="cn-orbit cn-orbit-two" />
          <div className="cn-sun" />
        </div>
        <div className="cn-cover-top" data-reveal>
          <span className="cn-brand-mark">E</span>
          <span>ETERNALGY SOLAR</span>
          <span className="cn-live-dot">PERSONAL PROPOSAL</span>
        </div>
        <div className="cn-cover-copy" data-reveal>
          <p className="cn-overline">PERSONALISED SOLAR PROPOSAL</p>
          <h2>
            Let sunshine create
            <br />
            lasting value for
            <br />
            <em>your home</em>
          </h2>
          <p>
            Your current bill, savings logic and system design —
            <br />
            explained with clear numbers.
          </p>
        </div>
        <div className="cn-cover-meta" data-reveal>
          <div>
            <span>PROPOSAL NO.</span>
            <strong>{data.invoiceNumber ?? "PERSONAL PROPOSAL"}</strong>
          </div>
          <div>
            <span>SYSTEM SIZE</span>
            <strong>{value(data.systemKwp, " kWp")}</strong>
          </div>
        </div>
        <div className="cn-scroll-cue" aria-hidden="true">
          <span /> SCROLL TO EXPLORE
        </div>
      </section>

      <section className="slide cn-slide cn-bill" data-idx={1}>
        <div className="cn-grid" aria-hidden="true" />
        <SlideHead
          index="01"
          eyebrow="BILL IMPACT"
          title="See the difference solar makes to the same bill"
          intro="Start with the result, then trace where every number comes from."
        />
        <div className="cn-saving-hero" data-reveal>
          <div>
            <span>ESTIMATED MONTHLY SAVINGS</span>
            <strong>{rm(data.monthlySaving)}</strong>
          </div>
          {data.savingPercent !== null ? (
            <div className="cn-percent-ring">
              <strong>{Math.round(data.savingPercent)}%</strong>
              <span>SAVINGS</span>
            </div>
          ) : null}
        </div>
        <div className="cn-bill-compare" data-reveal>
          <div className="cn-bill-row">
            <div>
              <span>CURRENT BILL</span>
              <strong>{rm(data.currentBill)}</strong>
            </div>
            <div className="cn-bar-track">
              <span className="cn-bar-before" style={{ width: `${beforeBar}%` }} />
            </div>
          </div>
          <div className="cn-bill-row is-after">
            <div>
              <span>AFTER SOLAR</span>
              <strong>{rm(data.newBill)}</strong>
            </div>
            <div className="cn-bar-track">
              <span className="cn-bar-after" style={{ width: `${afterBar}%` }} />
            </div>
          </div>
        </div>
        <div className="cn-insight" data-reveal>
          <span>ANNUAL SAVINGS REFERENCE</span>
          <strong>{rm(yearlySaving)}</strong>
          <small>Monthly savings × 12 months</small>
        </div>
      </section>

      <section className="slide cn-slide cn-maths" data-idx={2}>
        <div className="cn-grid" aria-hidden="true" />
        <SlideHead
          index="02"
          eyebrow="THE CALCULATION"
          title="The savings are transparent — here is the maths"
          intro="This presentation uses invoice data and the formulas below."
        />
        <div className="cn-formula-stack" data-reveal>
          <div className="cn-formula">
            <span className="cn-formula-no">A</span>
            <div>
              <small>MONTHLY SAVINGS</small>
              <p>Uses the stored estimated saving first</p>
              <strong>{rm(data.monthlySaving)}</strong>
              <em>Fallback: current bill − new bill</em>
            </div>
          </div>
          <div className="cn-formula">
            <span className="cn-formula-no">B</span>
            <div>
              <small>SAVINGS PERCENTAGE</small>
              <p>Monthly savings ÷ current bill × 100%</p>
              <strong>
                {data.savingPercent !== null
                  ? `${data.savingPercent.toLocaleString("en-MY")}%`
                  : "—"}
              </strong>
            </div>
          </div>
          <div className="cn-formula">
            <span className="cn-formula-no">C</span>
            <div>
              <small>ESTIMATED MONTHLY GENERATION</small>
              <p>System kWp x peak sun hours x 30 days</p>
              <strong>{value(data.monthlyGenerationKwh, " kWh")}</strong>
            </div>
          </div>
        </div>
        <div className="cn-source-note" data-reveal>
          <span className="cn-source-icon">i</span>
          <p>
            <strong>New bill {rm(data.newBill)}</strong> is read directly from the
            invoice database. This page does not re-run TNB&apos;s tiered tariff
            calculation.
          </p>
        </div>
      </section>

      <section className="slide cn-slide cn-system" data-idx={3}>
        <div className="cn-grid" aria-hidden="true" />
        <SlideHead
          index="03"
          eyebrow="SYSTEM DESIGN"
          title="Generation capacity, mapped to every component"
          intro="Not a generic package — this system is tied to your proposal."
        />
        <div className="cn-system-hero" data-reveal>
          <span>INSTALLED CAPACITY</span>
          <div>
            <strong>{data.systemKwp ?? "—"}</strong>
            <em>kWp</em>
          </div>
          <small>
            {data.panelQty ?? "—"} × {data.panelWatt ?? "—"}W SOLAR PANELS
          </small>
        </div>
        <div className="cn-energy-flow" data-reveal aria-label="Solar energy flow">
          <div><span>01</span><strong>PANELS</strong></div>
          <i>→</i>
          <div><span>02</span><strong>INVERTER</strong></div>
          <i>→</i>
          <div><span>03</span><strong>HOME LOADS</strong></div>
        </div>
        <div className="cn-spec-list" data-reveal>
          <div>
            <span>SOLAR PANELS</span>
            <strong>{data.panelName ?? "—"}</strong>
          </div>
          <div>
            <span>INVERTER</span>
            <strong>{data.inverterName ?? "—"}</strong>
          </div>
        </div>
        {data.panelWarranty ? (
          <p className="cn-footnote" data-reveal>
            {data.panelWarranty.split("\n").join(" · ")}
          </p>
        ) : null}
      </section>

      <section className="slide cn-slide cn-trust" data-idx={4}>
        <div className="cn-grid" aria-hidden="true" />
        <SlideHead
          index="04"
          eyebrow="NUMBER CREDIBILITY"
          title="Every number should be traceable"
          intro="Credibility means clear sources and calculation boundaries — not prettier forecasts."
        />
        <div className="cn-risk-card" data-reveal>
          <span>OVERSTATE RM50 / MONTH</span>
          <strong>20 YEARS = RM12,000</strong>
          <p>A small exaggeration becomes a large promise that never arrives.</p>
        </div>
        <div className="cn-trace" data-reveal>
          <div>
            <span>01</span>
            <p><strong>INVOICE DATA</strong>Current bill, new bill and estimated savings</p>
          </div>
          <div>
            <span>02</span>
            <p><strong>OPEN FORMULAS</strong>Savings rate, generation and payback</p>
          </div>
          <div>
            <span>03</span>
            <p><strong>CLEAR BOUNDARIES</strong>Database results are not presented as a live simulation</p>
          </div>
        </div>
        <blockquote data-reveal>
          We would rather explain the calculation
          <br />
          than let a polished number replace the truth.
        </blockquote>
      </section>

      <section className="slide cn-slide cn-quality" data-idx={5}>
        <div className="cn-grid" aria-hidden="true" />
        <SlideHead
          index="05"
          eyebrow="LONG-TERM QUALITY"
          title="Designed for dependable performance over time"
          intro="A rooftop system must withstand years of weather and daily use."
        />
        <div className="cn-years" data-reveal>
          <strong>15–20</strong>
          <div><span>YEARS</span><p>THE SYSTEM&apos;S JOURNEY ON YOUR ROOF</p></div>
        </div>
        <div className="cn-lifecycle" data-reveal>
          <div><span>01</span><strong>COMPONENTS</strong><p>Good equipment creates a strong foundation.</p></div>
          <div><span>02</span><strong>INSTALLATION</strong><p>Workmanship shapes long-term reliability.</p></div>
          <div><span>03</span><strong>PERFORMANCE</strong><p>Designed for the complete system life.</p></div>
        </div>
        <p className="cn-quote" data-reveal>
          Cheap components can fail early — causing a dead system at best and a
          fire risk at worst. We select every component for the full system life.
        </p>
      </section>

      <section className="slide cn-slide cn-service" data-idx={6}>
        <div className="cn-grid" aria-hidden="true" />
        <SlideHead
          index="06"
          eyebrow="LONG-TERM SERVICE"
          title="Installation is not the end of the relationship"
          intro="Your system deserves support throughout its working life."
        />
        <div className="cn-service-promise" data-reveal>
          <div className="cn-service-rings" aria-hidden="true"><span /><span /><b>E</b></div>
          <p>
            Our in-house roof maintenance team responds to roof issues throughout
            the life of your system.
          </p>
        </div>
        <div className="cn-proof-grid" data-reveal>
          <Metric label="PROJECTS / MONTH" tone="gold">140+</Metric>
          <Metric label="ROOF COVERAGE">ALL TYPES<br />IN MALAYSIA</Metric>
          <Metric label="CERTIFIED BY" tone="green">SEDA<br />CIDB · MyHIJAU</Metric>
        </div>
        <div className="cn-service-line" data-reveal>
          <span>ASSESS</span><i />
          <span>INSTALL</span><i />
          <span>ACTIVATE</span><i />
          <span>MAINTAIN</span>
        </div>
      </section>

      <section className="slide cn-slide cn-offer" data-idx={7}>
        <div className="cn-grid" aria-hidden="true" />
        <SlideHead
          index="07"
          eyebrow="YOUR PROPOSAL"
          title={data.packageName ?? "Your Solar Package"}
          intro="Equipment, installation and warranties in one clear proposal."
        />
        <div className="cn-price-card" data-reveal>
          <div className="cn-price-label">
            <span>PACKAGE PRICE</span>
            {data.listPrice !== null && data.finalPrice !== null && data.listPrice > data.finalPrice ? (
              <del>{rm(data.listPrice)}</del>
            ) : null}
          </div>
          <strong>{rm(data.finalPrice)}</strong>
          <div className="cn-price-metrics">
            <div><span>SYSTEM SIZE</span><b>{value(data.systemKwp, " kWp")}</b></div>
            <div><span>MONTHLY SAVINGS</span><b>{rm(data.monthlySaving)}</b></div>
            <div><span>EST. PAYBACK</span><b>{data.paybackYears !== null ? `~${data.paybackYears} years` : "—"}</b></div>
          </div>
        </div>
        <button className="cn-cta" data-reveal>
          <span>BOOK YOUR FREE ROOF ASSESSMENT</span>
          <b>→</b>
        </button>
        <p className="cn-offer-note" data-reveal>
          Panels, inverter, installation and warranties included. Every ringgit
          saved after payback is yours.
        </p>
        <div className="cn-signoff" data-reveal>
          <span className="cn-brand-mark">E</span>
          <p><strong>ETERNALGY SOLAR</strong>LONG-TERM VALUE STARTS TODAY.</p>
        </div>
        <a
          className="cn-back-link"
          href={`https://calculator.atap.solar/view/${data.shareToken}`}
          data-reveal
        >
          ← Return to Invoice
        </a>
        <a
          className="cn-back-link"
          href="/Why-Eternalgy-Solar-Simulation-is-Precise.html"
          data-reveal
        >
          Why our simulation is precise →
        </a>
      </section>
    </>
  );
}
