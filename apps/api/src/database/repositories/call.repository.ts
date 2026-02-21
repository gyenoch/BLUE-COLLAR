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
  created_at: Date;
}

export class CallRepository extends BaseRepository {
  async findByCallSid(callSid: string): Promise<CallRecord | null> {
    return this.queryOne<CallRecord>(
      `SELECT * FROM calls WHERE call_sid = $1`,
      [callSid]
    );
  }

  async findById(id: string): Promise<CallRecord | null> {
    return this.queryOne<CallRecord>(
      `SELECT * FROM calls WHERE id = $1`,
      [id]
    );
  }

  async findAllByBusiness(
    businessId: string,
    limit = 50,
    offset = 0
  ): Promise<CallRecord[]> {
    return this.query<CallRecord>(
      `SELECT * FROM calls
       WHERE business_id = $1
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [businessId, limit, offset]
    );
  }

  async create(data: {
    businessId: string;
    customerPhone: string;
    callSid: string;
    direction?: string;
    customerId?: string;
  }): Promise<CallRecord> {
    const row = await this.queryOne<CallRecord>(
      `INSERT INTO calls
         (business_id, customer_id, customer_phone, call_sid, direction)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [
        data.businessId,
        data.customerId ?? null,
        data.customerPhone,
        data.callSid,
        data.direction ?? 'inbound',
      ]
    );
    return row!;
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
    await this.query(
      `UPDATE calls SET
         duration              = COALESCE($2,  duration),
         transcript            = COALESCE($3,  transcript),
         conversation_history  = COALESCE($4,  conversation_history),
         language              = COALESCE($5,  language),
         urgency               = COALESCE($6,  urgency),
         issue_type            = COALESCE($7,  issue_type),
         issue_description     = COALESCE($8,  issue_description),
         estimated_cost_min    = COALESCE($9,  estimated_cost_min),
         estimated_cost_max    = COALESCE($10, estimated_cost_max),
         outcome               = COALESCE($11, outcome),
         lead_score            = COALESCE($12, lead_score),
         score_tier            = COALESCE($13, score_tier),
         customer_id           = COALESCE($14, customer_id),
         recording_url         = COALESCE($15, recording_url)
       WHERE call_sid = $1`,
      [
        callSid,
        data.duration ?? null,
        data.transcript ?? null,
        data.conversationHistory ? JSON.stringify(data.conversationHistory) : null,
        data.language ?? null,
        data.urgency ?? null,
        data.issueType ?? null,
        data.issueDescription ?? null,
        data.estimatedCostMin ?? null,
        data.estimatedCostMax ?? null,
        data.outcome ?? null,
        data.leadScore ?? null,
        data.scoreTier ?? null,
        data.customerId ?? null,
        data.recordingUrl ?? null,
      ]
    );
  }

  async countByBusiness(businessId: string): Promise<number> {
    const row = await this.queryOne<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM calls WHERE business_id = $1`,
      [businessId]
    );
    return parseInt(row?.count ?? '0', 10);
  }

  async todayStats(businessId: string): Promise<{
    total: number;
    booked: number;
    emergency: number;
  }> {
    const row = await this.queryOne<{
      total: string;
      booked: string;
      emergency: string;
    }>(
      `SELECT
         COUNT(*)                                                    AS total,
         COUNT(*) FILTER (WHERE outcome = 'booked')                 AS booked,
         COUNT(*) FILTER (WHERE urgency = 'emergency')              AS emergency
       FROM calls
       WHERE business_id = $1
         AND created_at >= CURRENT_DATE`,
      [businessId]
    );
    return {
      total:     parseInt(row?.total     ?? '0', 10),
      booked:    parseInt(row?.booked    ?? '0', 10),
      emergency: parseInt(row?.emergency ?? '0', 10),
    };
  }
}
