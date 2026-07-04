import type { Env } from '../../_utils/db';
import { assertSameOrigin, createAdminCookie, jsonResponse, readJsonBody, verifyPassword } from '../../_utils/security';

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    if (!assertSameOrigin(request)) {
      return jsonResponse({ ok: false, message: 'Login failed.' }, { status: 403 });
    }

    const body = await readJsonBody(request, 1024);
    const password = String(body.password || '');

    if (!password) {
      return jsonResponse({ ok: false, message: 'Login failed.' }, { status: 401 });
    }

    if (!env.ADMIN_PASSWORD_HASH) {
      return jsonResponse({ ok: false, message: 'Login failed.' }, { status: 401 });
    }

    if (!env.ADMIN_SESSION_SECRET) {
      return jsonResponse({ ok: false, message: 'Login failed.' }, { status: 401 });
    }

    let isValid: boolean;
    try {
      isValid = await verifyPassword(password, env.ADMIN_PASSWORD_HASH);
    } catch {
      return jsonResponse({ ok: false, message: 'Login failed.' }, { status: 401 });
    }

    if (!isValid) {
      return jsonResponse({ ok: false, message: 'Login failed.' }, { status: 401 });
    }

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
