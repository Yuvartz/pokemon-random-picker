/**
 * Converts small numbers (1–999) to words for natural-sounding speech.
 * Covers every Pokédex ID in the app (1–151) with room to grow.
 */

const EN_ONES = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

const EN_TENS = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

export function numberToWordsEn(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 999) return String(n);
  if (n < 20) return EN_ONES[n];
  if (n < 100) {
    const tens = EN_TENS[Math.floor(n / 10)];
    const rest = n % 10;
    return rest === 0 ? tens : `${tens}-${EN_ONES[rest]}`;
  }
  const hundreds = `${EN_ONES[Math.floor(n / 100)]} hundred`;
  const rest = n % 100;
  return rest === 0 ? hundreds : `${hundreds} and ${numberToWordsEn(rest)}`;
}

// Feminine counting forms, the standard way to read plain numbers in Hebrew.
const HE_ONES = [
  "אפס",
  "אחת",
  "שתיים",
  "שלוש",
  "ארבע",
  "חמש",
  "שש",
  "שבע",
  "שמונה",
  "תשע",
  "עשר",
];

const HE_TEENS = [
  "",
  "אחת עשרה",
  "שתים עשרה",
  "שלוש עשרה",
  "ארבע עשרה",
  "חמש עשרה",
  "שש עשרה",
  "שבע עשרה",
  "שמונה עשרה",
  "תשע עשרה",
];

const HE_TENS = [
  "",
  "עשר",
  "עשרים",
  "שלושים",
  "ארבעים",
  "חמישים",
  "שישים",
  "שבעים",
  "שמונים",
  "תשעים",
];

const HE_HUNDREDS = ["", "מאה", "מאתיים", "שלוש מאות", "ארבע מאות", "חמש מאות", "שש מאות", "שבע מאות", "שמונה מאות", "תשע מאות"];

export function numberToWordsHe(n: number): string {
  if (!Number.isInteger(n) || n < 0 || n > 999) return String(n);
  if (n <= 10) return HE_ONES[n];
  if (n < 20) return HE_TEENS[n - 10];
  if (n < 100) {
    const tens = HE_TENS[Math.floor(n / 10)];
    const rest = n % 10;
    return rest === 0 ? tens : `${tens} ו${HE_ONES[rest]}`;
  }
  const hundreds = HE_HUNDREDS[Math.floor(n / 100)];
  const rest = n % 100;
  if (rest === 0) return hundreds;
  // "ו" attaches to the last element for a natural reading.
  return rest <= 10 || (rest > 20 && rest % 10 === 0)
    ? `${hundreds} ו${numberToWordsHe(rest)}`
    : `${hundreds} ${numberToWordsHe(rest)}`;
}
