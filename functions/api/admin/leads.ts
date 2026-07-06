import { normalizeBranch, normalizeStatus, normalizeText, pruneOldLeads, type Env } from '../../_utils/db';
import { jsonResponse, requireAdmin, safeErrorMessage } from '../../_utils/security';

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  if (!(await requireAdmin(request, env.ADMIN_SESSION_SECRET || ''))) {
    return jsonResponse({ ok: false, message: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const branch = normalizeBranch(url.searchParams.get('branch') || '');
    const status = normalizeStatus(url.searchParams.get('status') || '');
    const search = normalizeText(url.searchParams.get('search') || '', 80).toLowerCase();
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

    const result = await env.DB.prepare(
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
    )
      .bind(...bindings, limit)
      .all();

    return jsonResponse({ ok: true, leads: result.results || [] });
  } catch (error) {
    console.error('admin_leads_load_failed', safeErrorMessage(error));
    return jsonResponse({ ok: false, message: 'Something went wrong.' }, { status: 500 });
  }
};

function escapeLike(value: string) {
  return value.replace(/[\\%_]/g, (match) => `\\${match}`);
}
