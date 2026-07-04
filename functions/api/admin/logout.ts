import type { Env } from '../../_utils/db';
import { assertSameOrigin, clearAdminCookie, jsonResponse, requireAdmin } from '../../_utils/security';

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!assertSameOrigin(request)) {
    return jsonResponse({ ok: false, message: 'Invalid request.' }, { status: 403 });
  }

  if (!(await requireAdmin(request, env.ADMIN_SESSION_SECRET || ''))) {
    return jsonResponse({ ok: false, message: 'Unauthorized.' }, { status: 401 });
  }

  return jsonResponse(
    { ok: true },
    {
      headers: {
        'Set-Cookie': clearAdminCookie()
      }
    }
  );
};
