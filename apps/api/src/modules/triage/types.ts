export type Urgency = 'emergency' | 'urgent' | 'routine';

export interface TriageResult {
  urgency: Urgency;
  priority: 1 | 2 | 3 | 4 | 5;  // 5 = most urgent
  issueType: string;
  issueDescription: string;
  estimatedCostMin: number;
  estimatedCostMax: number;
  dispatchImmediately: boolean;
  recommendedAction: string;
}

export interface TriageContext {
  tradeType: 'plumbing' | 'hvac' | 'electrical';
  customerStatement: string;
  conversationSoFar: string;
}

// Emergency keywords per trade (for quick classification without Claude)
export const EMERGENCY_KEYWORDS = {
  plumbing: ['flooding', 'burst pipe', 'burst', 'sewage', 'overflow', 'water everywhere', 'gushing', 'no water', 'gas smell', 'sewer backup'],
  hvac: ['no heat', 'freezing', 'carbon monoxide', 'co alarm', 'fire', 'smoke', 'burning smell', 'gas smell', 'no cooling', '100 degrees'],
  electrical: ['sparks', 'smoke', 'burning', 'fire', 'shock', 'electrocuted', 'power out', 'outlet sparking', 'burning smell', 'buzzing'],
} as const;
