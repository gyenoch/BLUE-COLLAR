/**
 * Seed a development business so the API can start without real Clerk users.
 *
 * Usage:
 *   npx tsx src/database/seeds/dev-business.seed.ts
 */
import { supabaseAdmin } from '../supabase.client';

async function seed(): Promise<void> {
  const { data: existing } = await supabaseAdmin
    .from('businesses')
    .select('id')
    .eq('clerk_user_id', 'dev_user_001')
    .maybeSingle();

  if (existing) {
    console.log('Dev business already exists — skipping');
    return;
  }

  const trialEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const { error } = await supabaseAdmin.from('businesses').insert({
    clerk_user_id:  'dev_user_001',
    business_name:  'Demo Plumbing Co',
    trade_type:     'plumbing',
    phone_number:   '+15551110001',
    twilio_number:  process.env.TWILIO_PHONE_NUMBER ?? '+15551119999',
    owner_name:     'John Demo',
    owner_email:    'john@demoplumbing.com',
    owner_phone:    '+15551110001',
    timezone:       'America/Chicago',
    business_hours: {
      monday:    { open: '08:00', close: '17:00' },
      tuesday:   { open: '08:00', close: '17:00' },
      wednesday: { open: '08:00', close: '17:00' },
      thursday:  { open: '08:00', close: '17:00' },
      friday:    { open: '08:00', close: '17:00' },
      saturday:  { open: '09:00', close: '13:00' },
      sunday:    null,
    },
    pricing:        { service_call: 99, emergency_fee: 175 },
    status:         'trial',
    trial_ends_at:  trialEndsAt,
  });

  if (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }

  console.log('Dev business seeded successfully');
}

seed().catch((err: unknown) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
