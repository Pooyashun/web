# ملک بلد | MelkBalad

دستیار خرید امن ملک در گیلان — یک وب‌سایت تک‌صفحه‌ای فارسی (RTL) که با پنج سؤال کوتاه، سلیقه خرید ملک کاربر را می‌سنجد، یک نتیجه شخصی‌سازی‌شده می‌سازد و سپس درخواست مشاوره او را ثبت می‌کند.

A Persian (RTL) single-page landing site for a Gilan real-estate consultation brand: a five-question quiz, a deterministic client-side result engine, and a lead form that posts to a server-side endpoint prepared for Telegram.

## What it does

1. Landing page with hero, imagery and trust sections.
2. Five-question multiple-choice quiz, one question per screen, with progress, back navigation and preserved answers.
3. A **deterministic, rules-based** result engine (no AI, no external API) producing a property-preference result.
4. A lead form collecting contact details, budget, area, property type, purpose, document status and timeframe — together with the quiz answers and the generated result.
5. A server-side endpoint (`POST /api/leads`) that validates, stores and (optionally) forwards the lead to Telegram.

## Structure

```
frontend/                      React + TypeScript + Vite SPA (RTL, Persian)
  src/data/quiz.ts             the five questions and their trait weights
  src/data/resultEngine.ts     scoring rules + all Persian result copy
  src/data/formOptions.ts      lead-form select options
  src/data/images.ts           curated Gilan imagery + credits
  src/components/              focused UI components
  src/services/leadApi.ts      the only place that talks to the API
backend/                       Express API (plain Node ESM, no build step)
  src/server.js                routes + CORS
  src/validate.js              shared validation rules (Persian error messages)
  src/telegram.js              Telegram Bot API forwarding (server-side only)
  src/store.js                 append-only JSONL lead log
```

## Running locally

```bash
docker compose -f docker-compose.base44.yml up -d --build
```

- Web (Vite dev server, live reload): http://localhost:3000
- API: http://localhost:8000/health

Useful commands:

```bash
docker compose -f docker-compose.base44.yml ps
docker compose -f docker-compose.base44.yml logs -f web
docker compose -f docker-compose.base44.yml exec web npx tsc --noEmit   # typecheck
```

## Environment variables

| Name                  | Where it goes                              | Purpose                                                                 |
| --------------------- | ------------------------------------------ | ----------------------------------------------------------------------- |
| `VITE_LEAD_API_URL`   | `web` service environment                  | Public URL of the lead endpoint used by the browser. **Must not contain secrets.** |
| `CLIENT_ORIGIN`       | `api` service environment                  | Comma-separated list of browser origins allowed to POST leads (CORS).    |
| `LEAD_DATA_DIR`       | `api` service environment                  | Where the JSONL lead log is written (a named volume in compose).         |
| `TELEGRAM_BOT_TOKEN`  | platform secret file `/run/base44/app.env` | Bot token used server-side to forward leads. Never exposed to the browser. |
| `TELEGRAM_CHAT_ID`    | platform secret file `/run/base44/app.env` | Chat that receives new leads.                                            |

`TELEGRAM_*` are **optional**: without them the API still accepts and stores leads and reports `"telegram": false` on `/health`. The frontend never sees the token — Telegram is only ever called from the server.

### Submission behaviour

`src/services/leadApi.ts` is the single transport boundary:

- **`VITE_LEAD_API_URL` set** → `POST` JSON; success is shown **only** after the server replies `{ "ok": true }`. On failure the form keeps every value and shows a retry message.
- **`VITE_LEAD_API_URL` empty** → the quiz and form stay usable for preview, an info banner says submission is not connected, and no success is ever claimed.

Leads are never written to browser `localStorage`.

## Editing the quiz and the result rules

Both live in data, not logic:

- Add or reword questions in `frontend/src/data/quiz.ts`. Each option carries `weights` over a shared trait space.
- Every output dimension (property category, environment, purpose, property type, priority, decision style) is a weighted profile over those same traits in `frontend/src/data/resultEngine.ts`, and the Persian result copy sits in the same file.

The engine scores each profile as a normalised weighted sum, so results depend on **all** answers rather than any single question.

This is a property-preference quiz, not a psychological or financial assessment — the UI states that explicitly.

## Sandbox / Base44 notes

- `BASE44_PREVIEW_MODE` is passed through to both services but is not required; when it is not exactly `"1"` the app behaves exactly like a normal local run.
- Two origins are used: the browser reaches the API on its own public port, and `VITE_LEAD_API_URL` is composed from `BASE44_PUBLIC_HOST_SUFFIX` — the value is never hardcoded.
- Dev servers bind `0.0.0.0`. Vite's allowed-host list is extended by the platform through `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` (Vite ≥ 6.1), so no hostname is written into config.
- `.env.base44-defaults` holds empty Telegram placeholders and is listed **before** `/run/base44/app.env` in compose, so real dashboard values always win.

## Images

Photographs of Gilan (forests, rice fields, villages, the Anzali lagoon) are hot-linked from Wikimedia Commons and credited with author and licence in the footer — see `frontend/src/data/images.ts`. Replace the URLs there to use your own photography.

## Not in this phase

No property marketplace, listing system, login, admin dashboard, database or AI integration.
