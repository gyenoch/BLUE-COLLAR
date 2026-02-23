'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { createApiClient } from '@/lib/api-client'

const TRADES = [
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'hvac', label: 'HVAC / Air Conditioning' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'general', label: 'General Contractor' },
]

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern (ET)' },
  { value: 'America/Chicago', label: 'Central (CT)' },
  { value: 'America/Denver', label: 'Mountain (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
]

export default function BusinessSettingsPage() {
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    businessName: '',
    tradeType: 'plumbing',
    phone: '',
    serviceArea: '',
    timezone: 'America/Chicago',
    hoursStart: '08:00',
    hoursEnd: '18:00',
    agentName: 'Alex',
    emergencyKeywords: 'flood, burst pipe, no heat, no power, gas leak, sparks',
  })

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleSave = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const client = createApiClient(token)
      await client.patch('/api/business', form)
      toast.success('Business settings saved')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold">Business Settings</h1>
      </div>

      <div className="max-w-2xl space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Business Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Business Name" value={form.businessName} onChange={(e) => set('businessName', e.target.value)} placeholder="Smith's Plumbing LLC" />
            <Select label="Trade Type" options={TRADES} value={form.tradeType} onChange={(e) => set('tradeType', e.target.value)} />
            <Input label="Business Phone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="(555) 123-4567" />
            <Input label="Service Area" value={form.serviceArea} onChange={(e) => set('serviceArea', e.target.value)} placeholder="Houston, TX" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Business Hours</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select label="Timezone" options={TIMEZONES} value={form.timezone} onChange={(e) => set('timezone', e.target.value)} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Opens At" type="time" value={form.hoursStart} onChange={(e) => set('hoursStart', e.target.value)} />
              <Input label="Closes At" type="time" value={form.hoursEnd} onChange={(e) => set('hoursEnd', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">AI Agent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="Agent Name"
              value={form.agentName}
              onChange={(e) => set('agentName', e.target.value)}
              hint='The name your AI agent introduces itself as (e.g. "Hi, this is Alex from Smith Plumbing...")'
            />
            <Input
              label="Emergency Keywords"
              value={form.emergencyKeywords}
              onChange={(e) => set('emergencyKeywords', e.target.value)}
              placeholder="flood, no heat, no power, gas leak"
              hint="Comma-separated. When a caller mentions these, the agent triggers emergency dispatch."
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} loading={loading}>Save Changes</Button>
        </div>
      </div>
    </div>
  )
}
