import { format, formatDistanceToNow, parseISO } from 'date-fns'

export function formatDate(date: string | Date, fmt = 'MMM d, yyyy') {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, fmt)
}

export function formatDatetime(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date
  return format(d, 'MMM d, yyyy h:mm a')
}

export function formatRelative(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date
  return formatDistanceToNow(d, { addSuffix: true })
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(cents / 100)
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const local = cleaned.match(/^1?(\d{3})(\d{3})(\d{4})$/)
  if (local) return `(${local[1]}) ${local[2]}-${local[3]}`
  return phone
}

export function truncate(str: string, length = 60): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '…'
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function urgencyColor(urgency: string): string {
  switch (urgency) {
    case 'emergency': return 'text-red-600 bg-red-50 border-red-200'
    case 'urgent': return 'text-orange-600 bg-orange-50 border-orange-200'
    default: return 'text-green-600 bg-green-50 border-green-200'
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case 'completed': return 'text-green-700 bg-green-100'
    case 'scheduled': return 'text-blue-700 bg-blue-100'
    case 'confirmed': return 'text-indigo-700 bg-indigo-100'
    case 'cancelled': return 'text-gray-600 bg-gray-100'
    case 'no_show': return 'text-red-700 bg-red-100'
    case 'missed': return 'text-red-700 bg-red-100'
    case 'in_progress': return 'text-yellow-700 bg-yellow-100'
    default: return 'text-gray-600 bg-gray-100'
  }
}
