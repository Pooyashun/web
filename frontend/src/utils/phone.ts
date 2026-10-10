/** Iranian mobile number helpers shared by the form and its validation. */

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

export function toLatinDigits(input: string): string {
  return input.replace(/[۰-۹٠-٩]/g, (char) => {
    const persian = PERSIAN_DIGITS.indexOf(char);
    if (persian > -1) return String(persian);
    const arabic = ARABIC_DIGITS.indexOf(char);
    return arabic > -1 ? String(arabic) : char;
  });
}

export function normalizePhone(input: string): string {
  return toLatinDigits(input).replace(/[\s()\-.ـ]/g, '');
}

const IRAN_MOBILE_RE = /^(?:\+98|0098|98|0)?9\d{9}$/;

export function isValidIranMobile(input: string): boolean {
  return IRAN_MOBILE_RE.test(normalizePhone(input));
}

/** Persians digits for display, e.g. 1 -> ۱ */
export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}
