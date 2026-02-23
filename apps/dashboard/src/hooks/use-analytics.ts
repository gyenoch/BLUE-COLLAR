'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { createApiClient } from '@/lib/api-client'

export interface DayMetric {
  date: string
  value: number
}

export interface Analytics {
  callsToday: number
  callsThisWeek: number
  callsThisMonth: number
  bookingsThisWeek: number
  bookingsThisMonth: number
  revenueThisMonth: number
  missedCallsToday: number
  emergencyCallsToday: number
  avgCallDuration: number
  conversionRate: number
  activeCustomers: number
  callsByDay: DayMetric[]
  bookingsByDay: DayMetric[]
  revenueByDay: DayMetric[]
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone: string
  address?: string
  preferredLanguage: 'en' | 'es'
  totalCalls: number
  totalBookings: number
  lifetimeValue: number
  leadScore: number
  createdAt: string
}

export interface CustomersResponse {
  customers: Customer[]
  total: number
}

export function useAnalytics() {
  const { getToken } = useAuth()

  return useQuery<Analytics>({
    queryKey: ['analytics'],
    queryFn: async () => {
      const token = await getToken()
      const client = createApiClient(token)
      const { data } = await client.get('/api/analytics')
      return data
    },
    // Refresh every 5 minutes
    refetchInterval: 5 * 60 * 1000,
  })
}

export function useCustomers(params?: { page?: number; search?: string }) {
  const { getToken } = useAuth()

  return useQuery<CustomersResponse>({
    queryKey: ['customers', params],
    queryFn: async () => {
      const token = await getToken()
      const client = createApiClient(token)
      const { data } = await client.get('/api/customers', { params })
      return data
    },
  })
}

export function useCustomer(id: string) {
  const { getToken } = useAuth()

  return useQuery<Customer>({
    queryKey: ['customers', id],
    queryFn: async () => {
      const token = await getToken()
      const client = createApiClient(token)
      const { data } = await client.get(`/api/customers/${id}`)
      return data
    },
    enabled: !!id,
  })
}
