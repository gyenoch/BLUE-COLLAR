'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { useAppointments } from '@/hooks/use-appointments'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { Spinner } from '@/components/ui/toast'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { formatDatetime, formatPhone, statusColor, urgencyColor } from '@/lib/utils'

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'no_show', label: 'No Show' },
]

export default function AppointmentsPage() {
  const [status, setStatus] = useState('')
  const { data, isLoading } = useAppointments({ status: status || undefined })
  const appointments = data?.appointments ?? []

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <p className="text-sm text-muted-foreground mt-1">{data?.total ?? 0} total appointments</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <Select options={STATUS_OPTIONS} value={status} onChange={(e) => setStatus(e.target.value)} className="w-40" />
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : appointments.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-muted-foreground">
              <Calendar className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No appointments found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Scheduled</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((apt) => (
                  <TableRow key={apt.id}>
                    <TableCell>
                      <Link href={`/appointments/${apt.id}`} className="hover:underline">
                        <p className="font-medium text-sm">{apt.customerName}</p>
                        <p className="text-xs text-muted-foreground">{formatPhone(apt.customerPhone)}</p>
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm">{apt.serviceType}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDatetime(apt.scheduledAt)}</TableCell>
                    <TableCell>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(apt.status)}`}>
                        {apt.status.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${urgencyColor(apt.urgency)}`}>
                        {apt.urgency}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{apt.estimatedDuration} min</TableCell>
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
