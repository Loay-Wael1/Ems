DROP TABLE IF EXISTS leads_new;

CREATE TABLE IF NOT EXISTS leads_new (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  branch TEXT NOT NULL CHECK (branch IN ('smouha', 'ganaklis')),
  locale TEXT NOT NULL DEFAULT 'en',
  page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'arrived', 'booked')),
  notes TEXT NOT NULL DEFAULT '',
  user_agent TEXT,
  ip_hash TEXT
);

INSERT INTO leads_new (
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
)
SELECT
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
  CASE
    WHEN status = 'new' THEN 'new'
    WHEN status = 'contacted' THEN 'arrived'
    WHEN status = 'booked' THEN 'booked'
    WHEN status = 'cancelled' THEN 'new'
    ELSE 'new'
  END,
  notes,
  user_agent,
  ip_hash
FROM leads;

DROP TABLE leads;

ALTER TABLE leads_new RENAME TO leads;

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_branch ON leads (branch);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads (phone);
