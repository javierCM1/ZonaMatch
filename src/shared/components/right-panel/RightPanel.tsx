import type { ReactNode } from 'react'
import { Button } from 'primereact/button'
import { Panel } from '../panel'

export interface RightPanelProps {
  title: ReactNode
  subtitle?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  onClose?: () => void
  className?: string
}

export function RightPanel({
  title,
  subtitle,
  children,
  footer,
  onClose,
  className = '',
}: RightPanelProps) {
  return (
    <aside className={`flex h-full min-h-0 flex-col bg-white ${className}`}>
      <Panel
        className="flex min-h-0 flex-1 flex-col !rounded-none !border-0 !shadow-none"
        header={
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
              {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>
            {onClose && (
              <Button
                aria-label="Cerrar panel"
                className="!h-8 !w-8 !bg-transparent !p-0 !text-slate-500 hover:!bg-slate-100"
                icon="pi pi-times"
                onClick={onClose}
                rounded
              />
            )}
          </div>
        }
      >
        <div className="flex h-full min-h-0 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
          {footer && <div className="mt-6 border-t border-slate-100 pt-4">{footer}</div>}
        </div>
      </Panel>
    </aside>
  )
}