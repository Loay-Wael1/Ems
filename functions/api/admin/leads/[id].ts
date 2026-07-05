import { normalizeStatus, normalizeText, type Env } from '../../../_utils/db';
import { assertSameOrigin, jsonResponse, readJsonBody, requireAdmin } from '../../../_utils/security';

export const onRequestPatch = async ({
  request,
  env,
  params
}: {
  request: Request;
  env: Env;
  params: { id?: string };
}) => {
  if (!(await requireAdmin(request, env.ADMIN_SESSION_SECRET || ''))) {
    return jsonResponse({ ok: false, message: 'Unauthorized.' }, { status: 401 });
  }

  if (!assertSameOrigin(request)) {
    return jsonResponse({ ok: false, message: 'Invalid request.' }, { status: 403 });
  }

  try {
    const id = normalizeText(params.id, 80);
    const body = await readJsonBody(request, 4096);
    const status = normalizeStatus(body.status);
    const notes = normalizeText(body.notes, 1000);

    if (!id || !status) {
      return jsonResponse({ ok: false, message: 'Invalid request.' }, { status: 400 });
    }

    const result = await env.DB.prepare('UPDATE leads SET status = ?, notes = ? WHERE id = ?')
      .bind(status, notes, id)
      .run();

    return jsonResponse({ ok: true, changed: result.meta.changes || 0 });
  } catch {
    return jsonResponse({ ok: false, message: 'Something went wrong.' }, { status: 500 });
  }
};
