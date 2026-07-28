import type { PresentationData } from "@/lib/invoice";

const rm = (value: number | null, dp = 0) =>
  value === null
    ? "—"
    : `RM ${value.toLocaleString("en-MY", {
        minimumFractionDigits: dp,
        maximumFractionDigits: dp,
      })}`;

const value = (n: number | null, suffix = "") =>
  n === null ? "—" : `${n.toLocaleString("en-MY")}${suffix}`;

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

export default function ChineseDeck({
  data,
  firstName,
}: {
  data: PresentationData;
  firstName: string | null;
}) {
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
          <span className="cn-live-dot">专属方案</span>
        </div>
        <div className="cn-cover-copy" data-reveal>
          <p className="cn-overline">PERSONALISED SOLAR PROPOSAL</p>
          <h2>
            让阳光，开始为
            <br />
            <em>{firstName ? `${firstName} 的家` : "您的家"}</em>创造价值
          </h2>
          <p>
            从当前电费、节省逻辑到系统配置，
            <br />
            用清楚的数字看懂这份太阳能方案。
          </p>
        </div>
        <div className="cn-cover-meta" data-reveal>
          <div>
            <span>方案编号</span>
            <strong>{data.invoiceNumber ?? "专属方案"}</strong>
          </div>
          <div>
            <span>系统规模</span>
            <strong>{value(data.systemKwp, " kWp")}</strong>
          </div>
        </div>
        <div className="cn-scroll-cue" aria-hidden="true">
          <span /> 向下滑动
        </div>
      </section>

      <section className="slide cn-slide cn-bill" data-idx={1}>
        <div className="cn-grid" aria-hidden="true" />
        <SlideHead
          index="01"
          eyebrow="电费变化"
          title="同一张账单，看见太阳能前后的差别"
          intro="先看结果，再一步一步解释数字从哪里来。"
        />
        <div className="cn-saving-hero" data-reveal>
          <div>
            <span>预计每月节省</span>
            <strong>{rm(data.monthlySaving)}</strong>
          </div>
          {data.savingPercent !== null ? (
            <div className="cn-percent-ring">
              <strong>{Math.round(data.savingPercent)}%</strong>
              <span>节省比例</span>
            </div>
          ) : null}
        </div>
        <div className="cn-bill-compare" data-reveal>
          <div className="cn-bill-row">
            <div>
              <span>现在</span>
              <strong>{rm(data.currentBill)}</strong>
            </div>
            <div className="cn-bar-track">
              <span className="cn-bar-before" style={{ width: `${beforeBar}%` }} />
            </div>
          </div>
          <div className="cn-bill-row is-after">
            <div>
              <span>安装后</span>
              <strong>{rm(data.newBill)}</strong>
            </div>
            <div className="cn-bar-track">
              <span className="cn-bar-after" style={{ width: `${afterBar}%` }} />
            </div>
          </div>
        </div>
        <div className="cn-insight" data-reveal>
          <span>年度节省参考</span>
          <strong>{rm(yearlySaving)}</strong>
          <small>以每月节省 × 12 个月估算</small>
        </div>
      </section>

      <section className="slide cn-slide cn-maths" data-idx={2}>
        <div className="cn-grid" aria-hidden="true" />
        <SlideHead
          index="02"
          eyebrow="计算方式"
          title="节省，不靠口号；把公式摊开给您看"
          intro="这份演示使用发票资料与以下公式呈现结果。"
        />
        <div className="cn-formula-stack" data-reveal>
          <div className="cn-formula">
            <span className="cn-formula-no">A</span>
            <div>
              <small>每月节省</small>
              <p>优先采用发票中的预计节省</p>
              <strong>{rm(data.monthlySaving)}</strong>
              <em>如无该值：现有电费 − 新电费</em>
            </div>
          </div>
          <div className="cn-formula">
            <span className="cn-formula-no">B</span>
            <div>
              <small>节省比例</small>
              <p>每月节省 ÷ 现有电费 × 100%</p>
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
              <small>预计每月发电量</small>
              <p>系统 kWp × 日照高峰小时 × 30</p>
              <strong>{value(data.monthlyGenerationKwh, " kWh")}</strong>
            </div>
          </div>
        </div>
        <div className="cn-source-note" data-reveal>
          <span className="cn-source-icon">i</span>
          <p>
            <strong>新电费 {rm(data.newBill)}</strong>
            直接读取发票数据库中已计算的数值；本页面不会重新执行 TNB
            逐级电价计算。
          </p>
        </div>
      </section>

      <section className="slide cn-slide cn-system" data-idx={3}>
        <div className="cn-grid" aria-hidden="true" />
        <SlideHead
          index="03"
          eyebrow="系统配置"
          title="把发电能力，落到每一件设备上"
          intro="这不是通用套餐，而是与这份方案相连的系统配置。"
        />
        <div className="cn-system-hero" data-reveal>
          <span>装机容量</span>
          <div>
            <strong>{data.systemKwp ?? "—"}</strong>
            <em>kWp</em>
          </div>
          <small>
            {data.panelQty ?? "—"} 片 × {data.panelWatt ?? "—"}W 太阳能板
          </small>
        </div>
        <div className="cn-energy-flow" data-reveal aria-label="太阳能系统流程">
          <div><span>01</span><strong>太阳能板</strong></div>
          <i>→</i>
          <div><span>02</span><strong>逆变器</strong></div>
          <i>→</i>
          <div><span>03</span><strong>家庭用电</strong></div>
        </div>
        <div className="cn-spec-list" data-reveal>
          <div>
            <span>太阳能板</span>
            <strong>{data.panelName ?? "—"}</strong>
          </div>
          <div>
            <span>逆变器</span>
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
          eyebrow="数字可信度"
          title="每一个数字，都应该能追溯来源"
          intro="可信，不是把预测说得更漂亮；而是把资料来源与计算边界说清楚。"
        />
        <div className="cn-risk-card" data-reveal>
          <span>每月多算 RM50</span>
          <strong>20 年 = RM12,000</strong>
          <p>小小的夸大，会在系统寿命内累积成无法兑现的差距。</p>
        </div>
        <div className="cn-trace" data-reveal>
          <div>
            <span>01</span>
            <p><strong>账单资料</strong>现有电费、新电费与预计节省</p>
          </div>
          <div>
            <span>02</span>
            <p><strong>公开公式</strong>节省比例、发电量与回本期</p>
          </div>
          <div>
            <span>03</span>
            <p><strong>清楚边界</strong>不把数据库结果包装成即时模拟</p>
          </div>
        </div>
        <blockquote data-reveal>
          我们宁愿把计算说明白，
          <br />
          也不让一个漂亮数字代替事实。
        </blockquote>
      </section>

      <section className="slide cn-slide cn-quality" data-idx={5}>
        <div className="cn-grid" aria-hidden="true" />
        <SlideHead
          index="05"
          eyebrow="长期品质"
          title="不是只为今天发电，而是为长期稳定而设计"
          intro="屋顶上的系统，需要经得起时间、天气与日常使用。"
        />
        <div className="cn-years" data-reveal>
          <strong>15–20</strong>
          <div><span>年</span><p>系统在屋顶上的长期旅程</p></div>
        </div>
        <div className="cn-lifecycle" data-reveal>
          <div><span>01</span><strong>设备标准</strong><p>配件选择决定系统基础。</p></div>
          <div><span>02</span><strong>安装品质</strong><p>施工细节影响长期稳定。</p></div>
          <div><span>03</span><strong>持续表现</strong><p>以完整系统寿命为目标。</p></div>
        </div>
        <p className="cn-quote" data-reveal>
          廉价配件容易提早损坏——轻则系统瘫痪，重则引发火患。我们坚持以完整系统寿命为前提，选择与配置每一项设备。
        </p>
      </section>

      <section className="slide cn-slide cn-service" data-idx={6}>
        <div className="cn-grid" aria-hidden="true" />
        <SlideHead
          index="06"
          eyebrow="长期服务"
          title="安装完成，不是关系的终点"
          intro="系统运行的每一年，都应该有人回应。"
        />
        <div className="cn-service-promise" data-reveal>
          <div className="cn-service-rings" aria-hidden="true"><span /><span /><b>E</b></div>
          <p>
            我们拥有自己的屋顶维护团队，在系统的整个使用年限内，随时处理任何屋顶问题。
          </p>
        </div>
        <div className="cn-proof-grid" data-reveal>
          <Metric label="单月完成项目" tone="gold">140+</Metric>
          <Metric label="屋顶适配范围">马来西亚<br />各种屋顶</Metric>
          <Metric label="认证机构" tone="green">SEDA<br />CIDB · MyHIJAU</Metric>
        </div>
        <div className="cn-service-line" data-reveal>
          <span>评估</span><i />
          <span>安装</span><i />
          <span>启用</span><i />
          <span>长期维护</span>
        </div>
      </section>

      <section className="slide cn-slide cn-offer" data-idx={7}>
        <div className="cn-grid" aria-hidden="true" />
        <SlideHead
          index="07"
          eyebrow="您的方案"
          title={data.packageName ?? "专属太阳能方案"}
          intro="设备、安装与保固，整合在一份清楚的报价里。"
        />
        <div className="cn-price-card" data-reveal>
          <div className="cn-price-label">
            <span>方案价格</span>
            {data.listPrice !== null && data.finalPrice !== null && data.listPrice > data.finalPrice ? (
              <del>{rm(data.listPrice)}</del>
            ) : null}
          </div>
          <strong>{rm(data.finalPrice)}</strong>
          <div className="cn-price-metrics">
            <div><span>系统规模</span><b>{value(data.systemKwp, " kWp")}</b></div>
            <div><span>每月节省</span><b>{rm(data.monthlySaving)}</b></div>
            <div><span>预计回本</span><b>{data.paybackYears !== null ? `${data.paybackYears} 年` : "—"}</b></div>
          </div>
        </div>
        <button className="cn-cta" data-reveal>
          <span>预约免费屋顶评估</span>
          <b>→</b>
        </button>
        <p className="cn-offer-note" data-reveal>
          包含太阳能板、逆变器、安装工程与所有保固。回本之后的每一分钱，都是纯粹的节省。
        </p>
        <div className="cn-signoff" data-reveal>
          <span className="cn-brand-mark">E</span>
          <p><strong>ETERNALGY SOLAR</strong>让长期价值，从今天开始。</p>
        </div>
        <a
          className="cn-back-link"
          href={`https://calculator.atap.solar/view/${data.shareToken}`}
          data-reveal
        >
          ← 返回报价页面
        </a>
        <a
          className="cn-back-link"
          href="/Why-Eternalgy-Solar-Simulation-is-Precise-ZH.html"
          data-reveal
        >
          为什么我们的模拟计算准确 →
        </a>
      </section>
    </>
  );
}
