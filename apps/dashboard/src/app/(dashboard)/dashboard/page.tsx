'use client'

import { Phone, Calendar, TrendingUp, PhoneMissed } from 'lucide-react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { CallList } from '@/components/dashboard/call-list'
import { AppointmentCalendar } from '@/components/dashboard/appointment-calendar'
import { RevenueChart, CallsChart } from '@/components/dashboard/revenue-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/toast'
import { useAnalytics } from '@/hooks/use-analytics'
import { useCalls } from '@/hooks/use-calls'
import { useUpcomingAppointments } from '@/hooks/use-appointments'
import { formatCurrency } from '@/lib/utils'

export default function DashboardPage() {
  const { data: analytics, isLoading: loadingAnalytics } = useAnalytics()
  const { data: callsData, isLoading: loadingCalls } = useCalls({ page: 1 })
  const { data: upcoming, isLoading: loadingUpcoming } = useUpcomingAppointments()

  if (loadingAnalytics) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time overview of your AI agent</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Calls Today"
          value={analytics?.callsToday ?? 0}
          subtitle={`${analytics?.emergencyCallsToday ?? 0} emergencies`}
          icon={Phone}
          trend={{ value: 12, label: 'vs yesterday', positive: true }}
        />
        <StatsCard
          title="Missed Calls"
          value={analytics?.missedCallsToday ?? 0}
          subtitle="Need follow-up"
          icon={PhoneMissed}
          iconClassName="bg-red-100"
        />
        <StatsCard
          title="Bookings This Week"
          value={analytics?.bookingsThisWeek ?? 0}
          subtitle={`${analytics?.bookingsThisMonth ?? 0} this month`}
          icon={Calendar}
          trend={{ value: 8, label: 'vs last week', positive: true }}
        />
        <StatsCard
          title="Revenue (Est.)"
          value={formatCurrency(analytics?.revenueThisMonth ?? 0)}
          subtitle="This month"
          icon={TrendingUp}
          trend={{ value: 15, label: 'vs last month', positive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Calls (Last 14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <CallsChart data={analytics?.callsByDay ?? []} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Revenue (Last 14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={analytics?.revenueByDay ?? []} formatValue={(v) => `${v}`} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Calls</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingCalls ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : (
              <CallList calls={callsData?.calls?.slice(0, 5) ?? []} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingUpcoming ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : (
              <AppointmentCalendar appointments={upcoming?.slice(0, 4) ?? []} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
