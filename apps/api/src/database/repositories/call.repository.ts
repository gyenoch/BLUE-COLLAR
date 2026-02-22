import { BaseRepository } from './base.repository';

export interface CallRecord {
  id: string;
  business_id: string;
  customer_id: string | null;
  customer_phone: string;
  call_sid: string | null;
  direction: string;
  duration: number | null;
  recording_url: string | null;
  transcript: string | null;
  conversation_history: unknown | null;
  language: string;
  urgency: string | null;
  issue_type: string | null;
  issue_description: string | null;
  estimated_cost_min: number | null;
  estimated_cost_max: number | null;
  outcome: string | null;
  lead_score: number | null;
  score_tier: string | null;
  source: string | null;
  campaign: string | null;
  created_at: string;
}

export class CallRepository extends BaseRepository {
  async findByCallSid(callSid: string): Promise<CallRecord | null> {
    const { data, error } = await this.db
      .from('calls')
      .select('*')
      .eq('call_sid', callSid)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async findById(id: string): Promise<CallRecord | null> {
    const { data, error } = await this.db
      .from('calls')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async findAllByBusiness(
    businessId: string,
    limit = 50,
    offset = 0
  ): Promise<CallRecord[]> {
    const { data, error } = await this.db
      .from('calls')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return data ?? [];
  }

  async create(data: {
    businessId: string;
    customerPhone: string;
    callSid: string;
    direction?: string;
    customerId?: string;
  }): Promise<CallRecord> {
    const { data: row, error } = await this.db
      .from('calls')
      .insert({
        business_id:   data.businessId,
        customer_id:   data.customerId   ?? null,
        customer_phone: data.customerPhone,
        call_sid:      data.callSid,
        direction:     data.direction    ?? 'inbound',
      })
      .select()
      .single();
    if (error) throw error;
    return row;
  }

  async finalize(
    callSid: string,
    data: {
      duration?: number;
      transcript?: string;
      conversationHistory?: unknown;
      language?: string;
      urgency?: string;
      issueType?: string;
      issueDescription?: string;
      estimatedCostMin?: number;
      estimatedCostMax?: number;
      outcome?: string;
      leadScore?: number;
      scoreTier?: string;
      customerId?: string;
      recordingUrl?: string;
    }
  ): Promise<void> {
    const payload: Record<string, unknown> = {};
    if (data.duration            !== undefined) payload.duration             = data.duration;
    if (data.transcript          !== undefined) payload.transcript           = data.transcript;
    if (data.conversationHistory !== undefined) payload.conversation_history = data.conversationHistory;
    if (data.language            !== undefined) payload.language             = data.language;
    if (data.urgency             !== undefined) payload.urgency              = data.urgency;
    if (data.issueType           !== undefined) payload.issue_type           = data.issueType;
    if (data.issueDescription    !== undefined) payload.issue_description    = data.issueDescription;
    if (data.estimatedCostMin    !== undefined) payload.estimated_cost_min   = data.estimatedCostMin;
    if (data.estimatedCostMax    !== undefined) payload.estimated_cost_max   = data.estimatedCostMax;
    if (data.outcome             !== undefined) payload.outcome              = data.outcome;
    if (data.leadScore           !== undefined) payload.lead_score           = data.leadScore;
    if (data.scoreTier           !== undefined) payload.score_tier           = data.scoreTier;
    if (data.customerId          !== undefined) payload.customer_id          = data.customerId;
    if (data.recordingUrl        !== undefined) payload.recording_url        = data.recordingUrl;

    const { error } = await this.db
      .from('calls')
      .update(payload)
      .eq('call_sid', callSid);
    if (error) throw error;
  }

  async countByBusiness(businessId: string): Promise<number> {
    const { count, error } = await this.db
      .from('calls')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', businessId);
    if (error) throw error;
    return count ?? 0;
  }

  async todayStats(businessId: string): Promise<{
    total: number;
    booked: number;
    emergency: number;
  }> {
    const today = new Date().toISOString().split('T')[0];

    const [totalRes, bookedRes, emergencyRes] = await Promise.all([
      this.db
        .from('calls')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .gte('created_at', today),
      this.db
        .from('calls')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .eq('outcome', 'booked')
        .gte('created_at', today),
      this.db
        .from('calls')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', businessId)
        .eq('urgency', 'emergency')
        .gte('created_at', today),
    ]);

    return {
      total:     totalRes.count     ?? 0,
      booked:    bookedRes.count    ?? 0,
      emergency: emergencyRes.count ?? 0,
    };
  }
}
