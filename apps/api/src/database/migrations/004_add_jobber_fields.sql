-- ============================================================
-- MIGRATION 004: Jobber CRM integration fields
-- ============================================================

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS jobber_connected_at TIMESTAMP,
  ADD COLUMN IF NOT EXISTS jobber_account_id   VARCHAR(255);

ALTER TABLE customers
  ADD COLUMN IF NOT EXISTS jobber_synced_at TIMESTAMP;

ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS jobber_synced_at TIMESTAMP;

CREATE INDEX IF NOT EXISTS idx_businesses_jobber ON businesses(jobber_account_id);
