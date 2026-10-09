# AGENTS.md — working notes for this repo

Non-obvious things that are easy to get wrong here.

## Run / verify

- Everything runs through `docker compose -f docker-compose.base44.yml up -d --build`.
  Services use plain `node:22-alpine` images with the source bind-mounted, so code
  edits are picked up without rebuilding: Vite HMR for `web`, `node --watch` for `api`.
- Compose mounts the repo, so `node_modules` lives in named Docker volumes
  (`web_node_modules`, `api_node_modules`). Dependencies are installed by the compose
  `command` on each start — do **not** add a `Dockerfile` that `COPY`s the source.
- Typecheck is the only static gate (Vite dev does not typecheck):
  `docker compose -f docker-compose.base44.yml exec -T web npx tsc --noEmit`.
  The frontend is a plain SPA — there is no test runner.
- After a compose/env/dependency change, restart the affected service and then force a
  preview reload; a plain file edit only needs HMR.

## Two-origin wiring (easy to break)

- `web` is published on host **3000** → container 5173. `api` is published on host **8000**.
- The browser calls the API cross-origin at `https://8000-${BASE44_PUBLIC_HOST_SUFFIX}/api/leads`,
  passed in as `VITE_LEAD_API_URL`. Vite only exposes `VITE_`-prefixed vars that are present in
  the container environment at startup, so changing it requires restarting `web`.
- The API's CORS allowlist is `CLIENT_ORIGIN` (the `https://3000-...` origin). If that variable is
  empty the API falls back to allowing any origin and logs a warning.
- Never hardcode a resolved `BASE44_*` host into a file — always reference the variable.

## Secrets

- `/run/base44/app.env` is listed **after** `.env.base44-defaults` in the `api` service, so a
  dashboard value always beats the empty placeholder. Never move Telegram keys under `environment:`.
- `TELEGRAM_*` are optional. `/health` returns `"telegram": true|false` — that is the quickest way
  to confirm whether forwarding is actually configured (never print the values).

## Where leads go

- Leads are appended to `data/leads.jsonl` inside the `lead_data` volume. This is a log, not a
  database: it exists only so a submission is not silently discarded while Telegram is unconfigured.
- Validation rules exist twice on purpose (client for UX, server for safety) —
  `frontend/src/components/LeadForm.tsx` and `backend/src/validate.js` must stay in sync.

## Content rules that are intentional

- Quiz/scoring data lives in `frontend/src/data/`; result copy lives in `resultEngine.ts`.
  Editing rules means editing data, not logic.
- No invented testimonials, statistics, phone numbers, addresses or certifications. Footer contact
  fields are explicit placeholders in `frontend/src/data/site.ts`.
- Location suggestions must stay worded as "areas to investigate", never as an objective
  "best area" — the caveat is appended to every result in `resultEngine.ts`.
- Imagery is hot-linked from Wikimedia Commons and credited in the footer via `data/images.ts`,
  so a working internet connection is needed for photos (layout does not depend on them).
