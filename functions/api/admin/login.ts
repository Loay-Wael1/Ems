import type { Env } from '../../_utils/db';
import { assertSameOrigin, createAdminCookie, jsonResponse, readJsonBody, verifyPassword } from '../../_utils/security';

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    if (!assertSameOrigin(request)) {
      return jsonResponse({ ok: false, message: 'Login failed.' }, { status: 403 });
    }

    const body = await readJsonBody(request, 1024);
    const password = String(body.password || '');
    if (!password || !env.ADMIN_PASSWORD_HASH || !env.ADMIN_SESSION_SECRET) {
      return jsonResponse({ ok: false, message: 'Login failed.' }, { status: 401 });
    }

    const isValid = await verifyPassword(password, env.ADMIN_PASSWORD_HASH);
    if (!isValid) return jsonResponse({ ok: false, message: 'Login failed.' }, { status: 401 });

    const cookie = await createAdminCookie(env.ADMIN_SESSION_SECRET, request);
    return jsonResponse(
      { ok: true },
      {
        headers: {
          'Set-Cookie': cookie
        }
      }
    );
  } catch {
    return jsonResponse({ ok: false, message: 'Login failed.' }, { status: 401 });
  }
};
