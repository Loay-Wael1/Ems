import { normalizeBranch, normalizeStatus, normalizeText, pruneOldLeads, type Env } from '../../_utils/db';
import { jsonResponse, requireAdmin, safeErrorMessage } from '../../_utils/security';

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  if (!(await requireAdmin(request, env.ADMIN_SESSION_SECRET))) {
    return jsonResponse({ ok: false, message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const branch = normalizeBranch(url.searchParams.get('branch') || '');
    const status = normalizeStatus(url.searchParams.get('status') || '');
    const search = normalizeText(url.searchParams.get('search') || '', 80).toLowerCase();
    const source = normalizeText(url.searchParams.get('source') || '', 120).toLowerCase();
    const medium = normalizeText(url.searchParams.get('medium') || '', 120).toLowerCase();
    const campaign = normalizeText(url.searchParams.get('campaign') || '', 120).toLowerCase();
    const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 100, 1), 100);

    await pruneOldLeads(env.DB).catch((error) => {
      console.error('admin_leads_prune_failed', safeErrorMessage(error));
    });

    const where: string[] = [];
    const bindings: (string | number)[] = [];

    if (branch) {
      where.push('branch = ?');
      bindings.push(branch);
    }

    if (status) {
      where.push('status = ?');
      bindings.push(status);
    }

    if (search) {
      const term = `%${escapeLike(search)}%`;
      where.push("(LOWER(name) LIKE ? ESCAPE '\\' OR LOWER(phone) LIKE ? ESCAPE '\\')");
      bindings.push(term, term);
    }

    if (source) {
      where.push("LOWER(COALESCE(utm_source, '')) = ?");
      bindings.push(source);
    }

    if (medium) {
      where.push("LOWER(COALESCE(utm_medium, '')) = ?");
      bindings.push(medium);
    }

    if (campaign) {
      where.push("LOWER(COALESCE(utm_campaign, '')) LIKE ? ESCAPE '\\'");
      bindings.push(`%${escapeLike(campaign)}%`);
    }

    const leadsStatement = env.DB.prepare(
      `SELECT
        id,
        created_at,
        name,
        phone,
        branch,
        status,
        notes,
        page,
        utm_source,
        utm_medium,
        utm_campaign
      FROM leads
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY created_at DESC
      LIMIT ?`
    ).bind(...bindings, limit);

    const [leadsResult, summaryResult, sourcesResult, mediaResult, campaignsResult] = await env.DB.batch([
      leadsStatement,
      env.DB.prepare(
        `SELECT
          COUNT(*) AS total,
          SUM(CASE WHEN status = 'new' THEN 1 ELSE 0 END) AS new_count,
          SUM(CASE WHEN status = 'arrived' THEN 1 ELSE 0 END) AS arrived_count,
          SUM(CASE WHEN status = 'booked' THEN 1 ELSE 0 END) AS booked_count
        FROM leads`
      ),
      distinctAttributionStatement(env.DB, 'utm_source'),
      distinctAttributionStatement(env.DB, 'utm_medium'),
      distinctAttributionStatement(env.DB, 'utm_campaign')
    ]);

    const aggregate = (summaryResult.results?.[0] || {}) as Record<string, unknown>;
    const summary = {
      total: toCount(aggregate.total),
      new: toCount(aggregate.new_count),
      arrived: toCount(aggregate.arrived_count),
      booked: toCount(aggregate.booked_count)
    };

    const filterOptions = {
      sources: normalizeFilterOptions(sourcesResult.results || []),
      media: normalizeFilterOptions(mediaResult.results || []),
      campaigns: normalizeFilterOptions(campaignsResult.results || [])
    };

    return jsonResponse({ ok: true, leads: leadsResult.results || [], summary, filterOptions });
  } catch (error) {
    console.error('admin_leads_load_failed', safeErrorMessage(error));
    return jsonResponse({ ok: false, message: 'Something went wrong.' }, { status: 500 });
  }
};

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}

function distinctAttributionStatement(db: D1Database, column: 'utm_source' | 'utm_medium' | 'utm_campaign') {
  return db.prepare(
    `SELECT MIN(TRIM(${column})) AS value
     FROM leads
     WHERE TRIM(COALESCE(${column}, '')) <> ''
     GROUP BY LOWER(TRIM(${column}))
     ORDER BY LOWER(TRIM(${column})) ASC
     LIMIT 50`
  );
}

function normalizeFilterOptions(rows: Record<string, unknown>[]) {
  const values = new Map<string, string>();

  rows.forEach((row) => {
    const value = normalizeText(row.value, 120);
    if (value) values.set(value.toLowerCase(), value);
  });

  return [...values.values()].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' })).slice(0, 50);
}

function toCount(value: unknown) {
  const count = Number(value || 0);
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0;
}
