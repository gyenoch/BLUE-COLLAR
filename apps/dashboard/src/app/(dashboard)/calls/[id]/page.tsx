'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, Clock, User, MessageSquare, AlertTriangle } from 'lucide-react'
import { useCall } from '@/hooks/use-calls'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge, Spinner } from '@/components/ui/toast'
import { CallPlayer } from '@/components/dashboard/call-player'
import { Button } from '@/components/ui/button'
import { formatDatetime, formatDuration, formatPhone, statusColor, urgencyColor } from '@/lib/utils'

export default function CallDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: call, isLoading, isError } = useCall(id)

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  if (isError || !call) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Call not found.</p>
        <Link href="/calls">
          <Button variant="outline" className="mt-4">Back to Calls</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/calls">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Call Detail</h1>
          <p className="text-xs text-muted-foreground font-mono">{call.callSid}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-4">
          {/* Recording */}
          {call.recordingUrl && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recording</CardTitle>
              </CardHeader>
              <CardContent>
                <CallPlayer recordingUrl={call.recordingUrl} duration={call.duration} />
              </CardContent>
            </Card>
          )}

          {/* Summary */}
          {call.summary && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" /> AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">{call.summary}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Call Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Customer</p>
                  <p className="text-sm font-medium">{call.customerName}</p>
                  <p className="text-xs text-muted-foreground">{formatPhone(call.customerPhone)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(call.status)}`}>
                    {call.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Urgency</p>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium border ${urgencyColor(call.urgencyLevel)}`}>
                    {call.urgencyLevel}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="text-sm font-medium">{formatDuration(call.duration)}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Outcome</p>
                <Badge variant={call.outcome === 'booked' ? 'success' : call.outcome === 'emergency_dispatched' ? 'destructive' : 'secondary'}>
                  {call.outcome === 'booked' ? 'Appointment Booked'
                    : call.outcome === 'emergency_dispatched' ? 'Emergency Dispatched'
                    : call.outcome === 'callback' ? 'Callback Requested'
                    : 'No Action Taken'}
                </Badge>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">Language</p>
                <Badge variant="outline">{call.language === 'es' ? 'Spanish' : 'English'}</Badge>
              </div>

              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground">{formatDatetime(call.createdAt)}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
