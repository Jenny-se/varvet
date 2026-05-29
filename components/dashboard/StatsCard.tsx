import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  accent?: 'sage' | 'amber' | 'red' | 'blue' | 'bark'
}

const accentColors = {
  sage: { bg: 'bg-sage-100', icon: 'text-sage-600', border: 'border-sage-200' },
  amber: { bg: 'bg-amber-100', icon: 'text-amber-600', border: 'border-amber-200' },
  red: { bg: 'bg-red-100', icon: 'text-red-600', border: 'border-red-200' },
  blue: { bg: 'bg-blue-100', icon: 'text-blue-600', border: 'border-blue-200' },
  bark: { bg: 'bg-linen-100', icon: 'text-bark-500', border: 'border-linen-200' },
}

export function StatsCard({ title, value, subtitle, icon: Icon, accent = 'sage' }: StatsCardProps) {
  const colors = accentColors[accent]
  return (
    <div className={`card p-5 border ${colors.border}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-warm-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-warm-900 mt-1.5">{value}</p>
          {subtitle && <p className="text-xs text-warm-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 ${colors.icon}`} />
        </div>
      </div>
    </div>
  )
}
