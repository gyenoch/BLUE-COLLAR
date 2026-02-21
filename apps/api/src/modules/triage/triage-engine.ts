import { Urgency, TriageResult, EMERGENCY_KEYWORDS } from './types';
import {
  PLUMBING_EMERGENCY_TRIGGERS,
  HVAC_EMERGENCY_TRIGGERS,
  ELECTRICAL_EMERGENCY_TRIGGERS,
} from './flows';

type TradeType = 'plumbing' | 'hvac' | 'electrical';

export class TriageEngine {
  /**
   * Quick keyword-based urgency check — runs before Claude.
   * Used to immediately dispatch for life/safety emergencies.
   */
  quickCheckEmergency(text: string, tradeType: TradeType): boolean {
    const lower = text.toLowerCase();
    const triggers =
      tradeType === 'plumbing'
        ? PLUMBING_EMERGENCY_TRIGGERS
        : tradeType === 'hvac'
        ? HVAC_EMERGENCY_TRIGGERS
        : ELECTRICAL_EMERGENCY_TRIGGERS;

    return triggers.some((t) => lower.includes(t));
  }

  /**
   * Classify urgency from a transcript snippet.
   * Used when Claude hasn't had a chance to ask full triage questions.
   */
  classifyUrgency(text: string, tradeType: TradeType): Urgency {
    const lower = text.toLowerCase();
    const emergencyWords = EMERGENCY_KEYWORDS[tradeType] as readonly string[];

    if (emergencyWords.some((w) => lower.includes(w))) return 'emergency';

    const urgentWords = ['not working', "doesn't work", 'broken', 'no hot water', 'toilet overflow'];
    if (urgentWords.some((w) => lower.includes(w))) return 'urgent';

    return 'routine';
  }

  /**
   * Build a price estimate range based on service type.
   */
  getEstimate(
    serviceType: string,
    urgency: Urgency,
    tradeType: TradeType
  ): { min: number; max: number } {
    const emergencyMultiplier = urgency === 'emergency' ? 1.5 : urgency === 'urgent' ? 1.2 : 1.0;

    const base: Record<string, { min: number; max: number }> = {
      // Plumbing
      drain_unclog: { min: 150, max: 350 },
      toilet_repair: { min: 120, max: 400 },
      leak_repair: { min: 150, max: 600 },
      water_heater_repair: { min: 200, max: 800 },
      water_heater_replacement: { min: 1200, max: 3500 },
      sewer_line: { min: 3000, max: 15000 },
      // HVAC
      furnace_repair: { min: 200, max: 800 },
      ac_repair: { min: 150, max: 600 },
      tune_up: { min: 79, max: 149 },
      hvac_install: { min: 3000, max: 8000 },
      // Electrical
      outlet_repair: { min: 80, max: 200 },
      breaker_replacement: { min: 100, max: 300 },
      panel_upgrade: { min: 1500, max: 3000 },
      circuit_add: { min: 300, max: 1000 },
      // Default service call
      service_call: { min: 99, max: 175 },
    };

    const estimate = base[serviceType] ?? base.service_call;
    return {
      min: Math.round(estimate.min * emergencyMultiplier),
      max: Math.round(estimate.max * emergencyMultiplier),
    };
  }

  /**
   * Calculate a lead score 0-100 based on call data.
   */
  calculateLeadScore(params: {
    urgency: Urgency;
    isRepeatCustomer: boolean;
    isHighTicket: boolean;
    bookedImmediately: boolean;
    isAfterHours: boolean;
  }): number {
    let score = 20; // base
    if (params.urgency === 'emergency') score += 30;
    else if (params.urgency === 'urgent') score += 15;
    if (params.isRepeatCustomer) score += 20;
    if (params.isHighTicket) score += 25;
    if (params.bookedImmediately) score += 15;
    if (params.isAfterHours) score -= 5;
    return Math.min(100, Math.max(0, score));
  }
}
