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
  created_at: string;
  updated_at: string;
  trial_ends_at: string | null;
  deleted_at: string | null;
}

const UPDATABLE_FIELDS: (keyof Business)[] = [
  'business_name', 'trade_type', 'phone_number', 'twilio_number',
  'owner_name', 'owner_email', 'owner_phone', 'timezone',
  'business_hours', 'pricing', 'status',
  'stripe_customer_id', 'stripe_subscription_id',
  'subscription_status', 'subscription_plan', 'mrr',
  'onboarding_completed', 'onboarding_step',
];

export class BusinessRepository extends BaseRepository {
  async findById(id: string): Promise<Business | null> {
    const { data, error } = await this.db
      .from('businesses')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async findByClerkUserId(clerkUserId: string): Promise<Business | null> {
    const { data, error } = await this.db
      .from('businesses')
      .select('*')
      .eq('clerk_user_id', clerkUserId)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async findByTwilioNumber(twilioNumber: string): Promise<Business | null> {
    const { data, error } = await this.db
      .from('businesses')
      .select('*')
      .eq('twilio_number', twilioNumber)
      .is('deleted_at', null)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async findFirst(): Promise<Business | null> {
    const { data, error } = await this.db
      .from('businesses')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error) throw error;
    return data;
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
    const { data: row, error } = await this.db
      .from('businesses')
      .insert({
        clerk_user_id:  data.clerkUserId,
        business_name:  data.businessName,
        trade_type:     data.tradeType,
        phone_number:   data.phoneNumber,
        owner_name:     data.ownerName  ?? null,
        owner_email:    data.ownerEmail ?? null,
        owner_phone:    data.ownerPhone ?? null,
        timezone:       data.timezone   ?? 'America/New_York',
        trial_ends_at:  data.trialEndsAt?.toISOString() ?? null,
      })
      .select()
      .single();
    if (error) throw error;
    return row;
  }

  async update(id: string, data: Partial<Business>): Promise<Business | null> {
    const payload = Object.fromEntries(
      Object.entries(data).filter(([k]) => UPDATABLE_FIELDS.includes(k as keyof Business))
    );
    if (!Object.keys(payload).length) return this.findById(id);

    const { data: row, error } = await this.db
      .from('businesses')
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .maybeSingle();
    if (error) throw error;
    return row;
  }

  async softDelete(id: string): Promise<void> {
    const { error } = await this.db
      .from('businesses')
      .update({ deleted_at: new Date().toISOString(), status: 'cancelled' })
      .eq('id', id);
    if (error) throw error;
  }

  async deactivateByClerkUserId(clerkUserId: string): Promise<void> {
    const { error } = await this.db
      .from('businesses')
      .update({
        deleted_at: new Date().toISOString(),
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_user_id', clerkUserId);
    if (error) throw error;
  }
}
