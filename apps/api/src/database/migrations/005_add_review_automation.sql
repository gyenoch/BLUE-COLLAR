-- ============================================================
-- MIGRATION 005: Review automation fields
-- ============================================================

ALTER TABLE appointments
  ADD COLUMN IF NOT EXISTS review_requested_at  TIMESTAMP,
  ADD COLUMN IF NOT EXISTS review_request_count INT DEFAULT 0;

ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS google_place_id       VARCHAR(255),
  ADD COLUMN IF NOT EXISTS google_review_link    TEXT,
  ADD COLUMN IF NOT EXISTS review_automation_on  BOOLEAN DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS idx_appointments_review ON appointments(business_id, review_requested_at);
