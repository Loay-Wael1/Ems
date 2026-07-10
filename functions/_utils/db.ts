export interface Env {
  DB: D1Database;
  ADMIN_PASSWORD_HASH: string;
  ADMIN_SESSION_SECRET: string;
  RATE_LIMIT_SECRET: string;
}

export const BRANCHES = ['smouha', 'ganaklis'] as const;
export const STATUSES = ['new', 'arrived', 'booked'] as const;

export function normalizeText(value: unknown, maxLength: number) {
  return String(value || '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

export function normalizeBranch(value: unknown) {
  const branch = String(value || '').trim().toLowerCase();
  return BRANCHES.includes(branch as (typeof BRANCHES)[number]) ? branch : '';
}

export function normalizeStatus(value: unknown) {
  const status = String(value || '').trim().toLowerCase();
  return STATUSES.includes(status as (typeof STATUSES)[number]) ? status : '';
}

export function isReasonablePhone(phone: string) {
  const compact = phone.replace(/[\s().-]/g, '');
  if (compact.length < 7 || compact.length > 16) return false;
  return /^(\+?20|0020)?0?\d{7,11}$/.test(compact);
}

export async function enforceRateLimit(
  db: D1Database,
  ipHash: string,
  options: { windowMs?: number; maxRequests?: number } = {}
) {
  const windowMs = options.windowMs ?? 10 * 60 * 1000;
  const maxRequests = options.maxRequests ?? 8;
  const windowStart = new Date(Math.floor(Date.now() / windowMs) * windowMs).toISOString();

  await db
    .prepare(
      `INSERT INTO lead_rate_limits (ip_hash, window_start, count)
       VALUES (?, ?, 1)
       ON CONFLICT(ip_hash, window_start)
       DO UPDATE SET count = count + 1`
    )
    .bind(ipHash, windowStart)
    .run();

  const current = await db
    .prepare('SELECT count FROM lead_rate_limits WHERE ip_hash = ? AND window_start = ?')
    .bind(ipHash, windowStart)
    .first<{ count: number }>();

  return Number(current?.count || 0) <= maxRequests;
}

export async function pruneOldLeads(db: D1Database) {
  const LEAD_RETENTION_DAYS = 4;
  const cutoff = new Date(Date.now() - LEAD_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString();

  await db.prepare('DELETE FROM leads WHERE created_at < ?').bind(cutoff).run();
  
  const rateLimitCutoff = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString();
  await db.prepare('DELETE FROM lead_rate_limits WHERE window_start < ?').bind(rateLimitCutoff).run();
}
