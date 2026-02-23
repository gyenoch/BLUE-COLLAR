'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { createApiClient } from '@/lib/api-client'

export interface Appointment {
  id: string
  customerId?: string
  customerName: string
  customerPhone: string
  serviceType: string
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  urgency: 'emergency' | 'urgent' | 'routine'
  scheduledAt: string
  estimatedDuration: number
  address: string
  notes?: string
  technicianName?: string
  confirmationSent: boolean
  reminderSent: boolean
  createdAt: string
}

export interface AppointmentsResponse {
  appointments: Appointment[]
  total: number
}

export function useAppointments(params?: { status?: string; page?: number }) {
  const { getToken } = useAuth()

  return useQuery<AppointmentsResponse>({
    queryKey: ['appointments', params],
    queryFn: async () => {
      const token = await getToken()
      const client = createApiClient(token)
      const { data } = await client.get('/api/bookings', { params })
      return data
    },
  })
}

export function useUpcomingAppointments() {
  const { getToken } = useAuth()

  return useQuery<Appointment[]>({
    queryKey: ['appointments', 'upcoming'],
    queryFn: async () => {
      const token = await getToken()
      const client = createApiClient(token)
      const { data } = await client.get('/api/bookings/upcoming')
      return data
    },
  })
}

export function useAppointment(id: string) {
  const { getToken } = useAuth()

  return useQuery<Appointment>({
    queryKey: ['appointments', id],
    queryFn: async () => {
      const token = await getToken()
      const client = createApiClient(token)
      const { data } = await client.get(`/api/bookings/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCancelAppointment() {
  const { getToken } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken()
      const client = createApiClient(token)
      const { data } = await client.patch(`/api/bookings/${id}/cancel`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}
