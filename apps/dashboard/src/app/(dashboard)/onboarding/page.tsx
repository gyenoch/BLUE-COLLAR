'use client'

import { useState } from 'react'
import { ProgressBar } from '@/components/onboarding/progress-bar'
import { OnboardingWizard } from '@/components/onboarding/wizard-steps'
import { Zap } from 'lucide-react'

const STEPS = ['Business', 'Hours', 'Phone', 'Calendar', 'Done']

export default function OnboardingPage() {
  const [step, setStep] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-start justify-center pt-12 px-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Set Up Your AI Agent</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Get up and running in under 15 minutes
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <ProgressBar steps={STEPS} currentStep={step} />
        </div>

        {/* Wizard card */}
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <OnboardingWizard />
        </div>
      </div>
    </div>
  )
}
