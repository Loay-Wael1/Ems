import { leadsToCsv } from '../../../_utils/csv';
import type { Env } from '../../../_utils/db';
import { requireAdmin, securityHeaders } from '../../../_utils/security';

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  if (!(await requireAdmin(request, env.ADMIN_SESSION_SECRET || ''))) {
    return new Response('Unauthorized', {
      status: 401,
      headers: securityHeaders({ 'Content-Type': 'text/plain; charset=utf-8' })
    });
  }

  const result = await env.DB.prepare(
    `SELECT
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
    LIMIT 5000`
  ).all();

  return new Response(leadsToCsv(result.results || []), {
    headers: securityHeaders({
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="easy-fit-leads.csv"'
    })
  });
};
