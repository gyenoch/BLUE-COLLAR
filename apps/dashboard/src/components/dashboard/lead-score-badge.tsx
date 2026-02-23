import { cn } from '@/lib/cn'

interface LeadScoreBadgeProps {
  score: number
  showLabel?: boolean
  className?: string
}

function getScoreConfig(score: number) {
  if (score >= 80) return { label: 'Hot', color: 'bg-red-100 text-red-700 border-red-200', ring: 'bg-red-500' }
  if (score >= 60) return { label: 'Warm', color: 'bg-orange-100 text-orange-700 border-orange-200', ring: 'bg-orange-400' }
  if (score >= 40) return { label: 'Lukewarm', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', ring: 'bg-yellow-400' }
  return { label: 'Cold', color: 'bg-blue-100 text-blue-600 border-blue-200', ring: 'bg-blue-400' }
}

export function LeadScoreBadge({ score, showLabel = false, className }: LeadScoreBadgeProps) {
  const config = getScoreConfig(score)

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.color,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.ring)} />
      {showLabel ? config.label : null}
      {score}
    </span>
  )
}
