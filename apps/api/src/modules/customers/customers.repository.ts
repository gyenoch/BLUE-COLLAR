import { supabaseAdmin } from '../../database/supabase.client';
import type { CustomerDetail, CustomerCall, CustomerAppointment } from './types';

/**
 * Extended queries beyond the base CustomerRepository —
 * joins calls and appointments for the detail view.
 */
export class CustomersRepository {
  async findDetail(customerId: string, businessId: string): Promise<CustomerDetail | null> {
    const { data: row } = await supabaseAdmin
      .from('customers')
      .select(
        'id, name, phone, email, address, city, state, zip, latitude, longitude, language, preferred_contact, lifetime_value, total_jobs, last_service_date, tags, internal_notes, stripe_customer_id, jobber_id, created_at'
      )
      .eq('id', customerId)
      .eq('business_id', businessId)
      .maybeSingle();

    if (!row) return null;

    const { data: callRows } = await supabaseAdmin
      .from('calls')
      .select('id, call_sid, urgency, outcome, lead_score, created_at')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(10);

    const { data: apptRows } = await supabaseAdmin
      .from('appointments')
      .select('id, scheduled_time, service_type, status, actual_cost')
      .eq('customer_id', customerId)
      .eq('business_id', businessId)
      .order('scheduled_time', { ascending: false })
      .limit(10);

    const r = row as Record<string, unknown>;

    return {
      id:                  r.id as string,
      name:                r.name as string | null,
      phone:               r.phone as string,
      email:               r.email as string | null,
      address:             r.address as string | null,
      city:                r.city as string | null,
      state:               r.state as string | null,
      zip:                 r.zip as string | null,
      latitude:            r.latitude as number | null,
      longitude:           r.longitude as number | null,
      language:            r.language as string,
      preferredContact:    r.preferred_contact as string,
      lifetimeValue:       parseFloat(r.lifetime_value as string ?? '0'),
      totalJobs:           r.total_jobs as number,
      lastServiceDate:     r.last_service_date ? new Date(r.last_service_date as string) : null,
      tags:                r.tags as string[] | null,
      internalNotes:       r.internal_notes as string | null,
      stripeCustomerId:    r.stripe_customer_id as string | null,
      jobberId:            r.jobber_id as string | null,
      createdAt:           new Date(r.created_at as string),
      recentCalls: (callRows ?? []).map((c: Record<string, unknown>) => ({
        id:        c.id as string,
        callSid:   c.call_sid as string | null,
        urgency:   c.urgency as string | null,
        outcome:   c.outcome as string | null,
        leadScore: c.lead_score as number | null,
        createdAt: new Date(c.created_at as string),
      })) as CustomerCall[],
      upcomingAppointments: (apptRows ?? []).map((a: Record<string, unknown>) => ({
        id:            a.id as string,
        scheduledTime: new Date(a.scheduled_time as string),
        serviceType:   a.service_type as string | null,
        status:        a.status as string,
        actualCost:    a.actual_cost ? parseFloat(a.actual_cost as string) : null,
      })) as CustomerAppointment[],
    };
  }

  async search(businessId: string, query: string, limit = 20): Promise<CustomerDetail[]> {
    const { data: rows } = await supabaseAdmin
      .from('customers')
      .select('id, name, phone, email, city, state, language, lifetime_value, total_jobs, last_service_date, tags, created_at')
      .eq('business_id', businessId)
      .or(`name.ilike.%${query}%,phone.ilike.%${query}%,email.ilike.%${query}%`)
      .order('lifetime_value', { ascending: false })
      .limit(limit);

    return (rows ?? []).map((r: Record<string, unknown>) => ({
      id:                   r.id as string,
      name:                 r.name as string | null,
      phone:                r.phone as string,
      email:                r.email as string | null,
      address:              null,
      city:                 r.city as string | null,
      state:                r.state as string | null,
      zip:                  null,
      latitude:             null,
      longitude:            null,
      language:             r.language as string,
      preferredContact:     'phone',
      lifetimeValue:        parseFloat(r.lifetime_value as string ?? '0'),
      totalJobs:            r.total_jobs as number,
      lastServiceDate:      r.last_service_date ? new Date(r.last_service_date as string) : null,
      tags:                 r.tags as string[] | null,
      internalNotes:        null,
      stripeCustomerId:     null,
      jobberId:             null,
      createdAt:            new Date(r.created_at as string),
      recentCalls:          [],
      upcomingAppointments: [],
    })) as CustomerDetail[];
  }

  async update(
    customerId: string,
    businessId: string,
    data: Partial<{
      name: string;
      email: string;
      address: string;
      city: string;
      state: string;
      zip: string;
      language: string;
      preferred_contact: string;
      internal_notes: string;
      tags: string[];
    }>
  ): Promise<void> {
    const allowed = [
      'name', 'email', 'address', 'city', 'state', 'zip',
      'language', 'preferred_contact', 'internal_notes', 'tags',
    ] as const;

    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };

    for (const key of allowed) {
      if (key in data) {
        updateData[key] = (data as Record<string, unknown>)[key];
      }
    }

    if (Object.keys(updateData).length === 1) return; // only updated_at

    await supabaseAdmin
      .from('customers')
      .update(updateData)
      .eq('id', customerId)
      .eq('business_id', businessId);
  }
}
