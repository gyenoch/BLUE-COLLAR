import { pool } from '../../config/database.config';
import type { CustomerDetail, CustomerCall, CustomerAppointment } from './types';

/**
 * Extended queries beyond the base CustomerRepository —
 * joins calls and appointments for the detail view.
 */
export class CustomersRepository {
  async findDetail(customerId: string, businessId: string): Promise<CustomerDetail | null> {
    const row = await pool.query(
      `SELECT
         c.id, c.name, c.phone, c.email, c.address, c.city, c.state, c.zip,
         c.latitude, c.longitude, c.language, c.preferred_contact,
         c.lifetime_value, c.total_jobs, c.last_service_date,
         c.tags, c.internal_notes, c.stripe_customer_id, c.jobber_id,
         c.created_at
       FROM customers c
       WHERE c.id = $1 AND c.business_id = $2`,
      [customerId, businessId]
    );

    if (!row.rows.length) return null;
    const r = row.rows[0] as Record<string, unknown>;

    const calls = await pool.query(
      `SELECT id, call_sid, urgency, outcome, lead_score, created_at
       FROM calls
       WHERE customer_id = $1
       ORDER BY created_at DESC
       LIMIT 10`,
      [customerId]
    );

    const appointments = await pool.query(
      `SELECT id, scheduled_time, service_type, status, actual_cost
       FROM appointments
       WHERE customer_id = $1 AND business_id = $2
       ORDER BY scheduled_time DESC
       LIMIT 10`,
      [customerId, businessId]
    );

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
      recentCalls:         calls.rows.map((c) => ({
        id:        c.id as string,
        callSid:   c.call_sid as string | null,
        urgency:   c.urgency as string | null,
        outcome:   c.outcome as string | null,
        leadScore: c.lead_score as number | null,
        createdAt: new Date(c.created_at as string),
      })) as CustomerCall[],
      upcomingAppointments: appointments.rows.map((a) => ({
        id:            a.id as string,
        scheduledTime: new Date(a.scheduled_time as string),
        serviceType:   a.service_type as string | null,
        status:        a.status as string,
        actualCost:    a.actual_cost ? parseFloat(a.actual_cost as string) : null,
      })) as CustomerAppointment[],
    };
  }

  async search(businessId: string, query: string, limit = 20): Promise<CustomerDetail[]> {
    const rows = await pool.query(
      `SELECT id, name, phone, email, city, state, language,
              lifetime_value, total_jobs, last_service_date, tags, created_at
       FROM customers
       WHERE business_id = $1
         AND (
           name  ILIKE $2 OR
           phone ILIKE $2 OR
           email ILIKE $2
         )
       ORDER BY lifetime_value DESC
       LIMIT $3`,
      [businessId, `%${query}%`, limit]
    );

    return rows.rows.map((r) => ({
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

    const setClauses: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    for (const key of allowed) {
      if (key in data) {
        setClauses.push(`${key} = $${idx++}`);
        values.push((data as Record<string, unknown>)[key]);
      }
    }

    if (!setClauses.length) return;

    values.push(customerId, businessId);
    await pool.query(
      `UPDATE customers
       SET ${setClauses.join(', ')}, updated_at = NOW()
       WHERE id = $${idx} AND business_id = $${idx + 1}`,
      values
    );
  }
}
