import Link from 'next/link'
import { Building2, CreditCard, Plug, DollarSign, ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const sections = [
  {
    href: '/settings/business',
    icon: Building2,
    title: 'Business Settings',
    description: 'Business name, trade type, phone number, and agent configuration',
  },
  {
    href: '/settings/billing',
    icon: CreditCard,
    title: 'Billing & Subscription',
    description: 'Manage your plan, payment method, and view invoices',
  },
  {
    href: '/settings/integrations',
    icon: Plug,
    title: 'Integrations',
    description: 'Connect Google Calendar, Jobber CRM, and other tools',
  },
  {
    href: '/settings/pricing',
    icon: DollarSign,
    title: 'Service Pricing',
    description: 'Configure automated quote price ranges for your services',
  },
]

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account and AI agent configuration</p>
      </div>

      <div className="space-y-3 max-w-2xl">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{s.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{s.description}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
