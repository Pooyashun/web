/**
 * Deterministic, rules-based result engine.
 *
 * There is no AI and no external API here: every option in `quiz.ts` adds to a
 * shared trait space, and each output dimension (category, environment, purpose,
 * property type, priority, decision style) is a weighted profile over those same
 * traits. The winner is the profile with the highest normalised weighted sum, so
 * results depend on all answers rather than any single question.
 *
 * All Persian result copy lives here so editing the rules means editing data.
 */

import { QUIZ_QUESTIONS } from './quiz';
import type {
  AnswerId,
  CategoryKey,
  EnvironmentKey,
  PriorityKey,
  PropertyTypeKey,
  PurposeKey,
  QuizAnswerDetail,
  QuizAnswers,
  QuizResult,
  StyleKey,
  TraitKey,
  TraitScores,
} from '../types';

const TRAIT_KEYS: TraitKey[] = [
  'calm',
  'permanent',
  'leisure',
  'investment',
  'build',
  'nature',
  'cityAccess',
  'village',
  'sea',
  'budget',
  'growth',
  'access',
  'advisory',
  'specificArea',
  'opportunity',
  'undecided',
];

type TraitProfile = Partial<Record<TraitKey, number>>;

function emptyScores(): TraitScores {
  const scores = {} as TraitScores;
  for (const trait of TRAIT_KEYS) scores[trait] = 0;
  return scores;
}

/** Adds every selected option's weights into the shared trait space. */
function scoreTraits(answers: QuizAnswers): TraitScores {
  const scores = emptyScores();

  for (const question of QUIZ_QUESTIONS) {
    const answerId = answers[question.id];
    if (!answerId) continue;
    const option = question.options.find((candidate) => candidate.id === answerId);
    if (!option) continue;

    for (const [trait, weight] of Object.entries(option.weights) as [TraitKey, number][]) {
      scores[trait] += weight;
    }
  }

  return scores;
}

/** Normalised weighted sum of a profile against the user's trait scores. */
function profileScore(profile: TraitProfile, scores: TraitScores): number {
  let total = 0;
  let weight = 0;

  for (const [trait, value] of Object.entries(profile) as [TraitKey, number][]) {
    total += value * scores[trait];
    weight += value;
  }

  return weight > 0 ? total / weight : 0;
}

function bestKey<K extends string>(profiles: Record<K, TraitProfile>, scores: TraitScores): K {
  const keys = Object.keys(profiles) as K[];
  return keys.reduce((best, key) =>
    profileScore(profiles[key], scores) > profileScore(profiles[best], scores) ? key : best,
  );
}

const CATEGORY_PROFILES: Record<CategoryKey, TraitProfile> = {
  peace: { calm: 3, nature: 2, village: 2, permanent: 1 },
  gardenHouse: { village: 2, nature: 3, leisure: 1, calm: 1 },
  leisureVilla: { leisure: 3, sea: 2, nature: 1 },
  buildLand: { build: 3, opportunity: 2 },
  investment: { investment: 3, growth: 3, opportunity: 1 },
  valueBuy: { budget: 3, opportunity: 3, growth: 1 },
};

const ENVIRONMENT_PROFILES: Record<EnvironmentKey, TraitProfile> = {
  greenRural: { nature: 3, village: 2, calm: 2 },
  cityEdge: { cityAccess: 3, access: 2, permanent: 1 },
  seaTourism: { sea: 3, leisure: 2 },
  calmAccess: { calm: 2, access: 2, nature: 1 },
};

const PURPOSE_PROFILES: Record<PurposeKey, TraitProfile> = {
  living: { permanent: 3, calm: 1 },
  leisure: { leisure: 3, sea: 1, nature: 1 },
  investment: { investment: 3, growth: 3, opportunity: 1 },
  development: { build: 3, opportunity: 1 },
};

const PROPERTY_TYPE_PROFILES: Record<PropertyTypeKey, TraitProfile> = {
  gardenHouse: { village: 2, nature: 2, calm: 1, permanent: 1 },
  land: { build: 3, opportunity: 2 },
  villa: { permanent: 1, leisure: 1, cityAccess: 1, sea: 1 },
  investLand: { investment: 2, growth: 2, budget: 1 },
};

const PRIORITY_PROFILES: Record<PriorityKey, TraitProfile> = {
  peace: { calm: 3, nature: 2 },
  budget: { budget: 3, opportunity: 2 },
  growth: { growth: 3, investment: 2 },
  access: { access: 3, cityAccess: 2 },
};

const STYLE_PROFILES: Record<StyleKey, TraitProfile> = {
  advisory: { advisory: 3, calm: 1 },
  specificArea: { specificArea: 3, access: 1 },
  opportunity: { opportunity: 3, budget: 2, growth: 1 },
  undecided: { undecided: 3, budget: 1 },
};

const CATEGORY_LABELS: Record<CategoryKey, string> = {
  peace: 'آرامش و زندگی در طبیعت',
  gardenHouse: 'باغ‌ویلا و خانه روستایی',
  leisureVilla: 'ویلای تفریحی',
  buildLand: 'زمین ساخت‌وساز',
  investment: 'سرمایه‌گذاری و رشد ارزش',
  valueBuy: 'خرید فرصت‌محور',
};

const ENVIRONMENT_LABELS: Record<EnvironmentKey, string> = {
  greenRural: 'دشت‌ها و روستاهای سرسبز',
  cityEdge: 'حاشیه شهر با دسترسی مناسب',
  seaTourism: 'ساحل و مناطق گردشگری',
  calmAccess: 'مناطق آرام با راه دسترسی مناسب',
};

const PURPOSE_LABELS: Record<PurposeKey, string> = {
  living: 'زندگی و اقامت',
  leisure: 'تفریح و سفر',
  investment: 'سرمایه‌گذاری',
  development: 'ساخت‌وساز',
};

const PROPERTY_TYPE_LABELS: Record<PropertyTypeKey, string> = {
  gardenHouse: 'خانه روستایی یا باغ‌ویلا',
  land: 'زمین (ساخت‌وساز یا کشاورزی)',
  villa: 'ویلا یا آپارتمان نوساز',
  investLand: 'ملک آماده اجاره یا بازفروش',
};

const PRIORITY_LABELS: Record<PriorityKey, string> = {
  peace: 'آرامش',
  budget: 'بودجه و قیمت مناسب',
  growth: 'رشد ارزش ملک',
  access: 'دسترسی و راه ارتباطی',
};

const STYLE_LABELS: Record<StyleKey, string> = {
  advisory: 'مشورت‌محور',
  specificArea: 'منطقه‌محور',
  opportunity: 'فرصت‌محور',
  undecided: 'در حال بررسی گزینه‌ها',
};

/** Which curated image represents each environment. */
const ENVIRONMENT_IMAGE_KEYS: Record<EnvironmentKey, string> = {
  greenRural: 'riceField',
  cityEdge: 'cityEdge',
  seaTourism: 'lagoon',
  calmAccess: 'forestRoad',
};

/**
 * Location wording stays deliberately soft: these are *areas to investigate*,
 * never an objective "best area", and every result carries `RESULTS_DISCLAIMER`.
 */
const LOCATION_HINTS: Record<EnvironmentKey, string> = {
  greenRural:
    'روستاها و دشت‌های اطراف فومن، شفت و صومعه‌سرا می‌توانند گزینه‌هایی برای بررسی بیشتر باشند — نه به‌عنوان بهترین منطقه، بلکه به‌عنوان نقطه‌ای برای شروع جست‌وجو.',
  cityEdge:
    'محدوده‌های حاشیه شهرهای رشت و لاهیجان می‌توانند ارزش بررسی داشته باشند — این‌ها پیشنهادهایی برای شروع جست‌وجو هستند، نه یک انتخاب قطعی.',
  seaTourism:
    'محدوده‌های نزدیک ساحل در بندر انزلی و نواحی ساحلی گیلان می‌توانند گزینه‌هایی برای بررسی بیشتر باشند — به‌عنوان نقاطی برای پژوهش، نه بهترین منطقه.',
  calmAccess:
    'روستاهای آرام با راه دسترسی مناسب در محورهای اطراف فومن و رشت می‌توانند ارزش بررسی داشته باشند — نقطه‌ای برای شروع جست‌وجو، نه یک توصیه قطعی.',
};

interface CategoryCopy {
  headline: string;
  summary: string;
  recommendedTypes: string[];
  checklist: string[];
}

const CATEGORY_COPY: Record<CategoryKey, CategoryCopy> = {
  peace: {
    headline: 'تو دنبال یک زندگی آرام و نزدیک به طبیعت در گیلان هستی',
    summary:
      'پاسخ‌هایت نشان می‌دهد آرامش، فضای سبز و دور بودن از شلوغی برایت در اولویت است. به‌جای تمرکز بر رشد سریع قیمت، بیشتر به دنبال جایی هستی که در آن راحت زندگی کنی.',
    recommendedTypes: [
      'خانه روستایی با حیاط و فضای سبز',
      'باغ‌ویلا در محدوده‌های آرام',
      'زمین مسکونی برای ساخت یک خانه شخصی',
    ],
    checklist: [
      'وضعیت راه دسترسی روستا',
      'کاربری زمین و امکان ساخت‌وساز',
      'دسترسی به آب، برق و خدمات پایه',
      'فاصله واقعی تا نزدیک‌ترین شهر و مرکز درمانی',
    ],
  },
  gardenHouse: {
    headline: 'سلیقه‌ات به سمت باغ‌ویلا و خانه‌های روستایی می‌رود',
    summary:
      'برای تو ترکیب یک خانه دنج با باغ و فضای سبز جذاب‌تر از یک واحد شهری است؛ جایی که هم بتوانی استراحت کنی و هم از طبیعت اطراف لذت ببری.',
    recommendedTypes: [
      'باغ‌ویلا با درختان میوه',
      'خانه روستایی بازسازی‌شده',
      'زمین باغ با امکان ساخت',
    ],
    checklist: [
      'محدوده باغ و مقدار آب موجود',
      'قدمت بنا و برآورد هزینه بازسازی',
      'مسیر دسترسی برای خودرو',
      'شرایط همسایگی و حریم ملک',
    ],
  },
  leisureVilla: {
    headline: 'تو بیشتر دنبال یک ویلای تفریحی برای فرار از شلوغی هستی',
    summary:
      'به نظر می‌رسد خرید ملک برایت بیشتر یک پایگاه تفریحی و سفرهای کوتاه است تا محل زندگی دائمی؛ پس دسترسی راحت و فضای آرام برایت مهم است.',
    recommendedTypes: [
      'ویلا یا آپارتمان نوساز',
      'خانه نزدیک به ساحل',
      'واحد آماده برای اجاره کوتاه‌مدت',
    ],
    checklist: [
      'فاصله تا ساحل و جاذبه‌های گردشگری',
      'شرایط اجاره و محدودیت‌های منطقه',
      'دوام بنا در برابر رطوبت و بارش',
      'هزینه نگهداری در طول سال',
    ],
  },
  buildLand: {
    headline: 'ترجیح تو خرید زمین برای ساخت‌وساز است',
    summary:
      'تو بیشتر به فکر ساختن هستی: زمینی که بتوانی روی آن برنامه‌ریزی کنی و ملک مورد نظر خودت را بسازی؛ پس کاربری و مجوزهای ساخت برایت تعیین‌کننده است.',
    recommendedTypes: [
      'زمین مسکونی با کاربری مشخص',
      'زمین با دسترسی مناسب به جاده',
      'قطعه زمین در محدوده‌های در حال توسعه',
    ],
    checklist: [
      'کاربری و مساحت زمین در سند',
      'امکان دریافت مجوز ساخت',
      'شیب زمین و وضعیت آب و برق',
      'حریم راه و محدودیت‌های محلی',
    ],
  },
  investment: {
    headline: 'نگاه تو به خرید ملک، سرمایه‌ای و بلندمدت است',
    summary:
      'تو ملک را بیشتر به‌عنوان یک دارایی می‌بینی و به رشد ارزش، تقاضا و امکان بازفروش فکر می‌کنی. بنابراین موقعیت و آینده محدوده برایت از جزئیات ظاهری مهم‌تر است.',
    recommendedTypes: [
      'زمین در محدوده‌های در حال رشد',
      'ملک آماده اجاره',
      'واحد با امکان بازفروش در کوتاه‌مدت',
    ],
    checklist: [
      'روند قیمت و تقاضا در منطقه',
      'وضعیت سند و امکان انتقال سریع',
      'برنامه‌های عمرانی و دسترسی‌های آینده',
      'هزینه‌های نگهداری و مالیات احتمالی',
    ],
  },
  valueBuy: {
    headline: 'تو دنبال فرصت و قیمت مناسب‌تری هستی',
    summary:
      'به نظر می‌رسد بیشتر از آن‌که به دنبال یک گزینه خاص باشی، دنبال ملکی با قیمت مناسب و پتانسیل بالاتر از میانگین هستی؛ پس بررسی دقیق‌تر ارزش ملک برایت مهم است.',
    recommendedTypes: [
      'ملک با قیمت کمتر از میانگین منطقه',
      'زمین یا باغ مناسب برای بازسازی',
      'واحد نیازمند بازسازی جزئی',
    ],
    checklist: [
      'مقایسه قیمت با چند مورد مشابه',
      'دلیل پایین بودن قیمت و بررسی مشکلات احتمالی',
      'وضعیت سند و تعهدات ملک',
      'برآورد هزینه بازسازی و زمان آماده‌سازی',
    ],
  },
};

/** Appended to every result — the quiz is guidance, not a verdict. */
export const RESULTS_DISCLAIMER =
  'این نتیجه فقط بر پایه پاسخ‌های تو و برای راهنمایی اولیه است — نه یک ارزیابی روان‌شناختی یا مالی و نه یک توصیه قطعی برای خرید. پیش از هر اقدام، وضعیت سند، کاربری زمین، دسترسی و قیمت را به‌صورت مستقل و کارشناسی بررسی کن.';

export function computeResult(answers: QuizAnswers): QuizResult {
  const scores = scoreTraits(answers);

  const category = bestKey(CATEGORY_PROFILES, scores);
  const environment = bestKey(ENVIRONMENT_PROFILES, scores);
  const purpose = bestKey(PURPOSE_PROFILES, scores);
  const propertyType = bestKey(PROPERTY_TYPE_PROFILES, scores);
  const priority = bestKey(PRIORITY_PROFILES, scores);
  const style = bestKey(STYLE_PROFILES, scores);
  const copy = CATEGORY_COPY[category];

  return {
    category,
    categoryLabel: CATEGORY_LABELS[category],
    environment,
    environmentLabel: ENVIRONMENT_LABELS[environment],
    headline: copy.headline,
    summary: copy.summary,
    purposeLabel: PURPOSE_LABELS[purpose],
    propertyTypeLabel: PROPERTY_TYPE_LABELS[propertyType],
    priorityLabel: PRIORITY_LABELS[priority],
    styleLabel: STYLE_LABELS[style],
    recommendedTypes: copy.recommendedTypes,
    checklist: copy.checklist,
    locationHint: LOCATION_HINTS[environment],
    imageKey: ENVIRONMENT_IMAGE_KEYS[environment],
  };
}

/** Flattens the answers into the question/answer detail sent with the lead. */
export function summarizeAnswers(answers: QuizAnswers): QuizAnswerDetail[] {
  const details: QuizAnswerDetail[] = [];

  for (const question of QUIZ_QUESTIONS) {
    const answerId: AnswerId | undefined = answers[question.id];
    if (!answerId) continue;
    const option = question.options.find((candidate) => candidate.id === answerId);
    if (!option) continue;

    details.push({
      questionId: question.id,
      question: question.text,
      answerId,
      answerLabel: option.label,
    });
  }

  return details;
}
