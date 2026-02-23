import { supabaseAdmin } from '../../database/supabase.client';
import { clerkClient } from '../../config/clerk.config';
import { createLogger } from '../../utils/logger';

const log = createLogger('auth-service');

export class AuthService {
  /** Fetch the business record for a Clerk user. Returns null if not onboarded yet. */
  async getUserBusiness(clerkUserId: string) {
    const { data } = await supabaseAdmin
      .from('businesses')
      .select('id, business_name, trade_type, twilio_number, clerk_user_id, subscription_status')
      .eq('clerk_user_id', clerkUserId)
      .is('deleted_at', null)
      .maybeSingle();
    if (!data) return null;
    return {
      id:                 data.id as string,
      businessName:       data.business_name as string,
      tradeType:          data.trade_type as string,
      twilioNumber:       (data.twilio_number as string) ?? null,
      ownerId:            data.clerk_user_id as string,
      subscriptionStatus: (data.subscription_status as string) ?? 'trialing',
    };
  }

  /** Check if a clerk user owns/has access to businessId. */
  async canAccessBusiness(clerkUserId: string, businessId: string): Promise<boolean> {
    const { data } = await supabaseAdmin
      .from('businesses')
      .select('id')
      .eq('id', businessId)
      .eq('clerk_user_id', clerkUserId)
      .is('deleted_at', null)
      .maybeSingle();
    return data !== null;
  }

  /** Sync Clerk user profile to the businesses table */
  async syncUserData(clerkUserId: string): Promise<void> {
    try {
      const user = await clerkClient.users.getUser(clerkUserId);
      const email = user.emailAddresses[0]?.emailAddress;
      const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

      await supabaseAdmin
        .from('businesses')
        .update({
          owner_name: name || null,
          owner_email: email || null,
          updated_at: new Date().toISOString(),
        })
        .eq('clerk_user_id', clerkUserId);
    } catch (err) {
      log.warn('Failed to sync user data', { clerkUserId, error: (err as Error).message });
    }
  }

  /** Soft-delete / deactivate a business when its Clerk user is deleted */
  async deactivateBusiness(clerkUserId: string): Promise<void> {
    await supabaseAdmin
      .from('businesses')
      .update({ status: 'cancelled', deleted_at: new Date().toISOString() })
      .eq('clerk_user_id', clerkUserId);
    log.info('Business deactivated', { clerkUserId });
  }
}
