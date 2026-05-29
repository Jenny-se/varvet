import { ActivityEntry } from '@/lib/types'
import { formatDistanceToNow } from 'date-fns'
import { sv } from 'date-fns/locale'
import { Package, Boxes, KanbanSquare, Activity } from 'lucide-react'

interface ActivityFeedProps {
  entries: ActivityEntry[]
}

const entityIcons: Record<string, React.ElementType> = {
  supplier: Package,
  inventory: Boxes,
  kanban_card: KanbanSquare,
}

export function ActivityFeed({ entries }: ActivityFeedProps) {
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Activity className="w-8 h-8 text-warm-300 mb-2" />
        <p className="text-sm text-warm-400">Ingen aktivitet ännu</p>
      </div>
    )
  }

  return (
    <div className="space-y-0">
      {entries.map((entry, i) => {
        const Icon = entityIcons[entry.entity_type] ?? Activity
        return (
          <div key={entry.id} className={`flex items-start gap-3 py-3 ${i < entries.length - 1 ? 'border-b border-cream-300' : ''}`}>
            <div className="w-7 h-7 rounded-lg bg-cream-200 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="w-3.5 h-3.5 text-warm-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-warm-700">
                <span className="font-medium">{entry.action}</span>
                {entry.entity_name && (
                  <span className="text-warm-500"> · {entry.entity_name}</span>
                )}
              </p>
              <p className="text-xs text-warm-400 mt-0.5">
                {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true, locale: sv })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
