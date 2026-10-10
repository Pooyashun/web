/**
 * Telegram Bot API forwarding.
 *
 * The bot token lives ONLY here, on the server. It is never exposed to the
 * browser build. When the token/chat id are absent the module reports the
 * integration as not configured and the caller falls back to server-side storage.
 */

const API_BASE = 'https://api.telegram.org';

export function telegramConfigured() {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID);
}

/** Builds a readable Persian notification for the leads chat. */
function buildMessage(lead) {
  const lines = [
    '🏡 درخواست جدید ملک بلد',
    '',
    `👤 نام: ${lead.contact.fullName}`,
    `📱 موبایل: ${lead.contact.phone}`,
    `💰 بودجه: ${lead.form.budgetLabel ?? lead.form.budget}`,
    `📍 منطقه: ${lead.form.cityLabel ?? lead.form.city}`,
    `🏠 نوع ملک: ${lead.form.propertyTypeLabel ?? lead.form.propertyType}`,
    `🎯 هدف خرید: ${lead.form.purposeLabel ?? lead.form.purpose}`,
    `📄 سند: ${lead.form.documentStatusLabel ?? lead.form.documentStatus}`,
    `⏳ زمان خرید: ${lead.form.timeframeLabel ?? lead.form.timeframe}`,
  ];

  if (lead.form.budgetCustomMin || lead.form.budgetCustomMax) {
    const min = lead.form.budgetCustomMin || '؟';
    const max = lead.form.budgetCustomMax || '؟';
    lines.push(`↔️ بازه دلخواه: ${min} تا ${max}`);
  }

  if (lead.form.notes) {
    lines.push('', `📝 توضیحات: ${lead.form.notes}`);
  }

  if (lead.quiz?.result) {
    lines.push(
      '',
      '🧭 نتیجه آزمون:',
      `• ${lead.quiz.result.categoryLabel ?? lead.quiz.result.category}`,
      `• ${lead.quiz.result.environmentLabel ?? lead.quiz.result.environment ?? ''}`.trim(),
    );
    if (lead.quiz.result.headline) lines.push(`• ${lead.quiz.result.headline}`);
  }

  lines.push('', `🆔 ${lead.submissionId ?? '-'}`, `🕒 ${lead.submittedAt ?? lead.receivedAt}`);

  return lines.join('\n');
}

/**
 * @returns {Promise<boolean>} true when Telegram confirmed delivery.
 */
export async function sendToTelegram(lead) {
  if (!telegramConfigured()) return false;

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  try {
    const response = await fetch(`${API_BASE}/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: buildMessage(lead),
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('[telegram] delivery failed', response.status, detail.slice(0, 300));
      return false;
    }
    return true;
  } catch (error) {
    console.error('[telegram] request error', error?.message ?? error);
    return false;
  }
}
