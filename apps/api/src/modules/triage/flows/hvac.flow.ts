/**
 * HVAC triage context — injected into Claude's system prompt.
 */
export const HVAC_TRIAGE_CONTEXT = `
HVAC TRIAGE GUIDE:
Ask these diagnostic questions in order:

1. "Is your heating or cooling not working, or is there a different issue?"

2. For NO HEAT:
   "What's the temperature inside your home right now?"
   - Below 55°F (esp. elderly/children/pets) → Emergency
   "Is the furnace making any noise or completely silent?"
   - Silent → Likely ignition/gas issue → Priority dispatch

3. For NO COOLING:
   "What's the outdoor temperature today?"
   - Above 95°F + elderly/medical conditions → Emergency
   "Is the unit running but blowing warm air, or not turning on at all?"

4. "Do you notice any unusual smells — burning, gas, or musty?"
   - Burning/gas → Emergency (possible CO leak)

URGENCY CLASSIFICATION:
- EMERGENCY: No heat below 40°F outdoor, CO alarm, burning smell, gas smell, no cooling above 100°F with medical condition
- URGENT: No heat (mild weather), no cooling (moderate heat), unusual noises, refrigerant leak
- ROUTINE: Annual tune-up, filter change, thermostat issues, minor noises

PRICING GUIDANCE (give ranges):
- Furnace repair: $200-800
- AC repair: $150-600
- Refrigerant recharge: $200-500
- New furnace install: $3,000-7,000
- New AC install: $3,500-8,000
- Tune-up: $79-149
`.trim();

export const HVAC_EMERGENCY_TRIGGERS = [
  'no heat',
  'freezing',
  'carbon monoxide',
  'co alarm',
  'burning smell',
  'gas smell',
  'no cooling',
  'overheating',
  '100 degrees',
  'smoke',
];
