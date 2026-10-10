import express from 'express';
import cors from 'cors';
import { validateLead } from './validate.js';
import { sendToTelegram, telegramConfigured } from './telegram.js';
import { storeLead } from './store.js';

const PORT = Number(process.env.PORT || 8000);

/**
 * Origins allowed to POST leads. In the sandbox this is the public frontend
 * origin (https://3000-<suffix>) supplied by docker compose. When unset (plain
 * local run without the compose file) every origin is accepted so the API stays
 * usable, and we log that fact.
 */
const ALLOWED_ORIGINS = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

if (ALLOWED_ORIGINS.length === 0) {
  console.warn('[cors] CLIENT_ORIGIN is not set — accepting requests from any origin.');
}

const app = express();
app.disable('x-powered-by');

app.use(
  cors({
    origin(origin, callback) {
      // Same-origin / non-browser requests have no Origin header.
      if (!origin || ALLOWED_ORIGINS.length === 0 || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    methods: ['POST', 'GET', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  }),
);

app.use(express.json({ limit: '64kb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true, telegram: telegramConfigured() });
});

app.post('/api/leads', async (req, res) => {
  const { ok, errors, value } = validateLead(req.body);

  if (!ok) {
    res.status(400).json({ ok: false, error: 'اطلاعات ارسالی معتبر نیست.', errors });
    return;
  }

  const stored = await storeLead(value);
  const delivered = await sendToTelegram(value);

  if (!stored && !delivered) {
    console.error('[api] lead could not be stored or delivered', value.submissionId);
    res.status(500).json({
      ok: false,
      error: 'در حال حاضر ثبت درخواست ممکن نیست. لطفاً کمی بعد دوباره تلاش کنید.',
    });
    return;
  }

  res.json({
    ok: true,
    submissionId: value.submissionId,
    delivery: delivered ? 'telegram' : 'server',
    stored,
  });
});

app.use((_req, res) => {
  res.status(404).json({ ok: false, error: 'not_found' });
});

// eslint-disable-next-line no-unused-vars
app.use((error, _req, res, _next) => {
  console.error('[api] unhandled error', error?.message ?? error);
  res.status(500).json({ ok: false, error: 'خطای غیرمنتظره در سرور.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[api] listening on http://0.0.0.0:${PORT}`);
  console.log(`[api] telegram forwarding: ${telegramConfigured() ? 'enabled' : 'not configured'}`);
});
