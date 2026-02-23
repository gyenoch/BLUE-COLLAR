import { type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/cn'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
  className?: string
  iconClassName?: string
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  iconClassName,
}: StatsCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn('rounded-full p-2.5 bg-primary/10', iconClassName)}>
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        {trend && (
          <div className="mt-4 flex items-center gap-1 text-xs">
            <span
              className={cn(
                'font-medium',
                trend.positive ? 'text-green-600' : 'text-red-500'
              )}
            >
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
