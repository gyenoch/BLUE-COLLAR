-- ============================================================
-- MIGRATION 003: Lead scoring columns on calls
-- ============================================================

ALTER TABLE calls
  ADD COLUMN IF NOT EXISTS score_tier VARCHAR(20);  -- hot | warm | lukewarm | cold

-- Composite index for hot-lead dashboard queries
CREATE INDEX IF NOT EXISTS idx_calls_lead_tier ON calls(business_id, score_tier, created_at DESC);
