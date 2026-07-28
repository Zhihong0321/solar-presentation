// Utility to convert numbers to spoken English text for natural TTS generation

const ones = [
  "", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen",
  "seventeen", "eighteen", "nineteen"
];

const tens = [
  "", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"
];

export function numberToWordsEN(num: number): string {
  if (num === 0) return "zero";
  if (num < 0) return `minus ${numberToWordsEN(Math.abs(num))}`;

  // Handle decimals (e.g., 8.45 -> eight point four five, 6.5 -> six point five)
  if (!Number.isInteger(num)) {
    const parts = num.toString().split(".");
    const intPart = numberToWordsEN(parseInt(parts[0], 10));
    const decWords = parts[1]
      .split("")
      .map((digit) => numberToWordsEN(parseInt(digit, 10)))
      .join(" ");
    return `${intPart} point ${decWords}`;
  }

  if (num < 20) return ones[num];

  if (num < 100) {
    const t = Math.floor(num / 10);
    const r = num % 10;
    return `${tens[t]}${r > 0 ? "-" + ones[r] : ""}`;
  }

  if (num < 1000) {
    const h = Math.floor(num / 100);
    const r = num % 100;
    return `${ones[h]} hundred${r > 0 ? " and " + numberToWordsEN(r) : ""}`;
  }

  if (num < 1000000) {
    const k = Math.floor(num / 1000);
    const r = num % 1000;
    return `${numberToWordsEN(k)} thousand${r > 0 ? (r < 100 ? " and " : " ") + numberToWordsEN(r) : ""}`;
  }

  return num.toLocaleString("en-US");
}

export function formatCurrencyEN(amount: number): string {
  const rounded = Math.round(amount);
  return `${numberToWordsEN(rounded)} ringgit`;
}
