/**
 * Brand identity, contact placeholders and the small DOM helper used by the
 * header, hero and footer calls to action.
 *
 * Contact values are explicit placeholders on purpose — nothing here should look
 * like a real, confirmed phone number, address or channel.
 */

export interface ContactField {
  label: string;
  value: string;
}

export interface SiteInfo {
  brandFa: string;
  brandEn: string;
  tagline: string;
  contact: Record<string, ContactField>;
  contactNote: string;
}

export const SITE: SiteInfo = {
  brandFa: 'ملک بلد',
  brandEn: 'MelkBalad',
  tagline: 'دستیار خرید امن ملک در گیلان',
  contact: {
    phone: { label: 'تلفن', value: 'هنوز نهایی نشده' },
    email: { label: 'ایمیل', value: 'هنوز نهایی نشده' },
    telegram: { label: 'تلگرام', value: 'هنوز نهایی نشده' },
  },
  contactNote: 'راه‌های ارتباطی هنوز نهایی نشده‌اند و به‌زودی در همین بخش اعلام می‌شوند.',
};

/** Smooth-scrolls to a section by id. Safe to call with a missing element. */
export function scrollToSection(id: string): void {
  const target = document.getElementById(id);
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
