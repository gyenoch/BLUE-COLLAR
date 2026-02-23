'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone } from 'lucide-react'
import { useCalls } from '@/hooks/use-calls'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Badge, Spinner } from '@/components/ui/toast'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { formatRelative, formatDuration, formatPhone, statusColor } from '@/lib/utils'

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'completed', label: 'Completed' },
  { value: 'missed', label: 'Missed' },
  { value: 'in_progress', label: 'In Progress' },
]

const URGENCY_OPTIONS = [
  { value: '', label: 'All Urgency' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'routine', label: 'Routine' },
]

export default function CallsPage() {
  const [status, setStatus] = useState('')
  const [urgency, setUrgency] = useState('')
  const { data, isLoading } = useCalls({ status: status || undefined, urgency: urgency || undefined })
  const calls = data?.calls ?? []

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Calls</h1>
        <p className="text-sm text-muted-foreground mt-1">{data?.total ?? 0} total calls handled by your AI agent</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex gap-3">
            <Select options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value)} className="w-40" />
            <Select options={URGENCY_OPTIONS} value={urgency} onChange={(e) => setUrgency(e.target.value)} className="w-36" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : calls.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-muted-foreground">
              <Phone className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No calls found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Outcome</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>
                      <Link href={`/calls/${call.id}`} className="hover:underline">
                        <p className="font-medium text-sm">{call.customerName}</p>
                        <p className="text-xs text-muted-foreground">{formatPhone(call.customerPhone)}</p>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(call.status)}`}>
                        {call.status.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(call.urgencyLevel)}`}>
                        {call.urgencyLevel}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={call.outcome === 'booked' ? 'success' : call.outcome === 'emergency_dispatched' ? 'destructive' : 'secondary'}
                        className="text-[10px]"
                      >
                        {call.outcome === 'booked' ? 'Booked'
                          : call.outcome === 'emergency_dispatched' ? 'Emergency'
                          : call.outcome === 'callback' ? 'Callback' : 'No action'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {call.duration > 0 ? formatDuration(call.duration) : '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatRelative(call.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
