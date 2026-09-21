import type { ReactNode } from 'react'

import { Panel as PrimePanel } from 'primereact/panel'
import type { PanelProps as PrimePanelProps } from 'primereact/panel'

export interface PanelProps
  extends Omit<PrimePanelProps, 'header'> {
  header?: ReactNode
  children?: ReactNode
}

export function Panel({
  header,
  children,
  ...props
}: PanelProps) {
  return (
    <PrimePanel
      {...props}
      header={header}
    >
      {children}
    </PrimePanel>
  )
}