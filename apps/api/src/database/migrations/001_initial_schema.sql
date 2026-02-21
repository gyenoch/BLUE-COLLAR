-- ============================================================
-- MIGRATION 001: Initial Schema
-- Blue-Collar Agent — core tables, indexes, triggers, RLS
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- BUSINESSES
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS businesses (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id             VARCHAR(255) UNIQUE NOT NULL,
  business_name             VARCHAR(255) NOT NULL,
  trade_type                VARCHAR(50)  NOT NULL,  -- 'plumbing' | 'hvac' | 'electrical'
  phone_number              VARCHAR(20)  UNIQUE NOT NULL,
  twilio_number             VARCHAR(20),
  owner_name                VARCHAR(255),
  owner_email               VARCHAR(255),
  owner_phone               VARCHAR(20),
  timezone                  VARCHAR(50)  DEFAULT 'America/New_York',

  -- Configuration
  business_hours            JSONB,  -- {"monday": {"open": "08:00", "close": "17:00"}}
  pricing                   JSONB,  -- {"service_call": 99, "emergency_fee": 175}

  -- Subscription & billing
  status                    VARCHAR(20) DEFAULT 'trial',  -- trial | active | paused | cancelled
  stripe_customer_id        VARCHAR(255),
  stripe_subscription_id    VARCHAR(255),
  subscription_status       VARCHAR(50),  -- trialing | active | past_due | cancelled
  subscription_plan         VARCHAR(50),  -- starter | professional | team
  mrr                       DECIMAL(10,2),

  -- Integrations
  jobber_api_key            VARCHAR(255),
  servicetitan_api_key      VARCHAR(255),
  google_calendar_refresh_token TEXT,

  -- Metadata
  created_at                TIMESTAMP DEFAULT NOW(),
  updated_at                TIMESTAMP DEFAULT NOW(),
  trial_ends_at             TIMESTAMP,
  deleted_at                TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_businesses_clerk_user         ON businesses(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_status             ON businesses(status);
CREATE INDEX IF NOT EXISTS idx_businesses_subscription_status ON businesses(subscription_status);
CREATE INDEX IF NOT EXISTS idx_businesses_twilio_number      ON businesses(twilio_number);

-- ──────────────────────────────────────────────────────────
-- TECHNICIANS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS technicians (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id       UUID REFERENCES businesses(id) ON DELETE CASCADE,
  clerk_user_id     VARCHAR(255),
  name              VARCHAR(255) NOT NULL,
  phone             VARCHAR(20),
  email             VARCHAR(255),

  -- Skills & certifications
  skills            TEXT[],
  certifications    TEXT[],
  seniority         VARCHAR(50),  -- apprentice | journeyman | master
  experience_years  INT,

  -- Scheduling
  status            VARCHAR(20) DEFAULT 'active',  -- active | inactive | on_leave
  current_lat       DECIMAL(10, 8),
  current_lng       DECIMAL(11, 8),

  -- Performance
  jobs_completed    INT DEFAULT 0,
  avg_rating        DECIMAL(3,2),

  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_technicians_business   ON technicians(business_id);
CREATE INDEX IF NOT EXISTS idx_technicians_clerk_user ON technicians(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_technicians_status     ON technicians(status);

-- ──────────────────────────────────────────────────────────
-- CUSTOMERS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS customers (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id         UUID REFERENCES businesses(id) ON DELETE CASCADE,

  name                VARCHAR(255),
  phone               VARCHAR(20) NOT NULL,
  email               VARCHAR(255),

  -- Address
  address             TEXT,
  city                VARCHAR(100),
  state               VARCHAR(2),
  zip                 VARCHAR(10),
  latitude            DECIMAL(10, 8),
  longitude           DECIMAL(11, 8),

  -- Preferences
  language            VARCHAR(10) DEFAULT 'en',
  preferred_contact   VARCHAR(20) DEFAULT 'phone',  -- phone | sms | email

  -- Business metrics
  lifetime_value      DECIMAL(10,2) DEFAULT 0,
  total_jobs          INT DEFAULT 0,
  last_service_date   TIMESTAMP,

  -- Integrations
  stripe_customer_id  VARCHAR(255),
  jobber_id           VARCHAR(255),
  servicetitan_id     VARCHAR(255),

  -- Tags & notes
  tags                TEXT[],
  internal_notes      TEXT,

  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW(),

  UNIQUE(business_id, phone)
);

CREATE INDEX IF NOT EXISTS idx_customers_business        ON customers(business_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone           ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email           ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_lifetime_value  ON customers(lifetime_value DESC);

-- ──────────────────────────────────────────────────────────
-- CALLS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS calls (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id           UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id           UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_phone        VARCHAR(20) NOT NULL,

  -- Twilio
  call_sid              VARCHAR(100) UNIQUE,
  direction             VARCHAR(20),    -- inbound | outbound
  duration              INT,            -- seconds
  recording_url         TEXT,

  -- AI conversation
  transcript            TEXT,
  conversation_history  JSONB,
  language              VARCHAR(10) DEFAULT 'en',

  -- Triage results
  urgency               VARCHAR(20),   -- emergency | urgent | routine
  issue_type            VARCHAR(100),
  issue_description     TEXT,
  estimated_cost_min    DECIMAL(10,2),
  estimated_cost_max    DECIMAL(10,2),

  -- Outcome
  outcome               VARCHAR(50),   -- booked | quote_sent | not_interested | no_answer
  lead_score            INT,           -- 0-100
  score_tier            VARCHAR(20),   -- hot | warm | lukewarm | cold

  -- Attribution
  source                VARCHAR(100),  -- google_ads | referral | organic | repeat
  campaign              VARCHAR(100),
  utm_source            VARCHAR(100),
  utm_medium            VARCHAR(100),
  utm_campaign          VARCHAR(100),

  created_at            TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_calls_business   ON calls(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_customer   ON calls(customer_id);
CREATE INDEX IF NOT EXISTS idx_calls_outcome    ON calls(outcome);
CREATE INDEX IF NOT EXISTS idx_calls_score_tier ON calls(score_tier);
CREATE INDEX IF NOT EXISTS idx_calls_source     ON calls(source);

-- ──────────────────────────────────────────────────────────
-- APPOINTMENTS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS appointments (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id                 UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id                 UUID REFERENCES customers(id) ON DELETE SET NULL,
  technician_id               UUID REFERENCES technicians(id) ON DELETE SET NULL,
  call_id                     UUID REFERENCES calls(id) ON DELETE SET NULL,

  -- Scheduling
  scheduled_time              TIMESTAMP NOT NULL,
  duration_minutes            INT DEFAULT 60,

  -- Service details
  service_type                VARCHAR(100),
  issue_description           TEXT,
  urgency                     VARCHAR(20),

  -- Pricing
  estimated_cost_min          DECIMAL(10,2),
  estimated_cost_max          DECIMAL(10,2),
  actual_cost                 DECIMAL(10,2),

  -- Status
  status                      VARCHAR(50) DEFAULT 'scheduled',  -- scheduled | confirmed | in_progress | completed | cancelled | no_show
  confirmation_status         VARCHAR(50),                      -- pending | confirmed | unconfirmed
  confirmation_attempts       INT DEFAULT 0,
  last_confirmation_attempt   TIMESTAMP,

  -- Payment
  payment_status              VARCHAR(50),   -- pending | paid | refunded
  payment_method              VARCHAR(50),   -- cash | card | check | financing
  payment_id                  VARCHAR(255),

  -- Integrations
  jobber_job_id               VARCHAR(255),
  servicetitan_job_id         VARCHAR(255),
  google_calendar_event_id    VARCHAR(255),

  -- Completion
  completion_notes            TEXT,
  completion_photos           TEXT[],
  parts_used                  JSONB,

  created_at                  TIMESTAMP DEFAULT NOW(),
  updated_at                  TIMESTAMP DEFAULT NOW(),
  completed_at                TIMESTAMP,
  cancelled_at                TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_appointments_business    ON appointments(business_id, scheduled_time DESC);
CREATE INDEX IF NOT EXISTS idx_appointments_customer    ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_technician  ON appointments(technician_id, scheduled_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status      ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled   ON appointments(scheduled_time);

-- ──────────────────────────────────────────────────────────
-- MESSAGES (SMS / Email)
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id     UUID REFERENCES customers(id) ON DELETE SET NULL,
  appointment_id  UUID REFERENCES appointments(id) ON DELETE SET NULL,

  direction       VARCHAR(20),   -- outbound | inbound
  channel         VARCHAR(20),   -- sms | email | voice
  message_type    VARCHAR(50),   -- confirmation | reminder | invoice | review_request
  subject         VARCHAR(255),
  message_text    TEXT,

  status          VARCHAR(20),   -- queued | sent | delivered | failed | read
  provider_id     VARCHAR(255),
  error_message   TEXT,

  sent_at         TIMESTAMP DEFAULT NOW(),
  delivered_at    TIMESTAMP,
  read_at         TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_business     ON messages(business_id, sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_customer     ON messages(customer_id);
CREATE INDEX IF NOT EXISTS idx_messages_appointment  ON messages(appointment_id);
CREATE INDEX IF NOT EXISTS idx_messages_type         ON messages(message_type);

-- ──────────────────────────────────────────────────────────
-- REVIEWS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id     UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id     UUID REFERENCES customers(id) ON DELETE SET NULL,
  appointment_id  UUID REFERENCES appointments(id) ON DELETE SET NULL,

  platform        VARCHAR(50),  -- google | yelp | facebook | internal
  rating          INT CHECK (rating >= 1 AND rating <= 5),
  review_text     TEXT,
  review_url      TEXT,

  status          VARCHAR(50) DEFAULT 'pending',  -- pending | submitted | published
  requested_at    TIMESTAMP,
  submitted_at    TIMESTAMP,

  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_business ON reviews(business_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating   ON reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_status   ON reviews(status);

-- ──────────────────────────────────────────────────────────
-- QUOTES
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quotes (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id         UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id         UUID REFERENCES customers(id) ON DELETE SET NULL,
  call_id             UUID REFERENCES calls(id) ON DELETE SET NULL,

  service_type        VARCHAR(100),
  description         TEXT,
  amount              DECIMAL(10,2) NOT NULL,
  valid_until         DATE,

  status              VARCHAR(50) DEFAULT 'sent',  -- sent | viewed | accepted | rejected | expired
  followup_count      INT DEFAULT 0,
  last_followup_at    TIMESTAMP,
  next_followup_at    TIMESTAMP,

  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP DEFAULT NOW(),
  accepted_at         TIMESTAMP,
  rejected_at         TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quotes_business  ON quotes(business_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_customer  ON quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotes_status    ON quotes(status);

-- ──────────────────────────────────────────────────────────
-- MARKETING ATTRIBUTION
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marketing_attribution (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id           UUID REFERENCES businesses(id) ON DELETE CASCADE,
  call_id               UUID REFERENCES calls(id) ON DELETE SET NULL,
  appointment_id        UUID REFERENCES appointments(id) ON DELETE SET NULL,

  source_channel        VARCHAR(100),
  campaign_name         VARCHAR(255),
  ad_group              VARCHAR(255),
  keyword               VARCHAR(255),

  revenue_attributed    DECIMAL(10,2),
  cost                  DECIMAL(10,2),

  created_at            TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_attribution_business ON marketing_attribution(business_id);
CREATE INDEX IF NOT EXISTS idx_attribution_source   ON marketing_attribution(source_channel);

-- ──────────────────────────────────────────────────────────
-- CLERK EVENTS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clerk_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type      VARCHAR(100) NOT NULL,
  clerk_user_id   VARCHAR(255),
  data            JSONB,
  processed       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clerk_events_type      ON clerk_events(event_type);
CREATE INDEX IF NOT EXISTS idx_clerk_events_user      ON clerk_events(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_clerk_events_processed ON clerk_events(processed);

-- ──────────────────────────────────────────────────────────
-- STRIPE EVENTS
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS stripe_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id         VARCHAR(255) UNIQUE NOT NULL,
  event_type       VARCHAR(100) NOT NULL,
  customer_id      VARCHAR(255),
  subscription_id  VARCHAR(255),
  data             JSONB,
  processed        BOOLEAN DEFAULT FALSE,
  created_at       TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stripe_events_type      ON stripe_events(event_type);
CREATE INDEX IF NOT EXISTS idx_stripe_events_customer  ON stripe_events(customer_id);
CREATE INDEX IF NOT EXISTS idx_stripe_events_processed ON stripe_events(processed);

-- ──────────────────────────────────────────────────────────
-- TRIGGER: auto-update updated_at
-- ──────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  CREATE TRIGGER update_businesses_updated_at
    BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_technicians_updated_at
    BEFORE UPDATE ON technicians
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ──────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────────
ALTER TABLE businesses          ENABLE ROW LEVEL SECURITY;
ALTER TABLE technicians         ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers           ENABLE ROW LEVEL SECURITY;
ALTER TABLE calls               ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages            ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews             ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE marketing_attribution ENABLE ROW LEVEL SECURITY;

-- Businesses: owners see their own row
CREATE POLICY "businesses_select_own" ON businesses
  FOR SELECT USING (
    clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  );

CREATE POLICY "businesses_update_own" ON businesses
  FOR UPDATE USING (
    clerk_user_id = current_setting('request.jwt.claims', true)::json->>'sub'
  );

-- For tables linked by business_id, service-role key bypasses RLS (used by API server)
-- Client-side queries go through anon key + JWT and are scoped by Clerk sub claim.
