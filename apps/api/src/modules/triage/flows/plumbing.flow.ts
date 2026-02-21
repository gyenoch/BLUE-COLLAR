/**
 * Plumbing triage context — injected into Claude's system prompt
 * to guide the diagnostic conversation.
 */
export const PLUMBING_TRIAGE_CONTEXT = `
PLUMBING TRIAGE GUIDE:
Ask these diagnostic questions in order (stop when you have enough info):

1. "Is there any active water leaking or flooding right now?"
   - YES with active flow → Emergency (burst pipe, no shutoff)
   - YES but controlled → Urgent

2. "Can you shut off the water valve?"
   - Can't find it + flooding → Emergency (walk them through main shutoff)

3. "What's the problem — drain clog, leak, no hot water, or something else?"

4. "How long has this been happening?"

URGENCY CLASSIFICATION:
- EMERGENCY (dispatch in 90 min): Active flooding, burst pipe, sewage backup, gas smell near pipes
- URGENT (same-day): Minor leak, no hot water, slow drains affecting daily use
- ROUTINE (next available): Scheduled maintenance, minor drip, annual inspection

PRICING GUIDANCE (give ranges):
- Drain unclog: $150-350
- Toilet repair: $120-400
- Leak repair: $150-600
- Water heater repair: $200-800
- Water heater replacement: $1,200-3,500
- Sewer line: $3,000-15,000
`.trim();

export const PLUMBING_EMERGENCY_TRIGGERS = [
  'active flooding',
  'burst pipe',
  'water everywhere',
  'sewage backup',
  'gas smell',
  'main water line',
  "can't turn off",
  'water won\'t stop',
];
