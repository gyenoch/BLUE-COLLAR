# Blue-Collar Agent — Complete Deployment Guide
*Step-by-step setup for every third-party service and full deployment to Railway + Vercel*

---

## Overview

| Service | Purpose | Sign-up URL | Cost |
|---------|---------|-------------|------|
| Supabase | PostgreSQL database | https://supabase.com | Free → $25/mo |
| Upstash | Redis cache | https://console.upstash.com | Free → $10/mo |
| Clerk | Authentication | https://clerk.com | Free ≤10k MAU |
| Twilio | Voice + SMS | https://twilio.com | Pay-as-you-go |
| Anthropic | Claude AI | https://console.anthropic.com | Pay-as-you-go |
| Deepgram | Speech-to-text | https://console.deepgram.com | Free $200 credit |
| ElevenLabs | Text-to-speech | https://elevenlabs.io | Free → $22/mo |
| Stripe | Payments | https://dashboard.stripe.com | 2.9% + $0.30 |
| Resend | Email | https://resend.com | Free → $20/mo |
| Railway | API hosting | https://railway.app | $20/mo |
| Vercel | Dashboard hosting | https://vercel.com | Free |
| Sentry | Error tracking | https://sentry.io | Free |
| ngrok | Local tunneling (dev) | https://ngrok.com | Free |

---

## PHASE 1 — Local Development Setup

### Step 1: Install Prerequisites

```bash
# Node.js 20 LTS
# Download from: https://nodejs.org (choose LTS)
node --version   # should print v20.x.x

# ngrok (for exposing local server to Twilio)
# Download from: https://ngrok.com/download
# Then authenticate:
ngrok config add-authtoken YOUR_NGROK_TOKEN
```

### Step 2: Clone and Install Dependencies

```bash
cd BLUE-COLLAR
npm install
```

### Step 3: Copy Environment Files

```bash
cp apps/api/.env.example apps/api/.env
cp apps/dashboard/.env.example apps/dashboard/.env.local
cp apps/mobile/.env.example apps/mobile/.env
```

Now open `apps/api/.env` and fill in each value as you complete the steps below.

---

## PHASE 2 — Set Up Each Service (Get Your Keys)

### 2.1 Supabase (Database)

1. Go to https://supabase.com → **New Project**
2. Choose a name: `blue-collar-agent`
3. Set a strong database password (save it — you'll need it)
4. Region: **US East (N. Virginia)** — closest to Railway's default
5. Wait ~2 minutes for project to provision

**Get your keys:**
- Go to **Settings → Database → Connection string → URI**
  - Copy the URI, replace `[YOUR-PASSWORD]` with your password
  - Set as `DATABASE_URL` in `apps/api/.env`
- Go to **Settings → API**
  - Copy **Project URL** → `SUPABASE_URL`
  - Copy **anon/public** key → `SUPABASE_ANON_KEY`
  - Copy **service_role** key → `SUPABASE_SERVICE_KEY`

**Run migrations:**
```bash
# Install psql or use Supabase SQL Editor
# Go to: Supabase Dashboard → SQL Editor → New Query
# Paste and run each file in order:

# 1. apps/api/src/database/migrations/001_initial_schema.sql
# 2. apps/api/src/database/migrations/002_add_clerk_integration.sql
# 3. apps/api/src/database/migrations/003_add_lead_scoring.sql
# 4. apps/api/src/database/migrations/004_add_jobber_fields.sql
# 5. apps/api/src/database/migrations/005_add_review_automation.sql
```

**Seed development data:**
```bash
cd apps/api
npm run seed:dev    # Creates a test business for local testing
```

---

### 2.2 Upstash Redis (Cache)

1. Go to https://console.upstash.com → **Create Database**
2. Name: `blue-collar-cache`
3. Type: **Regional**
4. Region: **US-East-1**
5. Click **Create**

**Get your keys:**
- Click on your database → **REST API** tab
- Copy **UPSTASH_REDIS_URL** and **UPSTASH_REDIS_TOKEN**
- Paste into `apps/api/.env`

---

### 2.3 Clerk (Authentication)

1. Go to https://clerk.com → **Create Application**
2. Name: `Blue-Collar Agent`
3. Sign-in options: **Email + Google** (keep it simple)
4. Click **Create Application**

**Get your keys:**
- Go to **Configure → API Keys**
- Copy **Publishable Key** → `CLERK_PUBLISHABLE_KEY` (and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)
- Copy **Secret Key** → `CLERK_SECRET_KEY`

**Set up webhook (for user sync):**
1. Go to **Configure → Webhooks → Add Endpoint**
2. For local dev, you'll get this URL from ngrok (set up in Step 2.6 below)
3. URL: `https://YOUR_NGROK_URL/webhooks/clerk`
4. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
5. Click **Create** → copy **Signing Secret** → `CLERK_WEBHOOK_SECRET`

**Configure redirect URLs:**
- Go to **Configure → Paths** and set:
  - Sign-in URL: `/sign-in`
  - Sign-up URL: `/sign-up`
  - After sign-in: `/dashboard`
  - After sign-up: `/onboarding`

---

### 2.4 Twilio (Voice + SMS)

1. Go to https://twilio.com → **Sign up**
2. Verify your phone number
3. Answer "What do you want to build?" → **Voice** + **SMS**

**Get your credentials:**
- Dashboard → **Account Info** panel (top right)
- Copy **Account SID** → `TWILIO_ACCOUNT_SID`
- Copy **Auth Token** (click to reveal) → `TWILIO_AUTH_TOKEN`

**Buy a phone number:**
1. **Phone Numbers → Manage → Buy a Number**
2. Search for a number in your target area (e.g., Texas: 214, 972, 512)
3. Ensure it has **Voice** and **SMS** capabilities
4. Click **Buy** ($1.15/month)
5. Copy the number in E.164 format: `+12145550000` → `TWILIO_PHONE_NUMBER`

**Configure the webhook (do this after ngrok is running):**
1. **Phone Numbers → Manage → Active Numbers → click your number**
2. Under **Voice & Fax**:
   - **A CALL COMES IN**: Webhook
   - URL: `https://YOUR_NGROK_URL/webhooks/twilio/voice`
   - HTTP Method: **HTTP POST**
3. Click **Save**

---

### 2.5 Anthropic — Claude API

1. Go to https://console.anthropic.com
2. Sign up → verify email
3. Go to **API Keys → Create Key**
4. Name: `blue-collar-production`
5. Copy the key → `ANTHROPIC_API_KEY`

> Add a credit card and load at least $10 to start. Usage is ~$0.003 per call.

---

### 2.6 Deepgram (Speech-to-Text)

1. Go to https://console.deepgram.com → **Sign up**
2. You get **$200 free credit** on sign-up (enough for months of testing)
3. Go to **API Keys → Create a New API Key**
4. Name: `blue-collar-agent`
5. Permissions: **Member**
6. Copy the key → `DEEPGRAM_API_KEY`

---

### 2.7 ElevenLabs (Text-to-Speech)

1. Go to https://elevenlabs.io → **Sign up**
2. Free tier: 10,000 characters/month (enough for testing ~100 calls)
3. Go to **Profile (top right) → API Key** → copy it → `ELEVENLABS_API_KEY`

**Choose a voice:**
- Go to **Voice Library** → filter by **American English**
- Recommended: **Rachel** (clear, professional) — ID: `21m00Tcm4TlvDq8ikWAM`
- For Spanish calls: **Valentina** or similar — find ID in Voice Library URL
- Paste the voice ID → `ELEVENLABS_VOICE_ID`

---

### 2.8 Stripe (Payments)

1. Go to https://dashboard.stripe.com → **Sign up**
2. Complete business verification (use test mode first)

**Get your keys:**
- **Developers → API Keys**
- Copy **Publishable key** → `STRIPE_PUBLISHABLE_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Copy **Secret key** → `STRIPE_SECRET_KEY`

**Create products + prices:**
1. Go to **Products → Add Product**
2. Create 3 products:
   - **Starter Plan** — $299/month recurring
   - **Professional Plan** — $499/month recurring
   - **Team Plan** — $799/month recurring
3. After creating each, click the Price → copy **Price ID** → `STRIPE_PRICE_ID_STARTER` etc.

**Set up webhook:**
1. **Developers → Webhooks → Add Endpoint**
2. For local dev: `https://YOUR_NGROK_URL/webhooks/stripe`
3. Events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
4. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

---

### 2.9 Resend (Email)

1. Go to https://resend.com → **Sign up**
2. **API Keys → Create API Key**
3. Name: `blue-collar-agent`
4. Copy key → `RESEND_API_KEY`
5. **Domains → Add Domain** → verify your domain (for production)
6. For dev: use `onboarding@resend.dev` as FROM (no domain needed)

---

### 2.10 Google Calendar OAuth

1. Go to https://console.cloud.google.com
2. **New Project** → name: `Blue-Collar Agent`
3. **APIs & Services → Enable APIs** → search for and enable:
   - `Google Calendar API`
4. **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Authorized redirect URIs:
   - `http://localhost:3001/integrations/google/callback`
   - `https://YOUR_RAILWAY_URL/integrations/google/callback` (add later)
7. Copy **Client ID** → `GOOGLE_CLIENT_ID`
8. Copy **Client Secret** → `GOOGLE_CLIENT_SECRET`

---

## PHASE 3 — Run Locally

### Start ngrok first (exposes your local server to Twilio)

```bash
# In a separate terminal — keep this running
ngrok http 3001
```

Copy the **Forwarding HTTPS URL** (e.g., `https://abc123.ngrok.io`)

Update your `apps/api/.env`:
```
API_BASE_URL=https://abc123.ngrok.io
WS_BASE_URL=wss://abc123.ngrok.io
TWILIO_WEBHOOK_URL=https://abc123.ngrok.io/webhooks/twilio/voice
```

Also update in Twilio Console: Phone Numbers → your number → Voice webhook URL

### Start Quirrel (job queue — for SMS/voice reminders)

```bash
# In a separate terminal
npx quirrel
# Runs on http://localhost:9181
```

### Start the API

```bash
cd apps/api
npm run dev
```

You should see:
```
API running on port 3001
Redis connection OK
Database connection OK
```

### Start the Dashboard

```bash
cd apps/dashboard
npm run dev
# Runs on http://localhost:3000
```

### Test the voice call

1. Call your Twilio phone number from any phone
2. You should hear: *"Thank you for calling [business], this is Sarah, how can I help you today?"*
3. If it works — your product is live locally

**If the call doesn't connect:**
- Check ngrok is running and the URL matches Twilio's webhook
- Check `apps/api/.env` has all 3 Twilio + AI keys filled
- Check the API terminal for error logs

---

## PHASE 4 — Deploy to Production

### 4.1 Deploy API to Railway

1. Go to https://railway.app → **New Project → Deploy from GitHub**
2. Connect your GitHub account → select your repo
3. Select the **apps/api** directory (or use root config)
4. Railway auto-detects Node.js

**Set environment variables in Railway:**
- Go to your service → **Variables** tab
- Click **Raw Editor** and paste ALL variables from `apps/api/.env`
- Update these values for production:
  ```
  NODE_ENV=production
  API_BASE_URL=https://your-project.railway.app
  WS_BASE_URL=wss://your-project.railway.app
  ```

**Configure the start command:**
Railway should auto-detect, but verify in **Settings → Deploy**:
```
Start Command: npm run start
```

**Get your Railway URL:**
- **Settings → Domains → Generate Domain**
- Copy the URL (e.g., `https://blue-collar-api-production.up.railway.app`)
- Update `API_BASE_URL` and `WS_BASE_URL` in Railway variables

**Update Twilio webhook for production:**
- Twilio Console → Phone Numbers → your number
- Voice webhook: `https://your-project.railway.app/webhooks/twilio/voice`

**Update Clerk webhook for production:**
- Clerk → Webhooks → Edit endpoint
- URL: `https://your-project.railway.app/webhooks/clerk`

**Update Stripe webhook for production:**
- Stripe → Developers → Webhooks → Edit endpoint
- URL: `https://your-project.railway.app/webhooks/stripe`

---

### 4.2 Deploy Dashboard to Vercel

1. Go to https://vercel.com → **New Project → Import from GitHub**
2. Select your repo
3. **Root Directory**: `apps/dashboard`
4. Framework: **Next.js** (auto-detected)
5. Click **Deploy**

**Set environment variables in Vercel:**
- Go to **Settings → Environment Variables**
- Add all variables from `apps/dashboard/.env.example`:
  - `NEXT_PUBLIC_API_URL` = your Railway URL
  - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - `CLERK_SECRET_KEY`
  - `CLERK_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_POSTHOG_KEY` (optional)
  - `NEXT_PUBLIC_SENTRY_DSN` (optional)

**Update Clerk Allowed Origins:**
- Clerk → Configure → Domains → Add your Vercel URL

---

### 4.3 Run Migrations on Production Database

In the Supabase SQL Editor, run each migration file in order (1 through 5) if not already done.

Then seed production with your first business:
```bash
# From your local machine, with production DATABASE_URL
DATABASE_URL=your_production_url npm run seed:dev
```

---

## PHASE 5 — Verify Everything Works in Production

Run through this checklist in order:

```
[ ] Dashboard loads at your Vercel URL
[ ] Sign up creates a Clerk user
[ ] Clerk webhook fires (check Railway logs)
[ ] Onboarding wizard completes
[ ] Google Calendar connects successfully
[ ] Call your Twilio number — AI answers
[ ] AI books an appointment — appears in dashboard
[ ] SMS confirmation sent to your phone
[ ] Stripe checkout works (use test card: 4242 4242 4242 4242)
[ ] Stripe webhook fires on payment (check Railway logs)
```

---

## Quick Reference: Where Each Key Comes From

| Variable | Where to Get It |
|----------|----------------|
| `DATABASE_URL` | Supabase → Settings → Database → URI |
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase → Settings → API → anon key |
| `SUPABASE_SERVICE_KEY` | Supabase → Settings → API → service_role key |
| `UPSTASH_REDIS_URL` | Upstash → Database → REST API tab |
| `UPSTASH_REDIS_TOKEN` | Upstash → Database → REST API tab |
| `CLERK_PUBLISHABLE_KEY` | Clerk → Configure → API Keys |
| `CLERK_SECRET_KEY` | Clerk → Configure → API Keys |
| `CLERK_WEBHOOK_SECRET` | Clerk → Configure → Webhooks → endpoint → Signing Secret |
| `TWILIO_ACCOUNT_SID` | Twilio Console → Account Info |
| `TWILIO_AUTH_TOKEN` | Twilio Console → Account Info |
| `TWILIO_PHONE_NUMBER` | Twilio Console → Phone Numbers → Active Numbers |
| `ANTHROPIC_API_KEY` | console.anthropic.com → API Keys |
| `DEEPGRAM_API_KEY` | console.deepgram.com → API Keys |
| `ELEVENLABS_API_KEY` | elevenlabs.io → Profile → API Key |
| `ELEVENLABS_VOICE_ID` | elevenlabs.io → Voice Library → click voice → ID in URL |
| `GOOGLE_CLIENT_ID` | Google Cloud → APIs → Credentials → OAuth Client |
| `GOOGLE_CLIENT_SECRET` | Google Cloud → APIs → Credentials → OAuth Client |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API Keys |
| `STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe → Developers → Webhooks → endpoint → Signing Secret |
| `STRIPE_PRICE_ID_*` | Stripe → Products → click plan → copy Price ID |
| `RESEND_API_KEY` | resend.com → API Keys |
| `SENTRY_DSN` | sentry.io → Settings → Client Keys (DSN) |

---

## Estimated Time to Complete Setup

| Phase | Time |
|-------|------|
| Create all accounts | 45 min |
| Get all API keys | 30 min |
| Fill .env and run locally | 30 min |
| Test voice call locally | 15 min |
| Deploy to Railway + Vercel | 30 min |
| **Total** | **~2.5 hours** |

---

## Common Issues & Fixes

**"AI not answering the call"**
- Verify ngrok is running and URL matches Twilio webhook
- Check `TWILIO_WEBHOOK_URL` in .env matches exactly
- Check Railway/API logs for errors

**"Database connection failed"**
- Ensure `DATABASE_URL` uses the **pooler** URL from Supabase, not the direct URL
- The pooler URL contains `.pooler.supabase.com:6543`

**"Redis connection failed"**
- Verify `UPSTASH_REDIS_URL` starts with `https://` not `redis://`
- Upstash REST API uses HTTPS, not standard Redis protocol

**"ElevenLabs audio sounds broken"**
- Ensure `output_format: 'ulaw_8000'` is set (Twilio requires μ-law 8kHz)
- This is already configured in `elevenlabs.client.ts`

**"Clerk webhook not firing"**
- Ensure the webhook endpoint in Clerk matches your live URL exactly
- Check that `CLERK_WEBHOOK_SECRET` matches the signing secret in Clerk dashboard

**"Voice response too slow (>4 seconds)"**
- Switch Deepgram model to `nova-2` (lowest latency)
- Switch Claude model to `claude-haiku-4-5-20251001` for faster responses
- Ensure Railway is deployed in `us-east-1` region
