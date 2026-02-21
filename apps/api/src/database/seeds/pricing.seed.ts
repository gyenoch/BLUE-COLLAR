/**
 * Default pricing tiers by trade type.
 * Referenced by the pricing engine and AI triage prompts.
 */
export const DEFAULT_PRICING: Record<
  'plumbing' | 'hvac' | 'electrical',
  {
    service_call: number;
    emergency_fee: number;
    hourly_rate: number;
    common_jobs: { name: string; min: number; max: number }[];
  }
> = {
  plumbing: {
    service_call: 99,
    emergency_fee: 175,
    hourly_rate: 125,
    common_jobs: [
      { name: 'Drain cleaning',            min: 150,  max: 350  },
      { name: 'Leak repair',               min: 200,  max: 600  },
      { name: 'Water heater replacement',  min: 900,  max: 1800 },
      { name: 'Toilet repair/replace',     min: 150,  max: 500  },
      { name: 'Burst pipe repair',         min: 400,  max: 1500 },
    ],
  },
  hvac: {
    service_call: 89,
    emergency_fee: 199,
    hourly_rate: 135,
    common_jobs: [
      { name: 'AC tune-up',                min: 99,   max: 200  },
      { name: 'AC repair',                 min: 200,  max: 1500 },
      { name: 'AC replacement',            min: 3500, max: 8000 },
      { name: 'Furnace repair',            min: 200,  max: 1200 },
      { name: 'Furnace replacement',       min: 2500, max: 6000 },
      { name: 'Refrigerant recharge',      min: 150,  max: 500  },
    ],
  },
  electrical: {
    service_call: 109,
    emergency_fee: 199,
    hourly_rate: 150,
    common_jobs: [
      { name: 'Panel upgrade',             min: 1500, max: 4000 },
      { name: 'Outlet/switch install',     min: 100,  max: 300  },
      { name: 'Ceiling fan install',       min: 150,  max: 400  },
      { name: 'EV charger install',        min: 800,  max: 2000 },
      { name: 'Whole-home generator',      min: 3000, max: 8000 },
      { name: 'Circuit breaker replace',   min: 150,  max: 400  },
    ],
  },
};
