'use client'

// Re-export toast helper from sonner for consistent usage across the app
export { toast } from 'sonner'

// Badge component (commonly used alongside toasts for status display)
import { cn } from '@/lib/cn'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-primary text-primary-foreground': variant === 'default',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
          'bg-destructive text-destructive-foreground': variant === 'destructive',
          'border border-input text-foreground': variant === 'outline',
          'bg-green-100 text-green-700': variant === 'success',
          'bg-orange-100 text-orange-700': variant === 'warning',
        },
        className
      )}
      {...props}
    />
  )
}

// Spinner
export function Spinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('animate-spin h-5 w-5 text-muted-foreground', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
