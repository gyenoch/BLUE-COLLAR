import { BaseRepository } from './base.repository';

export interface Appointment {
  id: string;
  business_id: string;
  customer_id: string | null;
  technician_id: string | null;
  call_id: string | null;
  scheduled_time: Date;
  duration_minutes: number;
  service_type: string | null;
  issue_description: string | null;
  urgency: string | null;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  actual_cost: number | null;
  status: string;
  confirmation_status: string | null;
  confirmation_attempts: number;
  payment_status: string | null;
  payment_method: string | null;
  payment_id: string | null;
  jobber_job_id: string | null;
  google_calendar_event_id: string | null;
  completion_notes: string | null;
  completion_photos: string[] | null;
  parts_used: unknown | null;
  created_at: Date;
  updated_at: Date;
  completed_at: Date | null;
  cancelled_at: Date | null;
}

export class AppointmentRepository extends BaseRepository {
  async findById(id: string): Promise<Appointment | null> {
    return this.queryOne<Appointment>(
      `SELECT * FROM appointments WHERE id = $1`,
      [id]
    );
  }

  async findAllByBusiness(
    businessId: string,
    status?: string,
    limit = 50,
    offset = 0
  ): Promise<Appointment[]> {
    if (status) {
      return this.query<Appointment>(
        `SELECT * FROM appointments
         WHERE business_id = $1 AND status = $2
         ORDER BY scheduled_time DESC
         LIMIT $3 OFFSET $4`,
        [businessId, status, limit, offset]
      );
    }
    return this.query<Appointment>(
      `SELECT * FROM appointments
       WHERE business_id = $1
       ORDER BY scheduled_time DESC
       LIMIT $2 OFFSET $3`,
      [businessId, limit, offset]
    );
  }

  async findUpcoming(businessId: string, limit = 10): Promise<Appointment[]> {
    return this.query<Appointment>(
      `SELECT * FROM appointments
       WHERE business_id = $1
         AND scheduled_time > NOW()
         AND status IN ('scheduled', 'confirmed')
       ORDER BY scheduled_time ASC
       LIMIT $2`,
      [businessId, limit]
    );
  }

  async create(data: {
    businessId: string;
    customerId?: string;
    callId?: string;
    scheduledTime: Date;
    serviceType?: string;
    issueDescription?: string;
    urgency?: string;
    estimatedCostMin?: number;
    estimatedCostMax?: number;
    durationMinutes?: number;
  }): Promise<Appointment> {
    const row = await this.queryOne<Appointment>(
      `INSERT INTO appointments
         (business_id, customer_id, call_id, scheduled_time, service_type,
          issue_description, urgency, estimated_cost_min, estimated_cost_max,
          duration_minutes, confirmation_status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending')
       RETURNING *`,
      [
        data.businessId,
        data.customerId ?? null,
        data.callId ?? null,
        data.scheduledTime,
        data.serviceType ?? null,
        data.issueDescription ?? null,
        data.urgency ?? null,
        data.estimatedCostMin ?? null,
        data.estimatedCostMax ?? null,
        data.durationMinutes ?? 60,
      ]
    );
    return row!;
  }

  async updateStatus(id: string, status: string): Promise<void> {
    await this.query(
      `UPDATE appointments
       SET status = $2, updated_at = NOW(),
           completed_at = CASE WHEN $2 = 'completed' THEN NOW() ELSE completed_at END,
           cancelled_at = CASE WHEN $2 = 'cancelled' THEN NOW() ELSE cancelled_at END
       WHERE id = $1`,
      [id, status]
    );
  }

  async complete(
    id: string,
    data: {
      actualCost?: number;
      completionNotes?: string;
      partsUsed?: unknown[];
    }
  ): Promise<void> {
    await this.query(
      `UPDATE appointments
       SET status = 'completed',
           actual_cost = COALESCE($2, actual_cost),
           completion_notes = COALESCE($3, completion_notes),
           parts_used = COALESCE($4, parts_used),
           completed_at = NOW(),
           updated_at = NOW()
       WHERE id = $1`,
      [
        id,
        data.actualCost ?? null,
        data.completionNotes ?? null,
        data.partsUsed ? JSON.stringify(data.partsUsed) : null,
      ]
    );
  }

  async todayCount(businessId: string): Promise<number> {
    const row = await this.queryOne<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM appointments
       WHERE business_id = $1
         AND scheduled_time::date = CURRENT_DATE`,
      [businessId]
    );
    return parseInt(row?.count ?? '0', 10);
  }
}
