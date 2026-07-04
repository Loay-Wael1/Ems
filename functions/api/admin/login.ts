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
      console.warn('admin_login_missing_password');
      return jsonResponse({ ok: false, message: 'Login failed.' }, { status: 401 });
    }

    if (!env.ADMIN_PASSWORD_HASH) {
      console.warn('admin_login_missing_admin_hash');
      return jsonResponse({ ok: false, message: 'Login failed.' }, { status: 401 });
    }

    if (!env.ADMIN_SESSION_SECRET) {
      console.warn('admin_login_missing_session_secret');
      return jsonResponse({ ok: false, message: 'Login failed.' }, { status: 401 });
    }

    console.warn('admin_login_hash_meta', {
      hasHash: Boolean(env.ADMIN_PASSWORD_HASH),
      startsWithPbkdf2: String(env.ADMIN_PASSWORD_HASH || '').startsWith('pbkdf2:'),
      partsCount: String(env.ADMIN_PASSWORD_HASH || '').split(':').length,
      iterations: Number(String(env.ADMIN_PASSWORD_HASH || '').split(':')[1] || 0),
      hasSessionSecret: Boolean(env.ADMIN_SESSION_SECRET)
    });

    let isValid: boolean;
    try {
      isValid = await verifyPassword(password, env.ADMIN_PASSWORD_HASH);
    } catch (error) {
      console.warn('admin_login_verify_exception', { message: error instanceof Error ? error.message : 'unknown' });
      return jsonResponse({ ok: false, message: 'Login failed.' }, { status: 401 });
    }

    if (!isValid) {
      console.warn('admin_login_password_mismatch');
      return jsonResponse({ ok: false, message: 'Login failed.' }, { status: 401 });
    }

    console.warn('admin_login_success');
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
