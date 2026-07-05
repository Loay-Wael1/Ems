# Easy Fit Leads Admin on Cloudflare Pages + D1

This feature keeps the public Astro landing page static. Dynamic behavior is handled only by Cloudflare Pages Functions and a D1 binding named `DB`.

## Files Added

- `src/components/LeadForm.astro` adds the public lead form inside the final CTA after Locations.
- `src/pages/admin.astro` adds the protected admin UI.
- `functions/api/leads.ts` accepts public lead submissions.
- `functions/api/admin/*` handles login, logout, listing, updating, and CSV export.
- `migrations/0001_create_leads.sql` creates the D1 schema.

## Required Cloudflare Bindings

Deployed Cloudflare Pages bindings are managed from the Cloudflare Dashboard, not from `wrangler.toml`.
There is intentionally no committed Wrangler config for this Pages project.

In Cloudflare:

1. Open Workers & Pages.
2. Choose the Easy Fit Pages project.
3. Go to Settings -> Bindings.
4. Add a D1 database binding.
5. Variable name: `DB`
6. Select the Easy Fit leads D1 database.

The code expects `context.env.DB`.

## Required Environment Variables

Set these in Cloudflare Pages project settings:

- `ADMIN_PASSWORD_HASH`
- `ADMIN_SESSION_SECRET`
- `RATE_LIMIT_SECRET`

Do not commit real values.

## Automatic Lead Pruning

Leads older than 4 days are automatically pruned from the database by the Pages Functions when API requests are made. This is intentional to prevent unlimited storage growth. The admin dashboard is for managing recent leads only, not for long-term CRM storage.

## Create the Admin Password Hash

Run this locally and paste the output into `ADMIN_PASSWORD_HASH`:

```bash
node -e "const crypto=require('crypto'); const password=process.argv[1]; const salt=crypto.randomBytes(16); const iterations=100000; crypto.pbkdf2(password,salt,iterations,32,'sha256',(err,key)=>{if(err)throw err; const b64=v=>v.toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); console.log('pbkdf2:'+iterations+':'+b64(salt)+':'+b64(key))})" "YOUR_ADMIN_PASSWORD"
```

**Important:** `ADMIN_PASSWORD_HASH` must use exactly `pbkdf2:100000:...`. Do not use iterations above 100,000 as they are not supported on the Cloudflare Pages runtime.

Generate strong secrets:

```bash
node -e "console.log(crypto.randomBytes(32).toString('base64url'))"
```

Use separate values for `ADMIN_SESSION_SECRET` and `RATE_LIMIT_SECRET`.

## Create D1 Database And Apply Migration

```bash
npx wrangler d1 create easy-fit-leads
```

Apply the migration to the Cloudflare D1 database before using the admin dashboard:

```bash
npx wrangler d1 migrations apply easy-fit-leads --remote
```

## Local Environment Variables

Create `.dev.vars` locally only:

```txt
ADMIN_PASSWORD_HASH=pbkdf2:...
ADMIN_SESSION_SECRET=...
RATE_LIMIT_SECRET=...
```

Do not commit `.dev.vars`.

## Run Static Build

```bash
npm run build
```

## Test Pages Functions Locally

Run Pages dev against the built `dist` output and bind local D1 as `DB`:

```bash
npx wrangler pages dev dist --d1 DB=easy-fit-leads
```

Local `.dev.vars` is loaded by Wrangler Pages dev and must stay local only.

Open:

- Landing page: `http://localhost:8788/`
- Admin: `http://localhost:8788/admin`

## Test Form Submission

1. Open the landing page.
2. Fill Name, Phone number, and Preferred branch.
3. Submit.
4. Confirm the success message appears.
5. Check D1:

```bash
npx wrangler d1 execute easy-fit-leads --local --command "SELECT created_at, name, phone, branch, status FROM leads ORDER BY created_at DESC LIMIT 5"
```

## Test Admin

1. Open `/admin`.
2. Try a wrong password and confirm login fails.
3. Use the correct password.
4. Confirm leads load.
5. Update status or notes.
6. Click Export CSV.
7. Open `easy-fit-leads.csv` in Excel.
8. Click Logout.

## Production Deploy Checklist

- D1 binding name is exactly `DB`.
- `ADMIN_PASSWORD_HASH` is set.
- `ADMIN_SESSION_SECRET` is set.
- `RATE_LIMIT_SECRET` is set.
- Migration applied remotely.
- No plaintext password committed.
- `/api/leads` accepts public POST only.
- `/api/admin/*` rejects unauthenticated users.

## Security Notes

- Public lead endpoint validates and sanitizes server-side.
- D1 statements use prepared statements and bound parameters.
- Honeypot and timing checks reduce spam.
- Rate limiting stores a hashed IP only, never the raw IP.
- Admin session uses a signed HttpOnly cookie.
- CSV export escapes values and prevents formula injection.
