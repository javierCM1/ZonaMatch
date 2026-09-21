import type { ReactNode } from 'react'

export interface ChipProps {
  label?: ReactNode
  start?: ReactNode
  end?: ReactNode
  removable?: boolean
  className?: string
  onRemove?: () => void
}

export function Chip({
  label,
  start,
  end,
  removable = false,
  className = '',
  onRemove,
}: ChipProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 ${className}`}
    >
      {start}

      {label !== undefined && (
        <span>{label}</span>
      )}

      {end}

      {removable && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove"
          className="cursor-pointer"
        >
          ×
        </button>
      )}
    </div>
  )
}