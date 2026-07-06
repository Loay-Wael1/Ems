import { leadsToCsv } from '../../../_utils/csv';
import { pruneOldLeads, type Env } from '../../../_utils/db';
import { requireAdmin, safeErrorMessage, securityHeaders } from '../../../_utils/security';

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  if (!(await requireAdmin(request, env.ADMIN_SESSION_SECRET || ''))) {
    return new Response('Unauthorized', {
      status: 401,
      headers: securityHeaders({ 'Content-Type': 'text/plain; charset=utf-8' })
    });
  }

  try {
    await pruneOldLeads(env.DB).catch((error) => {
      console.error('admin_export_prune_failed', safeErrorMessage(error));
    });

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
  } catch (error) {
    console.error('admin_export_failed', safeErrorMessage(error));
    return new Response('Something went wrong.', {
      status: 500,
      headers: securityHeaders({ 'Content-Type': 'text/plain; charset=utf-8' })
    });
  }
};
