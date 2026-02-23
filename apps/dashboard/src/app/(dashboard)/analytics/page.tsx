'use client'

import { Phone, Calendar, TrendingUp, Users, PhoneMissed, Clock } from 'lucide-react'
import { useAnalytics } from '@/hooks/use-analytics'
import { StatsCard } from '@/components/dashboard/stats-card'
import { RevenueChart, CallsChart } from '@/components/dashboard/revenue-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/toast'
import { formatCurrency, formatDuration } from '@/lib/utils'

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useAnalytics()

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Performance metrics for your AI agent</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Calls This Month"
          value={analytics?.callsThisMonth ?? 0}
          subtitle={`${analytics?.callsThisWeek ?? 0} this week`}
          icon={Phone}
        />
        <StatsCard
          title="Missed Calls"
          value={analytics?.missedCallsToday ?? 0}
          subtitle="Today"
          icon={PhoneMissed}
          iconClassName="bg-red-100"
        />
        <StatsCard
          title="Bookings This Month"
          value={analytics?.bookingsThisMonth ?? 0}
          subtitle={`${analytics?.bookingsThisWeek ?? 0} this week`}
          icon={Calendar}
        />
        <StatsCard
          title="Conversion Rate"
          value={`${analytics?.conversionRate ?? 0}%`}
          subtitle="Calls → bookings"
          icon={TrendingUp}
        />
        <StatsCard
          title="Active Customers"
          value={analytics?.activeCustomers ?? 0}
          icon={Users}
        />
        <StatsCard
          title="Avg Call Duration"
          value={formatDuration(analytics?.avgCallDuration ?? 0)}
          icon={Clock}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Calls Per Day (14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <CallsChart data={analytics?.callsByDay ?? []} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Bookings Per Day (14 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <CallsChart data={analytics?.bookingsByDay ?? []} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Estimated Revenue Per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart
              data={analytics?.revenueByDay ?? []}
              formatValue={(v) => `$${v}`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
