'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Boxes,
  KanbanSquare,
  Leaf,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { href: '/dashboard', label: 'Översikt', icon: LayoutDashboard },
  { href: '/suppliers', label: 'Leverantörer', icon: Package },
  { href: '/inventory', label: 'Lager', icon: Boxes },
  { href: '/kanban', label: 'Uppgifter', icon: KanbanSquare },
]

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navContent = (
    <>
      {/* Logo / Brand */}
      <div className="px-6 py-6 border-b border-linen-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sage-500 flex items-center justify-center flex-shrink-0">
            <Leaf className="w-4 h-4 text-white" />
          </div>
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

      {/* Footer */}
      <div className="px-6 py-4 border-t border-linen-200">
        <p className="text-xs text-warm-400">Gustavsberg, Sverige</p>
        <p className="text-xs text-warm-400 mt-0.5">Naturfiber &amp; gemenskap</p>
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
          <div className="w-7 h-7 rounded-md bg-sage-500 flex items-center justify-center">
            <Leaf className="w-3.5 h-3.5 text-white" />
          </div>
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
