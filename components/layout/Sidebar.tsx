'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Boxes,
  KanbanSquare,
  ImageIcon,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth/AuthProvider'

const navItems = [
  { href: '/dashboard', label: 'Översikt', icon: LayoutDashboard },
  { href: '/suppliers', label: 'Leverantörer', icon: Package },
  { href: '/inventory', label: 'Lager', icon: Boxes },
  { href: '/kanban', label: 'Uppgifter', icon: KanbanSquare },
  { href: '/moodboards', label: 'Moodboards', icon: ImageIcon },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { session } = useAuth()
  const userEmail = session?.user?.email ?? ''

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  const navContent = (
    <>
      {/* Logo / Brand */}
      <div className="px-6 py-6 border-b border-linen-200">
        <div className="flex items-center gap-2.5">
          <Image
            src="/varvet_logo.JPG"
            alt="Varvet"
            width={36}
            height={36}
            className="rounded-lg flex-shrink-0"
          />
          <div>
            <h1 className="text-base font-semibold text-warm-900 tracking-tight">Varvet</h1>
            <p className="text-xs text-warm-500">Studio CRM</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                active
                  ? 'bg-sage-100 text-sage-700'
                  : 'text-warm-600 hover:bg-cream-200 hover:text-warm-900'
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 ${
                  active ? 'text-sage-600' : 'text-warm-400 group-hover:text-warm-600'
                }`}
              />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-3 border-t border-linen-200">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg">
          <div className="w-6 h-6 rounded-full bg-sage-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-semibold text-sage-700">
              {userEmail.charAt(0).toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-warm-600 truncate flex-1">{userEmail}</p>
          <button
            onClick={handleLogout}
            title="Logga ut"
            className="p-1 rounded text-warm-400 hover:text-warm-700 hover:bg-cream-200 transition-colors flex-shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-linen-200 h-full flex-shrink-0">
        {navContent}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-linen-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/varvet_logo.JPG"
            alt="Varvet"
            width={28}
            height={28}
            className="rounded-md"
          />
          <span className="font-semibold text-warm-900 text-sm">Varvet</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg text-warm-600 hover:bg-cream-200 transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-20 flex">
          <div
            className="fixed inset-0 bg-warm-900/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-56 bg-white flex flex-col h-full shadow-xl pt-14">
            {navContent}
          </aside>
        </div>
      )}
    </>
  )
}
