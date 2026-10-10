/**
 * The five quiz questions and their trait weights.
 *
 * Every option contributes to the shared trait space in `types.ts`; the result
 * engine turns those traits into a result. Adding or rewording a question means
 * editing this file only — no logic changes.
 */

import type { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: 'هدف اصلی‌ات از خرید ملک در گیلان چیست؟',
    options: [
      { id: 'A', label: 'زندگی و اقامت دائمی', weights: { permanent: 3, calm: 1 } },
      { id: 'B', label: 'ویلای تفریحی و سفرهای کوتاه', weights: { leisure: 3, nature: 1, sea: 1 } },
      { id: 'C', label: 'سرمایه‌گذاری و رشد ارزش', weights: { investment: 3, growth: 2 } },
      { id: 'D', label: 'ساخت‌وساز روی زمین', weights: { build: 3, opportunity: 1 } },
    ],
  },
  {
    id: 2,
    text: 'کدام محیط برایت دلپذیرتر است؟',
    options: [
      { id: 'A', label: 'روستا و دامنه‌های سرسبز و آرام', weights: { village: 2, nature: 2, calm: 2 } },
      { id: 'B', label: 'نزدیکی به شهر و دسترسی به امکانات', weights: { cityAccess: 3, access: 1 } },
      { id: 'C', label: 'کنار دریا و مناطق گردشگری', weights: { sea: 3, leisure: 1 } },
      { id: 'D', label: 'جایی آرام اما با راه دسترسی مناسب', weights: { calm: 2, access: 2, nature: 1 } },
    ],
  },
  {
    id: 3,
    text: 'چقدر برایت مهم است که ملک نزدیک امکانات (بیمارستان، بازار، مدرسه) باشد؟',
    options: [
      { id: 'A', label: 'خیلی مهم است؛ حتماً نزدیک شهر باشد', weights: { cityAccess: 3, access: 2 } },
      { id: 'B', label: 'تا حدی؛ کمی فاصله مشکلی نیست', weights: { cityAccess: 1, access: 1, calm: 1 } },
      { id: 'C', label: 'زیاد مهم نیست؛ آرامش مهم‌تر است', weights: { calm: 3, nature: 1, village: 1 } },
      { id: 'D', label: 'مهم‌ترین چیز، راه دسترسی مناسب است', weights: { access: 3, growth: 1 } },
    ],
  },
  {
    id: 4,
    text: 'چه نوع ملکی بیشتر به سلیقه‌ات می‌خورد؟',
    options: [
      { id: 'A', label: 'خانه روستایی یا باغ‌ویلا با حیاط و درخت', weights: { village: 2, nature: 2, calm: 1, permanent: 1 } },
      { id: 'B', label: 'زمین برای ساخت‌وساز یا کشاورزی', weights: { build: 3, opportunity: 2 } },
      { id: 'C', label: 'ویلا یا آپارتمان نوساز', weights: { permanent: 1, leisure: 1, cityAccess: 1, investment: 1 } },
      { id: 'D', label: 'ملک آماده برای اجاره یا بازفروش', weights: { investment: 2, growth: 2, opportunity: 1 } },
    ],
  },
  {
    id: 5,
    text: 'ترجیح می‌دهی ملک را چطور انتخاب کنی؟',
    options: [
      { id: 'A', label: 'بر اساس منطقه مشخصی که مد نظرم است', weights: { specificArea: 3, access: 1 } },
      { id: 'B', label: 'با مشورت و راهنمایی کارشناس', weights: { advisory: 3, calm: 1 } },
      { id: 'C', label: 'دنبال فرصت و قیمت مناسب می‌گردم', weights: { opportunity: 3, budget: 2, growth: 1 } },
      { id: 'D', label: 'هنوز مطمئن نیستم؛ می‌خواهم گزینه‌ها را ببینم', weights: { undecided: 3, budget: 1 } },
    ],
  },
];
