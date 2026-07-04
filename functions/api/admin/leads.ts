import { normalizeBranch, normalizeStatus, normalizeText, pruneOldLeads, type Env } from '../../_utils/db';
import { jsonResponse, requireAdmin } from '../../_utils/security';

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  if (!(await requireAdmin(request, env.ADMIN_SESSION_SECRET || ''))) {
    return jsonResponse({ ok: false, message: 'Unauthorized.' }, { status: 401 });
  }

  const url = new URL(request.url);
  const branch = normalizeBranch(url.searchParams.get('branch') || '');
  const status = normalizeStatus(url.searchParams.get('status') || '');
  const search = normalizeText(url.searchParams.get('search') || '', 80).toLowerCase();
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 100, 1), 100);

  await pruneOldLeads(env.DB).catch(() => {});

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
    ORDER BY created_at DESC
    LIMIT 250`
  ).all();

  const rows = (result.results || [])
    .filter((lead: any) => (branch ? lead.branch === branch : true))
    .filter((lead: any) => (status ? lead.status === status : true))
    .filter((lead: any) =>
      search ? `${lead.name || ''} ${lead.phone || ''}`.toLowerCase().includes(search) : true
    )
    .slice(0, limit);

  return jsonResponse({ ok: true, leads: rows });
};
