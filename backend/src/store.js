import path from 'node:path';
import { promises as fs } from 'node:fs';

/**
 * Minimal append-only lead store.
 *
 * This is intentionally NOT a database or an admin system: it is a single
 * newline-delimited JSON file so that a lead is never silently discarded while
 * the Telegram integration is not configured yet.
 */

const DATA_DIR = process.env.LEAD_DATA_DIR || path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'leads.jsonl');

export async function storeLead(lead) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.appendFile(DATA_FILE, `${JSON.stringify(lead)}\n`, 'utf8');
    return true;
  } catch (error) {
    console.error('[storage] failed to store lead', error?.message ?? error);
    return false;
  }
}
