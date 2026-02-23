'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import { toast } from 'sonner'
import { Building2, Phone, Clock, Calendar, Wrench, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
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

interface StepProps {
  data: Record<string, string>
  onChange: (key: string, value: string) => void
}

function Step1Business({ data, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Business Info</h3>
          <p className="text-sm text-muted-foreground">Tell us about your business</p>
        </div>
      </div>
      <Input
        label="Business Name *"
        placeholder="Smith's Plumbing LLC"
        value={data.businessName ?? ''}
        onChange={(e) => onChange('businessName', e.target.value)}
      />
      <Select
        label="Trade Type *"
        placeholder="Select your trade"
        options={TRADES}
        value={data.tradeType ?? ''}
        onChange={(e) => onChange('tradeType', e.target.value)}
      />
      <Input
        label="Business Phone *"
        placeholder="(555) 123-4567"
        type="tel"
        value={data.businessPhone ?? ''}
        onChange={(e) => onChange('businessPhone', e.target.value)}
      />
      <Input
        label="Service Area / City"
        placeholder="Houston, TX"
        value={data.serviceArea ?? ''}
        onChange={(e) => onChange('serviceArea', e.target.value)}
      />
    </div>
  )
}

function Step2Hours({ data, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Business Hours</h3>
          <p className="text-sm text-muted-foreground">When do you take appointments?</p>
        </div>
      </div>
      <Select
        label="Timezone *"
        options={TIMEZONES}
        value={data.timezone ?? ''}
        onChange={(e) => onChange('timezone', e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Opens At"
          type="time"
          value={data.hoursStart ?? '08:00'}
          onChange={(e) => onChange('hoursStart', e.target.value)}
        />
        <Input
          label="Closes At"
          type="time"
          value={data.hoursEnd ?? '18:00'}
          onChange={(e) => onChange('hoursEnd', e.target.value)}
        />
      </div>
      <div className="rounded-md border bg-blue-50 border-blue-100 p-3 text-sm text-blue-700">
        Your AI agent answers calls 24/7 — even outside business hours it will take messages and handle emergencies.
      </div>
    </div>
  )
}

function Step3Phone({ data, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Phone className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Twilio Phone Number</h3>
          <p className="text-sm text-muted-foreground">Your AI agent's dedicated number</p>
        </div>
      </div>
      <Input
        label="Twilio Phone Number (from Twilio console)"
        placeholder="+1 (555) 000-0000"
        type="tel"
        value={data.twilioPhone ?? ''}
        onChange={(e) => onChange('twilioPhone', e.target.value)}
        hint="Go to console.twilio.com → Phone Numbers to get a number"
      />
      <Input
        label="Forward Unanswered Calls To"
        placeholder="Your personal cell (optional)"
        type="tel"
        value={data.forwardPhone ?? ''}
        onChange={(e) => onChange('forwardPhone', e.target.value)}
      />
    </div>
  )
}

function Step4Calendar({ data, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Calendar className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">Calendar Integration</h3>
          <p className="text-sm text-muted-foreground">Sync appointments automatically</p>
        </div>
      </div>
      <div className="rounded-lg border p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-white border flex items-center justify-center text-sm font-bold text-blue-600">G</div>
            <div>
              <p className="text-sm font-medium">Google Calendar</p>
              <p className="text-xs text-muted-foreground">Sync bookings in real-time</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => onChange('calendarConnected', 'true')}>
            {data.calendarConnected ? '✓ Connected' : 'Connect'}
          </Button>
        </div>
      </div>
      <Input
        label="Default Appointment Duration (minutes)"
        type="number"
        placeholder="60"
        value={data.defaultDuration ?? '60'}
        onChange={(e) => onChange('defaultDuration', e.target.value)}
      />
    </div>
  )
}

function Step5Done() {
  return (
    <div className="flex flex-col items-center text-center py-6 space-y-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <div>
        <h3 className="text-xl font-bold">You're all set!</h3>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Your AI agent is ready to answer calls. Forward your business number to your Twilio number and you're live.
        </p>
      </div>
      <div className="rounded-lg border bg-muted/50 p-4 text-sm text-left w-full">
        <p className="font-medium mb-2">Quick start checklist:</p>
        <ul className="space-y-1.5 text-muted-foreground">
          <li>✓ Forward your business number to your Twilio number</li>
          <li>✓ Test a call to verify the AI answers</li>
          <li>✓ Check your dashboard for incoming calls</li>
        </ul>
      </div>
    </div>
  )
}

const STEPS = ['Business', 'Hours', 'Phone', 'Calendar', 'Done']

export function OnboardingWizard() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const handleChange = (key: string, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }

  const handleNext = async () => {
    if (step === STEPS.length - 2) {
      // Submit on last real step
      setLoading(true)
      try {
        const token = await getToken()
        const client = createApiClient(token)
        await client.post('/api/onboarding', data)
        setStep((s) => s + 1)
      } catch (err) {
        toast.error('Failed to save settings. Please try again.')
      } finally {
        setLoading(false)
      }
    } else if (step === STEPS.length - 1) {
      router.push('/dashboard')
    } else {
      setStep((s) => s + 1)
    }
  }

  const isLastStep = step === STEPS.length - 1

  return (
    <div className="space-y-6">
      {step === 0 && <Step1Business data={data} onChange={handleChange} />}
      {step === 1 && <Step2Hours data={data} onChange={handleChange} />}
      {step === 2 && <Step3Phone data={data} onChange={handleChange} />}
      {step === 3 && <Step4Calendar data={data} onChange={handleChange} />}
      {step === 4 && <Step5Done />}

      <div className="flex justify-between pt-4 border-t">
        {step > 0 && !isLastStep ? (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
            Back
          </Button>
        ) : (
          <div />
        )}
        <Button onClick={handleNext} loading={loading}>
          {isLastStep ? 'Go to Dashboard' : step === STEPS.length - 2 ? 'Finish Setup' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}
