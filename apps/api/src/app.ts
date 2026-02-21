import express from 'express';
import { corsMiddleware } from './middleware/cors.middleware';
import { requestLogger } from './middleware/logger.middleware';
import { errorHandler, notFoundHandler } from './middleware/error-handler.middleware';
import { apiLimiter } from './middleware/rate-limiter.middleware';

// Route modules
import authRoutes     from './modules/auth/auth.controller';
import voiceRoutes    from './modules/voice/voice.routes';
import webhookRoutes  from './modules/webhooks/webhook.routes';
import bookingRoutes  from './modules/booking/booking.routes';
import customerRoutes from './modules/customers/customers.routes';

const app = express();

// ─── Trust proxy (Railway / Vercel sit behind a reverse proxy) ────────────────
app.set('trust proxy', 1);

// ─── Pre-parse middleware ──────────────────────────────────────────────────────
// NOTE: Stripe webhook needs raw body — its route applies express.raw() before
// this global JSON parser runs (routes are matched first-match).
app.use(corsMiddleware);
app.use(requestLogger);

// ─── Body parsers ─────────────────────────────────────────────────────────────
// Webhook routes are mounted BEFORE the JSON parser so Stripe can use raw body.
app.use('/webhooks', webhookRoutes);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ─── Global rate limit ────────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ─── Health check (no auth, no rate limit) ────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '0.0.1',
  });
});

// ─── API routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/voice',     voiceRoutes);
app.use('/api/bookings',  bookingRoutes);
app.use('/api/customers', customerRoutes);

// ─── 404 + error handlers (must be last) ─────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
