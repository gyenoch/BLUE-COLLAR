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
  last_service_date: string | null;
  stripe_customer_id: string | null;
  jobber_id: string | null;
  tags: string[] | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}

export class CustomerRepository extends BaseRepository {
  async findById(id: string): Promise<Customer | null> {
    const { data, error } = await this.db
      .from('customers')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async findByPhone(businessId: string, phone: string): Promise<Customer | null> {
    const { data, error } = await this.db
      .from('customers')
      .select('*')
      .eq('business_id', businessId)
      .eq('phone', phone)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async findAllByBusiness(
    businessId: string,
    limit = 50,
    offset = 0
  ): Promise<Customer[]> {
    const { data, error } = await this.db
      .from('customers')
      .select('*')
      .eq('business_id', businessId)
      .order('lifetime_value', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return data ?? [];
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
    const { data: row, error } = await this.db
      .from('customers')
      .upsert(
        {
          business_id: data.businessId,
          phone:       data.phone,
          name:        data.name     ?? null,
          email:       data.email    ?? null,
          address:     data.address  ?? null,
          city:        data.city     ?? null,
          state:       data.state    ?? null,
          zip:         data.zip      ?? null,
          language:    data.language ?? 'en',
          updated_at:  new Date().toISOString(),
        },
        { onConflict: 'business_id,phone', ignoreDuplicates: false }
      )
      .select()
      .single();
    if (error) throw error;
    return row;
  }

  async incrementJobCount(id: string, jobRevenue: number): Promise<void> {
    const current = await this.findById(id);
    if (!current) return;

    const { error } = await this.db
      .from('customers')
      .update({
        total_jobs:        current.total_jobs + 1,
        lifetime_value:    current.lifetime_value + jobRevenue,
        last_service_date: new Date().toISOString(),
        updated_at:        new Date().toISOString(),
      })
      .eq('id', id);
    if (error) throw error;
  }

  async updateLanguage(id: string, language: string): Promise<void> {
    const { error } = await this.db
      .from('customers')
      .update({ language, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) throw error;
  }
}
