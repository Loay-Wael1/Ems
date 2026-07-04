import { enforceRateLimit, isReasonablePhone, normalizeBranch, normalizeText, type Env } from '../_utils/db';
import { assertSameOrigin, getClientIp, hashValue, jsonResponse, readJsonBody } from '../_utils/security';

const GENERIC_VALIDATION = 'Please check your details and try again.';
const GENERIC_ERROR = 'Something went wrong. Please try again.';

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  try {
    if (!assertSameOrigin(request)) {
      return jsonResponse({ ok: false, message: GENERIC_VALIDATION }, { status: 403 });
    }

    const body = await readJsonBody(request, 4096);
    const honeypot = normalizeText(body.company, 120);
    if (honeypot) return jsonResponse({ ok: true });

    const renderedAt = Number(body.renderedAt || 0);
    const submittedAt = Number(body.submittedAt || Date.now());
    if (!Number.isFinite(renderedAt) || submittedAt - renderedAt < 1200) {
      return jsonResponse({ ok: true });
    }

    const name = normalizeText(body.name, 80);
    const phone = normalizeText(body.phone, 30);
    const branch = normalizeBranch(body.branch);

    if (!name || name.length < 2 || !phone || !isReasonablePhone(phone) || !branch) {
      return jsonResponse({ ok: false, message: GENERIC_VALIDATION }, { status: 400 });
    }

    const ipHash = await hashValue(getClientIp(request), env.RATE_LIMIT_SECRET || 'local-dev-rate-limit-secret');
    const allowed = await enforceRateLimit(env.DB, ipHash);
    if (!allowed) {
      return jsonResponse({ ok: false, message: GENERIC_VALIDATION }, { status: 429 });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const locale = normalizeText(body.locale, 8) || 'en';
    const page = normalizeText(body.page, 180);
    const utmSource = normalizeText(body.utm_source, 120);
    const utmMedium = normalizeText(body.utm_medium, 120);
    const utmCampaign = normalizeText(body.utm_campaign, 120);
    const userAgent = normalizeText(request.headers.get('User-Agent'), 240);

    await env.DB.prepare(
      `INSERT INTO leads (
        id,
        created_at,
        name,
        phone,
        branch,
        locale,
        page,
        utm_source,
        utm_medium,
        utm_campaign,
        status,
        notes,
        user_agent,
        ip_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', '', ?, ?)`
    )
      .bind(id, createdAt, name, phone, branch, locale, page, utmSource, utmMedium, utmCampaign, userAgent, ipHash)
      .run();

    return jsonResponse({ ok: true });
  } catch {
    return jsonResponse({ ok: false, message: GENERIC_ERROR }, { status: 500 });
  }
};
