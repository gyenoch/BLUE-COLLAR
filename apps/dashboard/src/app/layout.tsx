import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Blue-Collar Agent',
  description: 'AI-powered voice receptionist for trade businesses',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  )
}
