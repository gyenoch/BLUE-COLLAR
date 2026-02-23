'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const defaultPricing = [
  { service: 'Drain Cleaning', min: 150, max: 350 },
  { service: 'Water Heater Repair', min: 200, max: 600 },
  { service: 'AC Tune-Up', min: 89, max: 199 },
  { service: 'Electrical Panel Inspection', min: 150, max: 400 },
  { service: 'Emergency Service Call', min: 200, max: 500 },
]

export default function PricingSettingsPage() {
  const [prices, setPrices] = useState(defaultPricing)

  const handleSave = () => {
    toast.success('Pricing saved — your AI agent will quote these ranges on calls')
  }

  const update = (i: number, key: 'min' | 'max', value: number) => {
    setPrices((p) => p.map((r, j) => (j === i ? { ...r, [key]: value } : r)))
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Service Pricing</h1>
      </div>

      <div className="max-w-2xl">
        <p className="text-sm text-muted-foreground mb-4">
          Set price ranges your AI agent quotes to callers. Ranges set expectations without committing to a fixed price before seeing the job.
        </p>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Price Ranges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3 pb-2 border-b">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Service</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Min ($)</p>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Max ($)</p>
            </div>
            {prices.map((row, i) => (
              <div key={row.service} className="grid grid-cols-3 gap-3 items-center">
                <p className="text-sm font-medium">{row.service}</p>
                <Input
                  type="number"
                  value={row.min}
                  onChange={(e) => update(i, 'min', Number(e.target.value))}
                />
                <Input
                  type="number"
                  value={row.max}
                  onChange={(e) => update(i, 'max', Number(e.target.value))}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex justify-end mt-4">
          <Button onClick={handleSave}>Save Pricing</Button>
        </div>
      </div>
    </div>
  )
}
