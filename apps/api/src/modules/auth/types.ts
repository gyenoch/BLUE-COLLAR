import { Request } from 'express';

export interface AuthedRequest extends Request {
  auth: {
    userId: string;
    sessionId?: string;
  };
  business?: {
    id: string;
    businessName: string;
    tradeType: string;
    twilioNumber: string | null;
    ownerId: string;
    subscriptionStatus: string;
  };
  userRole?: 'owner' | 'manager' | 'technician' | 'view_only';
}

export type Role = 'owner' | 'manager' | 'technician' | 'view_only';

export const ROLE_HIERARCHY: Record<Role, number> = {
  owner: 4,
  manager: 3,
  technician: 2,
  view_only: 1,
};
