'use client'

import { Modal } from './Modal'

interface ConfirmDialogProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Bekräfta',
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  return (
    <Modal title={title} onClose={onCancel} size="sm">
      <div className="px-6 py-4">
        <p className="text-sm text-warm-600">{message}</p>
        <div className="flex gap-3 mt-6 justify-end">
          <button onClick={onCancel} className="btn-secondary">
            Avbryt
          </button>
          <button
            onClick={onConfirm}
            className={danger ? 'btn-danger' : 'btn-primary'}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
