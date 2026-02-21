/**
 * Seed a development business so the API can start without real Clerk users.
 *
 * Usage:
 *   npx tsx src/database/seeds/dev-business.seed.ts
 */
import { pool } from '../connection';

async function seed(): Promise<void> {
  const existing = await pool.query(
    `SELECT id FROM businesses WHERE clerk_user_id = 'dev_user_001'`
  );
  if (existing.rows.length) {
    console.log('Dev business already exists — skipping');
    await pool.end();
    return;
  }

  const trialEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await pool.query(
    `INSERT INTO businesses
       (clerk_user_id, business_name, trade_type, phone_number, twilio_number,
        owner_name, owner_email, owner_phone, timezone,
        business_hours, pricing, status, trial_ends_at)
     VALUES
       ('dev_user_001', 'Demo Plumbing Co', 'plumbing', '+15551110001', $1,
        'John Demo', 'john@demoplumbing.com', '+15551110001', 'America/Chicago',
        $2::jsonb, $3::jsonb, 'trial', $4)`,
    [
      process.env.TWILIO_PHONE_NUMBER ?? '+15551119999',
      JSON.stringify({
        monday:    { open: '08:00', close: '17:00' },
        tuesday:   { open: '08:00', close: '17:00' },
        wednesday: { open: '08:00', close: '17:00' },
        thursday:  { open: '08:00', close: '17:00' },
        friday:    { open: '08:00', close: '17:00' },
        saturday:  { open: '09:00', close: '13:00' },
        sunday:    null,
      }),
      JSON.stringify({ service_call: 99, emergency_fee: 175 }),
      trialEndsAt,
    ]
  );

  console.log('Dev business seeded successfully');
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
