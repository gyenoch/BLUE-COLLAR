'use client'

import Link from 'next/link'
import { Calendar, Clock, MapPin, AlertTriangle } from 'lucide-react'
import { type Appointment } from '@/hooks/use-appointments'
import { Badge } from '@/components/ui/toast'
import { formatDatetime, formatPhone } from '@/lib/utils'
import { cn } from '@/lib/cn'

interface AppointmentCalendarProps {
  appointments: Appointment[]
  showLink?: boolean
}

const urgencyStyles = {
  emergency: 'border-l-red-500 bg-red-50/50',
  urgent: 'border-l-orange-400 bg-orange-50/50',
  routine: 'border-l-blue-400 bg-blue-50/50',
}

const statusBadge = {
  scheduled: { variant: 'secondary' as const, label: 'Scheduled' },
  confirmed: { variant: 'success' as const, label: 'Confirmed' },
  completed: { variant: 'success' as const, label: 'Completed' },
  cancelled: { variant: 'outline' as const, label: 'Cancelled' },
  no_show: { variant: 'destructive' as const, label: 'No Show' },
}

export function AppointmentCalendar({ appointments, showLink = true }: AppointmentCalendarProps) {
  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Calendar className="h-10 w-10 mb-3 opacity-30" />
        <p className="text-sm">No upcoming appointments</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {appointments.map((apt) => {
        const badge = statusBadge[apt.status] ?? { variant: 'secondary' as const, label: apt.status }
        const card = (
          <div
            className={cn(
              'rounded-md border-l-4 border border-border p-3 transition-colors hover:bg-muted/30',
              urgencyStyles[apt.urgency]
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm">{apt.customerName}</span>
                  {apt.urgency === 'emergency' && (
                    <AlertTriangle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{apt.serviceType}</p>
              </div>
              <Badge variant={badge.variant} className="text-[10px] flex-shrink-0">
                {badge.label}
              </Badge>
            </div>

            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{formatDatetime(apt.scheduledAt)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span>{apt.estimatedDuration} min</span>
              </div>
              {apt.address && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground col-span-2">
                  <MapPin className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{apt.address}</span>
                </div>
              )}
            </div>
          </div>
        )

        return showLink ? (
          <Link key={apt.id} href={`/appointments/${apt.id}`}>
            {card}
          </Link>
        ) : (
          <div key={apt.id}>{card}</div>
        )
      })}
    </div>
  )
}
