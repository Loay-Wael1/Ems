const encoder = new TextEncoder();
const ADMIN_COOKIE = 'easyfit_admin';
const MAX_SESSION_AGE_SECONDS = 60 * 60 * 8;

export const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

export function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      ...jsonHeaders,
      ...(init.headers || {})
    }
  });
}

export function securityHeaders(extra: HeadersInit = {}) {
  return {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    ...extra
  };
}

export function getClientIp(request: Request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'local'
  );
}

export async function hashValue(value: string, secret: string) {
  const data = encoder.encode(`${secret}:${value}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toBase64Url(new Uint8Array(digest));
}

export function getCookie(request: Request, name: string) {
  const header = request.headers.get('Cookie') || '';
  const cookies = header.split(';').map((part) => part.trim());
  const prefix = `${name}=`;
  const match = cookies.find((cookie) => cookie.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : '';
}

export function clearAdminCookie() {
  return `${ADMIN_COOKIE}=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0`;
}

export async function createAdminCookie(secret: string, request: Request) {
  const expiresAt = Math.floor(Date.now() / 1000) + MAX_SESSION_AGE_SECONDS;
  const payload = toBase64Url(
    encoder.encode(
      JSON.stringify({
        exp: expiresAt,
        nonce: crypto.randomUUID()
      })
    )
  );
  const signature = await sign(payload, secret);
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `${ADMIN_COOKIE}=${encodeURIComponent(`${payload}.${signature}`)}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${MAX_SESSION_AGE_SECONDS}${secure}`;
}

export async function requireAdmin(request: Request, secret: string) {
  const cookie = getCookie(request, ADMIN_COOKIE);
  const [payload, signature] = cookie.split('.');
  if (!payload || !signature) return false;

  const expected = await sign(payload, secret);
  if (!constantTimeEqual(signature, expected)) return false;

  try {
    const decoded = JSON.parse(new TextDecoder().decode(fromBase64Url(payload)));
    return typeof decoded.exp === 'number' && decoded.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export async function verifyPassword(password: string, storedHash: string) {
  const parts = storedHash.split(':');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;

  const iterations = Number(parts[1]);
  const salt = fromBase64Url(parts[2]);
  const expected = parts[3];
  if (!Number.isFinite(iterations) || iterations < 100000) return false;

  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt,
      iterations
    },
    key,
    256
  );

  return constantTimeEqual(toBase64Url(new Uint8Array(bits)), expected);
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('Origin');
  if (!origin) return true;

  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export async function readJsonBody(request: Request, maxBytes = 4096) {
  const contentType = request.headers.get('Content-Type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    throw new Error('invalid_content_type');
  }

  const text = await request.text();
  if (text.length > maxBytes) throw new Error('body_too_large');
  return JSON.parse(text);
}

async function sign(payload: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign'
  ]);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

function constantTimeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return result === 0;
}

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}
