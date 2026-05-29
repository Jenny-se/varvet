import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/layout/Sidebar'

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
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-cream-100 scrollbar-thin pt-14 md:pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
