/**
 * Electrical triage context — injected into Claude's system prompt.
 */
export const ELECTRICAL_TRIAGE_CONTEXT = `
ELECTRICAL TRIAGE GUIDE:
Ask these diagnostic questions in order:

1. "Is this a total power outage, or are specific circuits or outlets not working?"
   - Total outage → Check with utility company first; likely not our issue

2. "Are you seeing any sparks, smoke, or burning smell?"
   - YES → Emergency — tell them to turn off circuit breaker and call 911 if there's fire

3. "Is this affecting critical equipment — refrigerator, medical devices, HVAC?"
   - YES → Urgent same-day

4. "Are any outlets hot to the touch, or are breakers tripping repeatedly?"
   - Hot outlets/repeated trips → Urgent (fire hazard potential)

URGENCY CLASSIFICATION:
- EMERGENCY: Sparks, smoke, burning smell, electrical fire, live wires exposed, electrocution risk
- URGENT: Repeated breaker trips, hot outlets, partial power loss affecting critical systems, panel issues
- ROUTINE: Single outlet not working, adding new outlet, panel upgrade, ceiling fan install, EV charger

SAFETY FIRST:
- If customer reports sparks or smoke: "Please turn off your main breaker immediately and stay away from that area."
- If there's fire: "Please call 911 right now."

PRICING GUIDANCE (give ranges):
- Outlet/switch replacement: $80-200
- Breaker replacement: $100-300
- Panel upgrade (100A→200A): $1,500-3,000
- New circuit installation: $300-1,000
- EV charger install: $500-2,000
- Whole-home rewire: $8,000-20,000
`.trim();

export const ELECTRICAL_EMERGENCY_TRIGGERS = [
  'sparks',
  'smoke',
  'burning',
  'fire',
  'shock',
  'electrocuted',
  'live wire',
  'sparking outlet',
  'burning smell',
];
