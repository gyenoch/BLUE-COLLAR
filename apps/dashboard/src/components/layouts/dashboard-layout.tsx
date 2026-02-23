'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'
import {
  LayoutDashboard,
  Phone,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Menu,
  X,
  Zap,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/calls', label: 'Calls', icon: Phone },
  { href: '/appointments', label: 'Appointments', icon: Calendar },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
]

const settingsItems = [
  { href: '/settings', label: 'General', icon: Settings },
  { href: '/settings/business', label: 'Business', icon: Settings },
  { href: '/settings/billing', label: 'Billing', icon: Settings },
  { href: '/settings/integrations', label: 'Integrations', icon: Settings },
  { href: '/settings/pricing', label: 'Pricing', icon: Settings },
]

interface NavLinkProps {
  href: string
  label: string
  icon: React.ElementType
  onClick?: () => void
}

function NavLink({ href, label, icon: Icon, onClick }: NavLinkProps) {
  const pathname = usePathname()
  const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <Icon className="h-4 w-4 flex-shrink-0" />
      {label}
      {active && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
    </Link>
  )
}

function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-4 border-b">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-gray-900">Blue-Collar Agent</span>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="ml-auto h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} onClick={onClose} />
        ))}

        <div className="pt-4 pb-2">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Settings
          </p>
        </div>
        {settingsItems.map((item) => (
          <NavLink key={item.href} {...item} onClick={onClose} />
        ))}
      </nav>

      {/* User */}
      <div className="border-t px-4 py-3">
        <div className="flex items-center gap-3">
          <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'h-8 w-8' } }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">My Account</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:bg-white">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile topbar */}
        <header className="flex h-14 items-center gap-3 border-b bg-white px-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="h-9 w-9"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-semibold text-sm">Blue-Collar Agent</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
