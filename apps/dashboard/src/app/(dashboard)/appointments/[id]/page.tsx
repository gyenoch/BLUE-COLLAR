'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, User, Wrench, AlertTriangle } from 'lucide-react'
import { useAppointment, useCancelAppointment } from '@/hooks/use-appointments'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/toast'
import { toast } from 'sonner'
import { formatDatetime, formatPhone, statusColor, urgencyColor } from '@/lib/utils'

export default function AppointmentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: apt, isLoading, isError } = useAppointment(id)
  const cancel = useCancelAppointment()

  if (isLoading) {
    return <div className="flex h-96 items-center justify-center"><Spinner className="h-8 w-8" /></div>
  }

  if (isError || !apt) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Appointment not found.</p>
        <Link href="/appointments"><Button variant="outline" className="mt-4">Back</Button></Link>
      </div>
    )
  }

  const handleCancel = async () => {
    if (!confirm('Cancel this appointment?')) return
    try {
      await cancel.mutateAsync(apt.id)
      toast.success('Appointment cancelled')
    } catch {
      toast.error('Failed to cancel')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/appointments">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Appointment Details</h1>
        </div>
        {apt.status === 'scheduled' && (
          <Button variant="destructive" size="sm" onClick={handleCancel} loading={cancel.isPending}>
            Cancel Appointment
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Customer</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2.5">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{apt.customerName}</p>
                <p className="text-sm text-muted-foreground">{formatPhone(apt.customerPhone)}</p>
              </div>
            </div>
            {apt.address && (
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-sm">{apt.address}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-base">Service</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2.5">
              <Wrench className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-medium">{apt.serviceType}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{formatDatetime(apt.scheduledAt)} · {apt.estimatedDuration} min</p>
            </div>
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${urgencyColor(apt.urgency)}`}>
                {apt.urgency}
              </span>
            </div>
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(apt.status)}`}>
              {apt.status.replace('_', ' ')}
            </span>
            {apt.confirmationSent && (
              <p className="text-xs text-green-600">✓ SMS confirmation sent</p>
            )}
          </CardContent>
        </Card>

        {apt.notes && (
          <Card className="md:col-span-2">
            <CardHeader className="pb-2"><CardTitle className="text-base">Notes</CardTitle></CardHeader>
            <CardContent><p className="text-sm text-gray-700">{apt.notes}</p></CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
