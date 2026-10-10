/**
 * Lead-form select options. The `value`s are the contract with the server's
 * allow-lists in `backend/src/validate.js` — keep the two in sync.
 */

import type { LeadFormValues, SelectOption } from '../types';

export const BUDGET_OPTIONS: SelectOption[] = [
  { value: 'under_1b', label: 'کمتر از ۱ میلیارد تومان' },
  { value: '1b_2b', label: '۱ تا ۲ میلیارد تومان' },
  { value: '2b_4b', label: '۲ تا ۴ میلیارد تومان' },
  { value: '4b_7b', label: '۴ تا ۷ میلیارد تومان' },
  { value: 'over_7b', label: 'بیش از ۷ میلیارد تومان' },
  { value: 'custom', label: 'محدوده دلخواه' },
  { value: 'unknown', label: 'هنوز مشخص نیست' },
];

export const CITY_OPTIONS: SelectOption[] = [
  { value: 'rasht', label: 'رشت' },
  { value: 'fuman', label: 'فومن' },
  { value: 'shaft', label: 'شفت' },
  { value: 'someh_sara', label: 'صومعه‌سرا' },
  { value: 'bandar_anzali', label: 'بندر انزلی' },
  { value: 'lahijan', label: 'لاهیجان' },
  { value: 'other_gilan', label: 'سایر مناطق گیلان' },
  { value: 'unknown', label: 'هنوز مشخص نیست' },
];

export const PROPERTY_TYPE_OPTIONS: SelectOption[] = [
  { value: 'garden_house', label: 'خانه باغ یا باغ‌ویلا' },
  { value: 'villa', label: 'ویلا یا آپارتمان' },
  { value: 'residential_land', label: 'زمین مسکونی' },
  { value: 'agricultural_land', label: 'زمین کشاورزی' },
  { value: 'tourism_land', label: 'زمین گردشگری' },
  { value: 'commercial', label: 'ملک تجاری' },
  { value: 'other', label: 'سایر' },
  { value: 'unknown', label: 'هنوز مشخص نیست' },
];

export const PURPOSE_OPTIONS: SelectOption[] = [
  { value: 'residence', label: 'زندگی و اقامت' },
  { value: 'leisure', label: 'تفریح و سفر' },
  { value: 'investment', label: 'سرمایه‌گذاری' },
  { value: 'development', label: 'ساخت‌وساز' },
  { value: 'other', label: 'سایر' },
];

export const DOCUMENT_STATUS_OPTIONS: SelectOption[] = [
  { value: 'single_page', label: 'سند تک‌برگ' },
  { value: 'official_other', label: 'سند رسمی دیگر' },
  { value: 'other_needs_review', label: 'سایر موارد — نیاز به بررسی' },
  { value: 'need_advice', label: 'در این مورد به راهنمایی نیاز دارم' },
];

export const TIMEFRAME_OPTIONS: SelectOption[] = [
  { value: 'this_month', label: 'همین ماه' },
  { value: 'within_3_months', label: 'تا ۳ ماه آینده' },
  { value: 'three_to_six_months', label: '۳ تا ۶ ماه آینده' },
  { value: 'still_researching', label: 'فعلاً در حال بررسی هستم' },
];

export const EMPTY_LEAD_FORM: LeadFormValues = {
  fullName: '',
  phone: '',
  budget: '',
  budgetCustomMin: '',
  budgetCustomMax: '',
  city: '',
  propertyType: '',
  purpose: '',
  documentStatus: '',
  timeframe: '',
  notes: '',
};

/** Label for a stored value; empty string when it is unknown. */
export function labelOf(options: SelectOption[], value: string): string {
  return options.find((option) => option.value === value)?.label ?? '';
}
