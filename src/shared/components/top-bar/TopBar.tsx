import type { ReactNode } from 'react'

import { Toolbar as PrimeToolbar } from 'primereact/toolbar'

export interface TopBarProps {
  start?: ReactNode
  center?: ReactNode
  end?: ReactNode
  className?: string
}

export function TopBar({
  start,
  center,
  end,
  ...props
}: TopBarProps) {
  return (
    <PrimeToolbar
      {...props}
      className={`!rounded-none ${props.className ?? ''}`}
      start={start}
      center={center}
      end={end}
    />
  )
}
