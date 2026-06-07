'use client'

import { Supplier } from '@/lib/types'
import { Globe, Mail, Phone, MapPin, Edit2, Trash2, Clock, ShoppingBag } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

interface SupplierCardProps {
  supplier: Supplier
  onEdit: () => void
  onDelete: () => void
  onView: () => void
}

export function SupplierCard({ supplier, onEdit, onDelete, onView }: SupplierCardProps) {
  return (
    <div className="card p-5 hover:shadow-md transition-shadow duration-200 cursor-pointer" onClick={onView}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-warm-900 text-sm truncate">{supplier.company_name}</h3>
            <span
              className={`badge text-xs ${
                supplier.status === 'active'
                  ? 'bg-sage-100 text-sage-700'
                  : 'bg-warm-100 text-warm-500'
              }`}
            >
              {supplier.status === 'active' ? 'Aktiv' : 'Inaktiv'}
            </span>
          </div>
          {supplier.contact_person && (
            <p className="text-xs text-warm-500 mt-0.5">{supplier.contact_person}</p>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={e => { e.stopPropagation(); onEdit() }}
            className="p-1.5 rounded-lg text-warm-400 hover:text-warm-700 hover:bg-cream-200 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); onDelete() }}
            className="p-1.5 rounded-lg text-warm-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Contact row */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {supplier.email && (
          <a
            href={`mailto:${supplier.email}`}
            className="flex items-center gap-1.5 text-xs text-warm-500 hover:text-sage-600 transition-colors"
          >
            <Mail className="w-3 h-3" />
            {supplier.email}
          </a>
        )}
        {supplier.phone && (
          <a
            href={`tel:${supplier.phone}`}
            className="flex items-center gap-1.5 text-xs text-warm-500 hover:text-sage-600 transition-colors"
          >
            <Phone className="w-3 h-3" />
            {supplier.phone}
          </a>
        )}
        {supplier.website && (
          <a
            href={supplier.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-warm-500 hover:text-sage-600 transition-colors"
          >
            <Globe className="w-3 h-3" />
            {supplier.website.replace(/^https?:\/\//, '')}
          </a>
        )}
        {supplier.country_of_origin && (
          <span className="flex items-center gap-1.5 text-xs text-warm-500">
            <MapPin className="w-3 h-3" />
            {supplier.country_of_origin}
          </span>
        )}
      </div>

      {/* Stats */}
      {(supplier.minimum_order_quantity || supplier.lead_time_days) && (
        <div className="mt-3 flex gap-4">
          {supplier.minimum_order_quantity && (
            <span className="flex items-center gap-1.5 text-xs text-warm-500">
              <ShoppingBag className="w-3 h-3" />
              Min. {supplier.minimum_order_quantity} st
            </span>
          )}
          {supplier.lead_time_days && (
            <span className="flex items-center gap-1.5 text-xs text-warm-500">
              <Clock className="w-3 h-3" />
              {supplier.lead_time_days} dagar
            </span>
          )}
        </div>
      )}

      {/* Fibers */}
      {supplier.fiber_specialties.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {supplier.fiber_specialties.map(f => (
            <Badge key={f} label={f} variant="sage" />
          ))}
        </div>
      )}

      {/* Certifications */}
      {supplier.certifications.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {supplier.certifications.map(c => (
            <Badge key={c} label={c} variant="linen" />
          ))}
        </div>
      )}

      {supplier.notes && (
        <p className="mt-3 text-xs text-warm-500 border-t border-cream-300 pt-3 line-clamp-2">
          {supplier.notes}
        </p>
      )}
    </div>
  )
}
