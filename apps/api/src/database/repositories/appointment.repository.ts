import { BaseRepository } from './base.repository';

export interface Appointment {
  id: string;
  business_id: string;
  customer_id: string | null;
  technician_id: string | null;
  call_id: string | null;
  scheduled_time: string;
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
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  cancelled_at: string | null;
}

export class AppointmentRepository extends BaseRepository {
  async findById(id: string): Promise<Appointment | null> {
    const { data, error } = await this.db
      .from('appointments')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async findAllByBusiness(
    businessId: string,
    status?: string,
    limit = 50,
    offset = 0
  ): Promise<Appointment[]> {
    let query = this.db
      .from('appointments')
      .select('*')
      .eq('business_id', businessId)
      .order('scheduled_time', { ascending: false })
      .range(offset, offset + limit - 1);

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }

  async findUpcoming(businessId: string, limit = 10): Promise<Appointment[]> {
    const { data, error } = await this.db
      .from('appointments')
      .select('*')
      .eq('business_id', businessId)
      .gt('scheduled_time', new Date().toISOString())
      .in('status', ['scheduled', 'confirmed'])
      .order('scheduled_time', { ascending: true })
      .limit(limit);
    if (error) throw error;
    return data ?? [];
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
    const { data: row, error } = await this.db
      .from('appointments')
      .insert({
        business_id:        data.businessId,
        customer_id:        data.customerId        ?? null,
        call_id:            data.callId            ?? null,
        scheduled_time:     data.scheduledTime.toISOString(),
        service_type:       data.serviceType       ?? null,
        issue_description:  data.issueDescription  ?? null,
        urgency:            data.urgency           ?? null,
        estimated_cost_min: data.estimatedCostMin  ?? null,
        estimated_cost_max: data.estimatedCostMax  ?? null,
        duration_minutes:   data.durationMinutes   ?? 60,
        confirmation_status: 'pending',
      })
      .select()
      .single();
    if (error) throw error;
    return row;
  }

  async updateStatus(id: string, status: string): Promise<void> {
    const now = new Date().toISOString();
    const payload: Record<string, unknown> = { status, updated_at: now };
    if (status === 'completed') payload.completed_at = now;
    if (status === 'cancelled') payload.cancelled_at = now;

    const { error } = await this.db
      .from('appointments')
      .update(payload)
      .eq('id', id);
    if (error) throw error;
  }

  async complete(
    id: string,
    data: {
      actualCost?: number;
      completionNotes?: string;
      partsUsed?: unknown[];
    }
  ): Promise<void> {
    const now = new Date().toISOString();
    const payload: Record<string, unknown> = {
      status: 'completed',
      completed_at: now,
      updated_at: now,
    };
    if (data.actualCost      !== undefined) payload.actual_cost       = data.actualCost;
    if (data.completionNotes !== undefined) payload.completion_notes  = data.completionNotes;
    if (data.partsUsed       !== undefined) payload.parts_used        = data.partsUsed;

    const { error } = await this.db
      .from('appointments')
      .update(payload)
      .eq('id', id);
    if (error) throw error;
  }

  async todayCount(businessId: string): Promise<number> {
    const today    = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split('T')[0];

    const { count, error } = await this.db
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .gte('scheduled_time', today)
      .lt('scheduled_time', tomorrow);
    if (error) throw error;
    return count ?? 0;
  }
}
