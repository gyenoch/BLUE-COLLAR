import { cn } from '@/lib/cn'

interface ProgressBarProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function ProgressBar({ steps, currentStep, className }: ProgressBarProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => {
          const done = index < currentStep
          const active = index === currentStep

          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all',
                    done && 'bg-primary border-primary text-white',
                    active && 'border-primary text-primary bg-primary/10',
                    !done && !active && 'border-gray-200 text-gray-400'
                  )}
                >
                  {done ? '✓' : index + 1}
                </div>
                <span
                  className={cn(
                    'mt-1.5 text-[10px] font-medium hidden sm:block',
                    active ? 'text-primary' : done ? 'text-gray-600' : 'text-gray-400'
                  )}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 mx-2 transition-colors',
                    done ? 'bg-primary' : 'bg-gray-200'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
      <div className="h-1.5 w-full rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${((currentStep) / (steps.length - 1)) * 100}%` }}
        />
      </div>
    </div>
  )
}
