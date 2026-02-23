import Link from 'next/link'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/plumbing', label: 'Plumbing' },
  { href: '/hvac', label: 'HVAC' },
  { href: '/electrical', label: 'Electrical' },
  { href: '/blog', label: 'Blog' },
]

export function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">Blue-Collar Agent</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
                  <Zap className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-bold text-sm">Blue-Collar Agent</span>
              </Link>
              <p className="text-xs text-gray-500">
                AI-powered voice receptionist for trade businesses. Never miss a call.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Product</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/how-it-works" className="hover:text-gray-900">How It Works</Link></li>
                <li><Link href="/pricing" className="hover:text-gray-900">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Industries</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/plumbing" className="hover:text-gray-900">Plumbing</Link></li>
                <li><Link href="/hvac" className="hover:text-gray-900">HVAC</Link></li>
                <li><Link href="/electrical" className="hover:text-gray-900">Electrical</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Company</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/blog" className="hover:text-gray-900">Blog</Link></li>
                <li><Link href="/sign-up" className="hover:text-gray-900">Get Started</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-6 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Blue-Collar Agent. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
