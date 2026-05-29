interface BadgeProps {
  label: string
  variant?: 'default' | 'sage' | 'amber' | 'red' | 'blue' | 'purple' | 'linen'
  size?: 'sm' | 'md'
}

const variantClasses = {
  default: 'bg-warm-100 text-warm-700',
  sage: 'bg-sage-100 text-sage-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  blue: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  linen: 'bg-linen-100 text-bark-600',
}

export function Badge({ label, variant = 'default', size = 'sm' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variantClasses[variant]} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm'
      }`}
    >
      {label}
    </span>
  )
}

export function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    low: { label: 'Låg', variant: 'sage' },
    medium: { label: 'Medel', variant: 'amber' },
    high: { label: 'Hög', variant: 'red' },
  }
  const config = map[priority] ?? { label: priority, variant: 'default' }
  return <Badge label={config.label} variant={config.variant} />
}

export function CardCategoryBadge({ category }: { category: string }) {
  const map: Record<string, BadgeProps['variant']> = {
    Workshop: 'sage',
    Order: 'blue',
    Marketing: 'purple',
    Admin: 'linen',
    Event: 'amber',
  }
  return <Badge label={category} variant={map[category] ?? 'default'} />
}

export function WeightBadge({ weight }: { weight: string }) {
  return <Badge label={weight} variant="linen" />
}
