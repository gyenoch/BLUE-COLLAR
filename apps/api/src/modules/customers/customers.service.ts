import { CustomerRepository } from '../../database/repositories/customer.repository';
import { CustomersRepository } from './customers.repository';
import { createLogger } from '../../utils/logger';
import { toE164 } from '../../utils/helpers';
import type { CustomerDetail, CustomerUpdateRequest } from './types';

const log = createLogger('customers-service');

const baseRepo     = new CustomerRepository();
const extendedRepo = new CustomersRepository();

export class CustomersService {
  async list(
    businessId: string,
    opts: { limit?: number; offset?: number } = {}
  ) {
    return baseRepo.findAllByBusiness(businessId, opts.limit, opts.offset);
  }

  async getDetail(customerId: string, businessId: string): Promise<CustomerDetail | null> {
    return extendedRepo.findDetail(customerId, businessId);
  }

  async search(businessId: string, query: string): Promise<CustomerDetail[]> {
    return extendedRepo.search(businessId, query.trim());
  }

  async update(
    customerId: string,
    businessId: string,
    data: CustomerUpdateRequest
  ): Promise<void> {
    await extendedRepo.update(customerId, businessId, {
      name:              data.name,
      email:             data.email,
      address:           data.address,
      city:              data.city,
      state:             data.state,
      zip:               data.zip,
      language:          data.language,
      preferred_contact: data.preferredContact,
      internal_notes:    data.internalNotes,
      tags:              data.tags,
    });

    log.info('Customer updated', { customerId });
  }

  /** Find or create a customer by phone number. Used during voice AI calls. */
  async findOrCreate(opts: {
    businessId: string;
    phone: string;
    name?: string;
    language?: string;
  }) {
    const normalized = toE164(opts.phone);
    return baseRepo.upsert({
      businessId: opts.businessId,
      phone:      normalized,
      name:       opts.name,
      language:   opts.language,
    });
  }

  /** Get top customers by lifetime value for dashboard highlights. */
  async getTopCustomers(businessId: string, limit = 5) {
    return baseRepo.findAllByBusiness(businessId, limit, 0);
  }
}
