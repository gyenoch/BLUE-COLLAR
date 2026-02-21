import { BaseRepository } from './base.repository';

export interface Customer {
  id: string;
  business_id: string;
  name: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  latitude: number | null;
  longitude: number | null;
  language: string;
  preferred_contact: string;
  lifetime_value: number;
  total_jobs: number;
  last_service_date: Date | null;
  stripe_customer_id: string | null;
  jobber_id: string | null;
  tags: string[] | null;
  internal_notes: string | null;
  created_at: Date;
  updated_at: Date;
}

export class CustomerRepository extends BaseRepository {
  async findById(id: string): Promise<Customer | null> {
    return this.queryOne<Customer>(
      `SELECT * FROM customers WHERE id = $1`,
      [id]
    );
  }

  async findByPhone(businessId: string, phone: string): Promise<Customer | null> {
    return this.queryOne<Customer>(
      `SELECT * FROM customers WHERE business_id = $1 AND phone = $2`,
      [businessId, phone]
    );
  }

  async findAllByBusiness(
    businessId: string,
    limit = 50,
    offset = 0
  ): Promise<Customer[]> {
    return this.query<Customer>(
      `SELECT * FROM customers
       WHERE business_id = $1
       ORDER BY lifetime_value DESC, created_at DESC
       LIMIT $2 OFFSET $3`,
      [businessId, limit, offset]
    );
  }

  async upsert(data: {
    businessId: string;
    phone: string;
    name?: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    language?: string;
  }): Promise<Customer> {
    const row = await this.queryOne<Customer>(
      `INSERT INTO customers
         (business_id, phone, name, email, address, city, state, zip, language)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       ON CONFLICT (business_id, phone) DO UPDATE SET
         name     = COALESCE(EXCLUDED.name,     customers.name),
         email    = COALESCE(EXCLUDED.email,    customers.email),
         address  = COALESCE(EXCLUDED.address,  customers.address),
         city     = COALESCE(EXCLUDED.city,     customers.city),
         state    = COALESCE(EXCLUDED.state,    customers.state),
         zip      = COALESCE(EXCLUDED.zip,      customers.zip),
         language = COALESCE(EXCLUDED.language, customers.language),
         updated_at = NOW()
       RETURNING *`,
      [
        data.businessId,
        data.phone,
        data.name ?? null,
        data.email ?? null,
        data.address ?? null,
        data.city ?? null,
        data.state ?? null,
        data.zip ?? null,
        data.language ?? 'en',
      ]
    );
    return row!;
  }

  async incrementJobCount(id: string, jobRevenue: number): Promise<void> {
    await this.query(
      `UPDATE customers
       SET total_jobs = total_jobs + 1,
           lifetime_value = lifetime_value + $2,
           last_service_date = NOW(),
           updated_at = NOW()
       WHERE id = $1`,
      [id, jobRevenue]
    );
  }

  async updateLanguage(id: string, language: string): Promise<void> {
    await this.query(
      `UPDATE customers SET language = $2, updated_at = NOW() WHERE id = $1`,
      [id, language]
    );
  }
}
