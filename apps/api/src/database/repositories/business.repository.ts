import { BaseRepository } from './base.repository';

export interface Business {
  id: string;
  clerk_user_id: string;
  business_name: string;
  trade_type: 'plumbing' | 'hvac' | 'electrical';
  phone_number: string;
  twilio_number: string | null;
  owner_name: string | null;
  owner_email: string | null;
  owner_phone: string | null;
  timezone: string;
  business_hours: Record<string, { open: string; close: string }> | null;
  pricing: { service_call?: number; emergency_fee?: number } | null;
  status: 'trial' | 'active' | 'paused' | 'cancelled';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  subscription_plan: string | null;
  mrr: number | null;
  onboarding_completed: boolean;
  onboarding_step: number;
  created_at: Date;
  updated_at: Date;
  trial_ends_at: Date | null;
  deleted_at: Date | null;
}

export class BusinessRepository extends BaseRepository {
  async findById(id: string): Promise<Business | null> {
    return this.queryOne<Business>(
      `SELECT * FROM businesses WHERE id = $1 AND deleted_at IS NULL`,
      [id]
    );
  }

  async findByClerkUserId(clerkUserId: string): Promise<Business | null> {
    return this.queryOne<Business>(
      `SELECT * FROM businesses WHERE clerk_user_id = $1 AND deleted_at IS NULL`,
      [clerkUserId]
    );
  }

  async findByTwilioNumber(twilioNumber: string): Promise<Business | null> {
    return this.queryOne<Business>(
      `SELECT * FROM businesses WHERE twilio_number = $1 AND deleted_at IS NULL`,
      [twilioNumber]
    );
  }

  async findFirst(): Promise<Business | null> {
    return this.queryOne<Business>(
      `SELECT * FROM businesses WHERE deleted_at IS NULL ORDER BY created_at LIMIT 1`
    );
  }

  async create(data: {
    clerkUserId: string;
    businessName: string;
    tradeType: string;
    phoneNumber: string;
    ownerName?: string;
    ownerEmail?: string;
    ownerPhone?: string;
    timezone?: string;
    trialEndsAt?: Date;
  }): Promise<Business> {
    const row = await this.queryOne<Business>(
      `INSERT INTO businesses
         (clerk_user_id, business_name, trade_type, phone_number,
          owner_name, owner_email, owner_phone, timezone, trial_ends_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [
        data.clerkUserId,
        data.businessName,
        data.tradeType,
        data.phoneNumber,
        data.ownerName ?? null,
        data.ownerEmail ?? null,
        data.ownerPhone ?? null,
        data.timezone ?? 'America/New_York',
        data.trialEndsAt ?? null,
      ]
    );
    return row!;
  }

  async update(id: string, data: Partial<Business>): Promise<Business | null> {
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    const allowed: (keyof Business)[] = [
      'business_name', 'trade_type', 'phone_number', 'twilio_number',
      'owner_name', 'owner_email', 'owner_phone', 'timezone',
      'business_hours', 'pricing', 'status',
      'stripe_customer_id', 'stripe_subscription_id',
      'subscription_status', 'subscription_plan', 'mrr',
      'onboarding_completed', 'onboarding_step',
      'jobber_api_key', 'google_calendar_refresh_token',
    ] as (keyof Business)[];

    for (const key of allowed) {
      if (key in data) {
        setClauses.push(`${key} = $${idx++}`);
        values.push((data as Record<string, unknown>)[key]);
      }
    }

    if (!setClauses.length) return this.findById(id);

    values.push(id);
    return this.queryOne<Business>(
      `UPDATE businesses SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $${idx} AND deleted_at IS NULL
       RETURNING *`,
      values
    );
  }

  async softDelete(id: string): Promise<void> {
    await this.query(
      `UPDATE businesses SET deleted_at = NOW(), status = 'cancelled'
       WHERE id = $1`,
      [id]
    );
  }

  async deactivateByClerkUserId(clerkUserId: string): Promise<void> {
    await this.query(
      `UPDATE businesses
       SET deleted_at = NOW(), status = 'cancelled', updated_at = NOW()
       WHERE clerk_user_id = $1`,
      [clerkUserId]
    );
  }
}
