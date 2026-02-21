import { pool } from '../../config/database.config';
import { clerkClient } from '../../config/clerk.config';
import { createLogger } from '../../utils/logger';

const log = createLogger('auth-service');

export class AuthService {
  /** Fetch the business record for a Clerk user. Returns null if not onboarded yet. */
  async getUserBusiness(clerkUserId: string) {
    const result = await pool.query(
      `SELECT id, business_name, trade_type, twilio_number,
              clerk_user_id AS "ownerId", subscription_status
       FROM businesses
       WHERE clerk_user_id = $1 AND deleted_at IS NULL`,
      [clerkUserId]
    );
    return result.rows[0] ?? null;
  }

  /** Check if a clerk user owns/has access to businessId. */
  async canAccessBusiness(clerkUserId: string, businessId: string): Promise<boolean> {
    const result = await pool.query(
      `SELECT 1 FROM businesses WHERE id = $1 AND clerk_user_id = $2 AND deleted_at IS NULL`,
      [businessId, clerkUserId]
    );
    return result.rowCount !== null && result.rowCount > 0;
  }

  /** Sync Clerk user profile to the businesses table */
  async syncUserData(clerkUserId: string): Promise<void> {
    try {
      const user = await clerkClient.users.getUser(clerkUserId);
      const email = user.emailAddresses[0]?.emailAddress;
      const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();

      await pool.query(
        `UPDATE businesses SET owner_name = $1, owner_email = $2, updated_at = NOW()
         WHERE clerk_user_id = $3`,
        [name || null, email || null, clerkUserId]
      );
    } catch (err) {
      log.warn('Failed to sync user data', { clerkUserId, error: (err as Error).message });
    }
  }

  /** Soft-delete / deactivate a business when its Clerk user is deleted */
  async deactivateBusiness(clerkUserId: string): Promise<void> {
    await pool.query(
      `UPDATE businesses SET status = 'cancelled', deleted_at = NOW() WHERE clerk_user_id = $1`,
      [clerkUserId]
    );
    log.info('Business deactivated', { clerkUserId });
  }
}
