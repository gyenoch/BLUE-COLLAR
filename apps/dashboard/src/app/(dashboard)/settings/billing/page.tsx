import Link from 'next/link'
import { ArrowLeft, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/toast'

const plans = [
  {
    name: 'Starter',
    price: 299,
    description: 'For solo operators getting started',
    features: [
      'Up to 200 calls/month',
      'Emergency triage (plumbing, HVAC, electrical)',
      'Appointment booking + SMS confirmations',
      'Google Calendar sync',
      'Owner dashboard',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: 499,
    description: 'For growing businesses taking more calls',
    popular: true,
    features: [
      'Up to 500 calls/month',
      'Everything in Starter',
      'Bilingual (English + Spanish)',
      'Jobber CRM integration',
      'AI call summaries + transcripts',
      'Priority support',
    ],
  },
  {
    name: 'Scale',
    price: 799,
    description: 'For multi-tech operations at full volume',
    features: [
      'Unlimited calls',
      'Everything in Growth',
      'Multi-technician dispatch',
      'Advanced analytics + lead scoring',
      'Seasonal campaign automation',
      'Dedicated success manager',
    ],
  },
]

export default function BillingPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Billing & Subscription</h1>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">Growth Plan</p>
              <p className="text-muted-foreground text-sm">$499/month · Renews Feb 1, 2027</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="font-semibold mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan.name} className={plan.popular ? 'border-primary ring-1 ring-primary' : ''}>
              <CardContent className="pt-6 pb-6">
                {plan.popular && <Badge variant="default" className="mb-3">Most Popular</Badge>}
                <p className="font-bold text-xl">{plan.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5 mb-2">{plan.description}</p>
                <p className="text-3xl font-bold">
                  ${plan.price}
                  <span className="text-sm font-normal text-muted-foreground">/mo</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-6" variant={plan.popular ? 'default' : 'outline'}>
                  {plan.name === 'Growth' ? 'Current Plan' : `Switch to ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
