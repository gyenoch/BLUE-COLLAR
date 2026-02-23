'use client'

import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/nextjs'
import { createApiClient } from '@/lib/api-client'

export interface Call {
  id: string
  callSid: string
  customerId?: string
  customerName: string
  customerPhone: string
  status: 'in_progress' | 'completed' | 'missed' | 'no_answer' | 'busy'
  urgencyLevel: 'emergency' | 'urgent' | 'routine'
  duration: number
  recordingUrl?: string
  summary?: string
  language: 'en' | 'es'
  outcome: 'booked' | 'callback' | 'emergency_dispatched' | 'no_action' | 'pending'
  startedAt: string
  endedAt?: string
  createdAt: string
}

export interface CallsResponse {
  calls: Call[]
  total: number
  page: number
  pageSize: number
}

export function useCalls(params?: { page?: number; status?: string; urgency?: string }) {
  const { getToken } = useAuth()

  return useQuery<CallsResponse>({
    queryKey: ['calls', params],
    queryFn: async () => {
      const token = await getToken()
      const client = createApiClient(token)
      const { data } = await client.get('/api/voice/calls', { params })
      return data
    },
  })
}

export function useCall(callId: string) {
  const { getToken } = useAuth()

  return useQuery<Call>({
    queryKey: ['calls', callId],
    queryFn: async () => {
      const token = await getToken()
      const client = createApiClient(token)
      const { data } = await client.get(`/api/voice/calls/${callId}`)
      return data
    },
    enabled: !!callId,
  })
}
