-- ============================================================
-- MIGRATION 002: Clerk Integration fields
-- Adds clerk_user_id to technicians if missing, onboarding flag
-- ============================================================

-- Add onboarding_completed flag to businesses
ALTER TABLE businesses
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS onboarding_step       INT     DEFAULT 0;

-- Ensure index exists (idempotent)
CREATE INDEX IF NOT EXISTS idx_businesses_onboarding ON businesses(onboarding_completed);
