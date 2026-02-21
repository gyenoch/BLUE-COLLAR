import { TriageEngine } from './triage-engine';
import { TriageResult, Urgency } from './types';

const engine = new TriageEngine();

export class TriageService {
  async triageIssue(params: {
    tradeType: 'plumbing' | 'hvac' | 'electrical';
    customerStatement: string;
    serviceType?: string;
    urgency?: Urgency;
  }): Promise<TriageResult> {
    const urgency = params.urgency ?? engine.classifyUrgency(params.customerStatement, params.tradeType);
    const isEmergency = engine.quickCheckEmergency(params.customerStatement, params.tradeType);
    const finalUrgency: Urgency = isEmergency ? 'emergency' : urgency;
    const serviceType = params.serviceType ?? 'service_call';
    const estimate = engine.getEstimate(serviceType, finalUrgency, params.tradeType);

    return {
      urgency: finalUrgency,
      priority: finalUrgency === 'emergency' ? 5 : finalUrgency === 'urgent' ? 3 : 1,
      issueType: serviceType,
      issueDescription: params.customerStatement,
      estimatedCostMin: estimate.min,
      estimatedCostMax: estimate.max,
      dispatchImmediately: finalUrgency === 'emergency',
      recommendedAction:
        finalUrgency === 'emergency'
          ? 'Dispatch immediately — notify on-call technician'
          : finalUrgency === 'urgent'
          ? 'Book same-day appointment'
          : 'Book next available appointment',
    };
  }
}
