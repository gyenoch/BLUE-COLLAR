'use client'

import Link from 'next/link'
import { Phone, PhoneMissed, PhoneCall, AlertTriangle } from 'lucide-react'
import { type Call } from '@/hooks/use-calls'
import { Badge } from '@/components/ui/toast'
import { formatRelative, formatDuration, formatPhone } from '@/lib/utils'
import { cn } from '@/lib/cn'

interface CallListProps {
  calls: Call[]
  showLink?: boolean
}

const urgencyIcon = {
  emergency: <AlertTriangle className="h-3.5 w-3.5 text-red-500" />,
  urgent: <AlertTriangle className="h-3.5 w-3.5 text-orange-400" />,
  routine: null,
}

const statusIcon = {
  completed: <PhoneCall className="h-4 w-4 text-green-500" />,
  missed: <PhoneMissed className="h-4 w-4 text-red-500" />,
  no_answer: <PhoneMissed className="h-4 w-4 text-red-400" />,
  in_progress: <Phone className="h-4 w-4 text-blue-500 animate-pulse" />,
  busy: <PhoneMissed className="h-4 w-4 text-orange-400" />,
}

export function CallList({ calls, showLink = true }: CallListProps) {
  if (calls.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Phone className="h-10 w-10 mb-3 opacity-30" />
        <p className="text-sm">No calls yet</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {calls.map((call) => {
        const row = (
          <div className="flex items-center gap-4 px-1 py-3 hover:bg-muted/40 rounded-md transition-colors">
            <div className="flex-shrink-0">
              {statusIcon[call.status] ?? <Phone className="h-4 w-4 text-gray-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm truncate">{call.customerName}</span>
                {urgencyIcon[call.urgencyLevel]}
                {call.language === 'es' && (
                  <Badge variant="outline" className="text-[10px] px-1 py-0">ES</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">{formatPhone(call.customerPhone)}</span>
                {call.duration > 0 && (
                  <span className="text-xs text-muted-foreground">· {formatDuration(call.duration)}</span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 text-right">
              <Badge
                variant={
                  call.outcome === 'booked' ? 'success'
                    : call.outcome === 'emergency_dispatched' ? 'destructive'
                    : 'secondary'
                }
                className="text-[10px]"
              >
                {call.outcome === 'booked' ? 'Booked'
                  : call.outcome === 'emergency_dispatched' ? 'Emergency'
                  : call.outcome === 'callback' ? 'Callback'
                  : 'No action'}
              </Badge>
              <p className="text-[11px] text-muted-foreground mt-1">
                {formatRelative(call.createdAt)}
              </p>
            </div>
          </div>
        )

        return showLink ? (
          <Link key={call.id} href={`/calls/${call.id}`} className="block">
            {row}
          </Link>
        ) : (
          <div key={call.id}>{row}</div>
        )
      })}
    </div>
  )
}
