import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Providers } from '@/components/providers'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Blue-Collar Agent',
    template: '%s | Blue-Collar Agent',
  },
  description: 'AI-powered voice receptionist for trade businesses. Never miss a call again.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-background antialiased">
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
