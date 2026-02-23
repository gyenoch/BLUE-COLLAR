'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { useCustomers } from '@/hooks/use-analytics'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/toast'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'
import { LeadScoreBadge } from '@/components/dashboard/lead-score-badge'
import { formatRelative, formatCurrency, formatPhone } from '@/lib/utils'

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useCustomers({ search: search || undefined })
  const customers = data?.customers ?? []

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-sm text-muted-foreground mt-1">{data?.total ?? 0} customers in your database</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <Input
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-12"><Spinner /></div>
          ) : customers.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-muted-foreground">
              <Users className="h-10 w-10 mb-3 opacity-30" />
              <p className="text-sm">No customers found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Calls</TableHead>
                  <TableHead>Bookings</TableHead>
                  <TableHead>Lifetime Value</TableHead>
                  <TableHead>Lead Score</TableHead>
                  <TableHead>Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Link href={`/customers/${c.id}`} className="hover:underline font-medium text-sm">
                        {c.firstName} {c.lastName}
                      </Link>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatPhone(c.phone)}</TableCell>
                    <TableCell className="text-sm">{c.totalCalls}</TableCell>
                    <TableCell className="text-sm">{c.totalBookings}</TableCell>
                    <TableCell className="text-sm">{formatCurrency(c.lifetimeValue)}</TableCell>
                    <TableCell><LeadScoreBadge score={c.leadScore} showLabel /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatRelative(c.createdAt)}</TableCell>
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
