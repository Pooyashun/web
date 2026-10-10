/**
 * Validation and normalisation for incoming lead submissions.
 * Kept dependency-free and separate from the HTTP layer so it is easy to test.
 */

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';

/** Converts Persian/Arabic-Indic digits to Latin digits. */
export function toLatinDigits(input) {
  return String(input ?? '').replace(/[۰-۹٠-٩]/g, (ch) => {
    const persian = PERSIAN_DIGITS.indexOf(ch);
    if (persian > -1) return String(persian);
    const arabic = ARABIC_DIGITS.indexOf(ch);
    return arabic > -1 ? String(arabic) : ch;
  });
}

/** Strips spaces, dashes and parentheses, and converts digits to Latin. */
export function normalizePhone(raw) {
  return toLatinDigits(raw).replace(/[\s()\-.ـ]/g, '');
}

/** Accepts Iranian mobile numbers written as 09..., 9..., +989..., 00989..., 989... */
const IRAN_MOBILE_RE = /^(?:\+98|0098|98|0)?9\d{9}$/;

export const ALLOWED = {
  budget: [
    'under_1b',
    '1b_2b',
    '2b_4b',
    '4b_7b',
    'over_7b',
    'custom',
    'unknown',
  ],
  city: [
    'shaft',
    'fuman',
    'rasht',
    'someh_sara',
    'bandar_anzali',
    'lahijan',
    'other_gilan',
    'unknown',
  ],
  propertyType: [
    'garden_house',
    'villa',
    'residential_land',
    'agricultural_land',
    'tourism_land',
    'commercial',
    'other',
    'unknown',
  ],
  purpose: ['residence', 'leisure', 'investment', 'development', 'other'],
  documentStatus: ['single_page', 'official_other', 'other_needs_review', 'need_advice'],
  timeframe: ['this_month', 'within_3_months', 'three_to_six_months', 'still_researching'],
};

const ANSWER_IDS = ['A', 'B', 'C', 'D'];

function isNonEmptyString(value, minLength = 1) {
  return typeof value === 'string' && value.trim().length >= minLength;
}

function isAllowed(value, list) {
  return typeof value === 'string' && list.includes(value);
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * @returns {{ ok: boolean, errors: Record<string,string>, value?: object }}
 */
export function validateLead(payload) {
  const errors = {};

  if (!isPlainObject(payload)) {
    return { ok: false, errors: { _: 'ساختار درخواست نامعتبر است.' } };
  }

  const contact = isPlainObject(payload.contact) ? payload.contact : {};
  const form = isPlainObject(payload.form) ? payload.form : {};
  const quiz = isPlainObject(payload.quiz) ? payload.quiz : {};

  const fullName = typeof contact.fullName === 'string' ? contact.fullName.trim() : '';
  if (fullName.length < 3) {
    errors.fullName = 'نام و نام خانوادگی را کامل وارد کنید.';
  }

  const phone = normalizePhone(contact.phone);
  if (!IRAN_MOBILE_RE.test(phone)) {
    errors.phone = 'شماره موبایل معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹).';
  }

  if (!isAllowed(form.budget, ALLOWED.budget)) {
    errors.budget = 'بازه بودجه خرید را انتخاب کنید.';
  }
  if (!isAllowed(form.city, ALLOWED.city)) {
    errors.city = 'شهرستان یا منطقه موردنظر را انتخاب کنید.';
  }
  if (!isAllowed(form.propertyType, ALLOWED.propertyType)) {
    errors.propertyType = 'نوع ملک موردنظر را انتخاب کنید.';
  }
  if (!isAllowed(form.purpose, ALLOWED.purpose)) {
    errors.purpose = 'هدف خرید را انتخاب کنید.';
  }
  if (!isAllowed(form.documentStatus, ALLOWED.documentStatus)) {
    errors.documentStatus = 'وضعیت سند مورد قبول را انتخاب کنید.';
  }
  if (!isAllowed(form.timeframe, ALLOWED.timeframe)) {
    errors.timeframe = 'زمان احتمالی خرید را انتخاب کنید.';
  }

  if (typeof form.notes === 'string' && form.notes.length > 2000) {
    errors.notes = 'توضیحات تکمیلی نباید بیشتر از ۲۰۰۰ کاراکتر باشد.';
  }

  const rawAnswers = Array.isArray(quiz.answers) ? quiz.answers : [];
  if (rawAnswers.length !== 5) {
    errors.quiz = 'پاسخهای آزمون ناقص است.';
  } else {
    for (const [index, item] of rawAnswers.entries()) {
      const answerId = isPlainObject(item) ? item.answerId : undefined;
      if (!ANSWER_IDS.includes(answerId)) {
        errors.quiz = `پاسخ سؤال ${index + 1} نامعتبر است.`;
        break;
      }
    }
  }

  if (!isPlainObject(quiz.result) || !isNonEmptyString(quiz.result.category)) {
    errors.quiz = errors.quiz || 'نتیجه آزمون یافت نشد.';
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      submissionId: isNonEmptyString(payload.submissionId)
        ? String(payload.submissionId).slice(0, 80)
        : null,
      submittedAt: isNonEmptyString(payload.submittedAt) ? String(payload.submittedAt) : null,
      receivedAt: new Date().toISOString(),
      contact: { fullName, phone },
      form: {
        budget: form.budget,
        budgetLabel: typeof form.budgetLabel === 'string' ? form.budgetLabel : null,
        budgetCustomMin: typeof form.budgetCustomMin === 'string' ? form.budgetCustomMin : null,
        budgetCustomMax: typeof form.budgetCustomMax === 'string' ? form.budgetCustomMax : null,
        city: form.city,
        cityLabel: typeof form.cityLabel === 'string' ? form.cityLabel : null,
        propertyType: form.propertyType,
        propertyTypeLabel:
          typeof form.propertyTypeLabel === 'string' ? form.propertyTypeLabel : null,
        purpose: form.purpose,
        purposeLabel: typeof form.purposeLabel === 'string' ? form.purposeLabel : null,
        documentStatus: form.documentStatus,
        documentStatusLabel:
          typeof form.documentStatusLabel === 'string' ? form.documentStatusLabel : null,
        timeframe: form.timeframe,
        timeframeLabel: typeof form.timeframeLabel === 'string' ? form.timeframeLabel : null,
        notes: typeof form.notes === 'string' ? form.notes.trim() : '',
      },
      quiz: {
        answers: rawAnswers.map((item) => ({
          questionId: item.questionId ?? null,
          question: typeof item.question === 'string' ? item.question : null,
          answerId: item.answerId,
          answerLabel: typeof item.answerLabel === 'string' ? item.answerLabel : null,
        })),
        result: {
          category: quiz.result.category,
          categoryLabel: quiz.result.categoryLabel ?? null,
          environment: quiz.result.environment ?? null,
          environmentLabel: quiz.result.environmentLabel ?? null,
          headline: quiz.result.headline ?? null,
          summary: quiz.result.summary ?? null,
        },
      },
    },
  };
}
