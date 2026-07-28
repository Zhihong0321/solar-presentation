// Utility to convert numbers to spoken English and Chinese text for natural TTS generation
import type { PresentationData } from "./invoice";

const onesEN = [
  "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen"
];

const tensEN = [
  "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
];

export function numberToWordsEN(num: number): string {
  if (num === 0) return "zero";
  if (num < 0) return `minus ${numberToWordsEN(Math.abs(num))}`;

  if (!Number.isInteger(num)) {
    const parts = num.toString().split(".");
    const intPart = numberToWordsEN(parseInt(parts[0], 10));
    const decWords = parts[1]
      .split("")
      .map((digit) => numberToWordsEN(parseInt(digit, 10)))
      .join(" ");
    return `${intPart} point ${decWords}`;
  }

  if (num < 20) return onesEN[num];

  if (num < 100) {
    const t = Math.floor(num / 10);
    const r = num % 10;
    return `${tensEN[t]}${r > 0 ? "-" + onesEN[r] : ""}`;
  }

  if (num < 1000) {
    const h = Math.floor(num / 100);
    const r = num % 100;
    return `${onesEN[h]} hundred${r > 0 ? " and " + numberToWordsEN(r) : ""}`;
  }

  if (num < 1000000) {
    const k = Math.floor(num / 1000);
    const r = num % 1000;
    return `${numberToWordsEN(k)} thousand${r > 0 ? (r < 100 ? " and " : " ") + numberToWordsEN(r) : ""}`;
  }

  return num.toLocaleString("en-US");
}

const digitsZH = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

export function numberToWordsZH(num: number): string {
  if (num === 0) return "零";
  if (num < 0) return `负${numberToWordsZH(Math.abs(num))}`;

  if (!Number.isInteger(num)) {
    const parts = num.toString().split(".");
    const intPart = numberToWordsZH(parseInt(parts[0], 10));
    const decWords = parts[1]
      .split("")
      .map((digit) => digitsZH[parseInt(digit, 10)] || digit)
      .join("");
    return `${intPart}点${decWords}`;
  }

  if (num < 10) return digitsZH[num];

  if (num < 100) {
    const t = Math.floor(num / 10);
    const r = num % 10;
    const tStr = t === 1 ? "十" : `${digitsZH[t]}十`;
    return `${tStr}${r > 0 ? digitsZH[r] : ""}`;
  }

  if (num < 1000) {
    const h = Math.floor(num / 100);
    const r = num % 100;
    let res = `${digitsZH[h]}百`;
    if (r > 0) {
      if (r < 10) res += `零${digitsZH[r]}`;
      else res += numberToWordsZH(r);
    }
    return res;
  }

  if (num < 10000) {
    const k = Math.floor(num / 1000);
    const r = num % 1000;
    let res = `${digitsZH[k]}千`;
    if (r > 0) {
      if (r < 100) res += `零${numberToWordsZH(r)}`;
      else res += numberToWordsZH(r);
    }
    return res;
  }

  if (num < 100000000) {
    const w = Math.floor(num / 10000);
    const r = num % 10000;
    let res = `${numberToWordsZH(w)}万`;
    if (r > 0) {
      if (r < 1000) res += `零${numberToWordsZH(r)}`;
      else res += numberToWordsZH(r);
    }
    return res;
  }

  return num.toString();
}

export function getSlideSpokenText({
  slideIndex,
  clipSubIndex = 0,
  data,
  lang,
}: {
  slideIndex: number;
  clipSubIndex?: number;
  data: PresentationData;
  lang: "en" | "zh";
}): { text: string; isDefault: boolean } {
  const currentBill = data.currentBill ?? 380;
  const newBill = data.newBill ?? 95;
  const savingPercent = data.savingPercent ?? 75;
  const monthlyGenerationKwh = data.monthlyGenerationKwh ?? 860;
  const panelQty = data.panelQty ?? 13;
  const panelWatt = data.panelWatt ?? 650;
  const panelName = data.panelName || "JinkoSolar";
  const inverterName = data.inverterName || "SAJ";
  const systemKwp = data.systemKwp ?? 8.45;
  const finalPrice = data.finalPrice ?? 24200;
  const paybackYears = data.paybackYears ?? 6;

  const isEN = lang === "en";

  if (slideIndex === 0) {
    return {
      isDefault: true,
      text: isEN
        ? "Hi — and thank you for your time. In the next two minutes, I'll show you exactly what solar can do for your home… and why it matters who installs it."
        : "您好 — 感谢您的宝贵时间。在接下来的两分钟里，我将向您展示太阳能能为您家带来什么… 以及为什么选择安装团队如此重要。",
    };
  }

  if (slideIndex === 1) {
    const isDefault = currentBill === 380 && newBill === 95;
    return {
      isDefault,
      text: isEN
        ? `Right now, your electricity bill averages ${numberToWordsEN(currentBill)} ringgit a month. With solar… that drops to around ${numberToWordsEN(newBill)}. That's a ${numberToWordsEN(savingPercent)} percent saving — every single month, for decades to come.`
        : `目前，您的月均电费大约是 ${numberToWordsZH(currentBill)} 令吉。安装太阳能后… 将降至大约 ${numberToWordsZH(newBill)} 令吉。节省比例高达 ${numberToWordsZH(savingPercent)} 百分比 — 未来几十年的每个月，都是实打实的省钱。`,
    };
  }

  if (slideIndex === 2) {
    const isDefault = monthlyGenerationKwh === 860;
    return {
      isDefault,
      text: isEN
        ? `And this number is not a guess. Your panels will generate around ${numberToWordsEN(monthlyGenerationKwh)} kilowatt-hours a month. About forty percent powers your home directly during the day — the rest is exported to the grid for credit, calculated against your actual TNB tariff, rate by rate.`
        : `这个数据绝不是凭空估算的。您的太阳能板每月将发电约 ${numberToWordsZH(monthlyGenerationKwh)} 度。白天约四十百分比直接供家中用电 — 其余导出至国家电网折抵电费，严格按照您的实际国电阶梯电价计算。`,
    };
  }

  if (slideIndex === 3) {
    const isDefault = panelQty === 13 && panelWatt === 650 && systemKwp === 8.45;
    return {
      isDefault,
      text: isEN
        ? `Here's the system that does it. ${numberToWordsEN(panelQty)} ${panelName} panels — ${numberToWordsEN(panelWatt)} watts each, Tier-one, N-type — paired with an ${inverterName} inverter. ${numberToWordsEN(systemKwp)} kilowatts, sized precisely for your roof and your usage.`
        : `这就是为您量身打造的系统。${numberToWordsZH(panelQty)} 块 ${panelName} 太阳能板 — 每块 ${numberToWordsZH(panelWatt)} 瓦，一线品牌，N型技术 — 搭配 ${inverterName} 逆变器。${numberToWordsZH(systemKwp)} 千瓦容量，精准匹配您的屋顶与用电需求。`,
    };
  }

  if (slideIndex === 4) {
    if (clipSubIndex === 0) {
      return {
        isDefault: true,
        text: isEN
          ? "Now — before you compare quotes, one thing you deserve to know. The most common trick in this industry is overclaimed savings. Even a small exaggeration — just fifty ringgit a month — compounds to over twelve thousand ringgit that never arrives, across your system's lifetime."
          : "在您对比报价之前，有一件事您有权了解。行业中最常见的套路，就是虚标省钱金额。哪怕每个月夸大五十令吉 — 在系统运行寿命内，就意味着上万令吉永远无法兑现的虚高承诺。",
      };
    }
    return {
      isDefault: true,
      text: isEN
        ? "That's why we built Malaysia's first solar simulator. Your forecast is calculated on your actual TNB tariff structure. The numbers you saw just now? They're not estimates."
        : "这就是为什么我们打造了全马首个太阳能精准模拟器。您的预测数据是根据国电实际阶梯电价计算出来的。您刚才看到的数字？全都是精确计算，绝非随口估计。",
    };
  }

  if (slideIndex === 5) {
    if (clipSubIndex === 0) {
      return {
        isDefault: true,
        text: isEN
          ? "Second — let me ask you something. When we don't understand a product… we pick the cheapest. When we truly understand it — we avoid the cheapest. So… are you looking for the cheapest right now?"
          : "第二点 — 请允许我问您一个问题。当我们不了解一个产品时… 我们往往会选最便宜的。而当我们真正了解它时 — 我们会主动避开最便宜的。那么… 您现在找的是最便宜的吗？",
      };
    }
    if (clipSubIndex === 1) {
      return {
        isDefault: true,
        text: isEN
          ? "Because this system will sit on your roof for fifteen to twenty years. Cheap components fail early. At best, a dead system. At worst… a fire, on your own home."
          : "因为这个系统要在您家屋顶上运行十五到二十年。劣质组件会过早损坏。轻则系统彻底瘫痪。重则引发火灾，危害您自身的房屋安全。",
      };
    }
    return {
      isDefault: true,
      text: isEN
        ? "Remember this: a real bargain is honesty. What's truly expensive… is risk."
        : "请记住这句话：真正的划算，是诚信与品质。真正昂贵的… 是未知的风险。",
    };
  }

  if (slideIndex === 6) {
    return {
      isDefault: true,
      text: isEN
        ? "And third — we don't disappear after installation. Our in-house roof maintenance team responds to any roof issue, for the life of your system. One hundred and forty projects in a single month. Every roof type in Malaysia. Certified by SEDA, CIDB, and MyHIJAU."
        : "第三点 — 安装完成后，我们绝不会消失。我们自有的屋顶维护团队，在系统全生命周期内随时响应任何屋顶问题。单月完成一百四十个项目。覆盖全马各种屋顶类型。拥有 SEDA、CIDB 以及 MyHIJAU 权威认证。",
    };
  }

  // Slide 7
  const isDefault = finalPrice === 24200 && paybackYears === 6;
  return {
    isDefault,
    text: isEN
      ? `So here it is — panels, inverter, installation, and every warranty — at ${numberToWordsEN(finalPrice)} ringgit after discount. Payback in around ${numberToWordsEN(paybackYears)} years. Everything after that… is pure savings. Shall we get your roof assessed?`
      : `因此方案如下 — 太阳能板、逆变器、安装施工及全套保修 — 折扣后价格为 ${numberToWordsZH(finalPrice)} 令吉。预计 ${numberToWordsZH(paybackYears)} 年左右回本。之后的所有收益… 都是纯粹的净省钱。我们现在安排进行屋顶评估吗？`,
  };
}
