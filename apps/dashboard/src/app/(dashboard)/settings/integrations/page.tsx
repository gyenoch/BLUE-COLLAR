'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/toast'

const integrations = [
  {
    name: 'Google Calendar',
    description: 'Sync appointments and check real-time availability when booking',
    status: 'disconnected' as const,
    logo: 'G',
    color: 'text-blue-600',
  },
  {
    name: 'Jobber',
    description: 'Two-way CRM sync for jobs, customers, and invoices',
    status: 'disconnected' as const,
    logo: 'J',
    color: 'text-green-600',
  },
  {
    name: 'Twilio',
    description: 'Voice calls and SMS messaging — your AI agent phone number',
    status: 'connected' as const,
    logo: 'T',
    color: 'text-red-600',
  },
  {
    name: 'Stripe',
    description: 'Subscription billing and payment processing',
    status: 'connected' as const,
    logo: 'S',
    color: 'text-purple-600',
  },
]

export default function IntegrationsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Integrations</h1>
      </div>

      <div className="space-y-3 max-w-2xl">
        {integrations.map((integration) => (
          <Card key={integration.name}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100 font-bold text-lg ${integration.color}`}>
                {integration.logo}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium">{integration.name}</p>
                  <Badge variant={integration.status === 'connected' ? 'success' : 'secondary'}>
                    {integration.status === 'connected' ? 'Connected' : 'Not connected'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{integration.description}</p>
              </div>
              <Button
                variant={integration.status === 'connected' ? 'outline' : 'default'}
                size="sm"
                className="flex-shrink-0"
              >
                {integration.status === 'connected' ? 'Manage' : 'Connect'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
