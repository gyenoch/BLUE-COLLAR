'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Phone, Mail, MapPin, Globe } from 'lucide-react'
import { useCustomer } from '@/hooks/use-analytics'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/toast'
import { LeadScoreBadge } from '@/components/dashboard/lead-score-badge'
import { formatPhone, formatCurrency, formatDate } from '@/lib/utils'

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: c, isLoading, isError } = useCustomer(id)

  if (isLoading) {
    return <div className="flex h-96 items-center justify-center"><Spinner className="h-8 w-8" /></div>
  }

  if (isError || !c) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Customer not found.</p>
        <Link href="/customers"><Button variant="outline" className="mt-4">Back</Button></Link>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/customers">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">{c.firstName} {c.lastName}</h1>
          <p className="text-sm text-muted-foreground">Customer since {formatDate(c.createdAt)}</p>
        </div>
        <div className="ml-auto">
          <LeadScoreBadge score={c.leadScore} showLabel />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{c.totalCalls}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Calls</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{c.totalBookings}</p>
            <p className="text-sm text-muted-foreground mt-1">Appointments</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{formatCurrency(c.lifetimeValue)}</p>
            <p className="text-sm text-muted-foreground mt-1">Lifetime Value</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-base">Contact Info</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">{formatPhone(c.phone)}</p>
          </div>
          {c.email && (
            <div className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{c.email}</p>
            </div>
          )}
          {c.address && (
            <div className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{c.address}</p>
            </div>
          )}
          <div className="flex items-center gap-2.5">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm">{c.preferredLanguage === 'es' ? 'Spanish' : 'English'}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
