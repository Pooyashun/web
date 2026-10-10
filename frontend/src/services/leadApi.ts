import type { LeadPayload } from '../types';

/**
 * Submission service. The rest of the app only knows about `submitLead`, so the
 * transport (and a future Telegram integration) can change without touching the
 * form component.
 *
 * The endpoint comes from VITE_LEAD_API_URL. When it is empty the form stays
 * usable for preview, but nothing is sent and no success is ever reported.
 */

const RAW_ENDPOINT = import.meta.env.VITE_LEAD_API_URL;
const ENDPOINT = typeof RAW_ENDPOINT === 'string' ? RAW_ENDPOINT.trim() : '';

export const LEAD_API_URL = ENDPOINT;
export const isLeadApiConfigured = ENDPOINT.length > 0;

export type SubmitFailureReason = 'not_configured' | 'network' | 'server';

export type SubmitResult =
  | { ok: true }
  | { ok: false; reason: SubmitFailureReason; message: string };

const NOT_CONFIGURED_MESSAGE =
  'اتصال ارسال هنوز فعال نشده است؛ در این نسخه پیش‌نمایش، اطلاعاتی برای ما ارسال یا ذخیره نمی‌شود.';

const RETRY_MESSAGE =
  'ارسال درخواست انجام نشد. لطفاً اتصال اینترنتت را بررسی کن و دوباره تلاش کن — اطلاعات فرم حفظ شده است.';

const INVALID_MESSAGE =
  'اطلاعات ارسالی از سمت سرور پذیرفته نشد. لطفاً مقادیر فرم را بررسی کن و دوباره تلاش کن.';

export function createSubmissionId(): string {
  const globalCrypto = globalThis.crypto;
  if (globalCrypto && typeof globalCrypto.randomUUID === 'function') {
    return globalCrypto.randomUUID();
  }
  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export async function submitLead(payload: LeadPayload): Promise<SubmitResult> {
  if (!isLeadApiConfigured) {
    return { ok: false, reason: 'not_configured', message: NOT_CONFIGURED_MESSAGE };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (!response.ok) {
      const serverMessage =
        isRecord(body) && typeof body.error === 'string' ? body.error : null;
      return {
        ok: false,
        reason: 'server',
        message: response.status >= 500 ? serverMessage ?? RETRY_MESSAGE : INVALID_MESSAGE,
      };
    }

    // Only an explicit { ok: true } from the server counts as success.
    if (!isRecord(body) || body.ok !== true) {
      return { ok: false, reason: 'server', message: RETRY_MESSAGE };
    }

    return { ok: true };
  } catch {
    return { ok: false, reason: 'network', message: RETRY_MESSAGE };
  } finally {
    clearTimeout(timeoutId);
  }
}
