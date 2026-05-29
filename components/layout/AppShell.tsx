'use client'

import { usePathname } from 'next/navigation'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { Sidebar } from '@/components/layout/Sidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <AuthProvider>
      {isLoginPage ? (
        <>{children}</>
      ) : (
        <div className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-cream-100 scrollbar-thin pt-14 md:pt-0">
            {children}
          </main>
        </div>
      )}
    </AuthProvider>
  )
}
