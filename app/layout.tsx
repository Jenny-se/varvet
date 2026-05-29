import type { Metadata } from 'next'
import './globals.css'
import { AppShell } from '@/components/layout/AppShell'

export const metadata: Metadata = {
  title: 'Varvet — Studio CRM',
  description: 'CRM for Varvet yarn shop and creative studio, Gustavsberg',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sv">
      <body className="bg-cream-100 text-warm-900 min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
