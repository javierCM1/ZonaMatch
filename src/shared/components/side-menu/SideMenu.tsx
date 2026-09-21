import type { ReactNode } from 'react'

import { Menu as PrimeMenu } from 'primereact/menu'
import type { MenuItem } from 'primereact/menuitem'

export interface SideMenuItem {
  id: string
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
  items?: SideMenuItem[]
  onSelect?: () => void
}

export interface SideMenuProps {
  items: SideMenuItem[]
  className?: string
}

function mapItems(items: SideMenuItem[]): MenuItem[] {
  return items.map((item) => ({
    key: item.id,
    label: typeof item.label === 'string' ? item.label : undefined,
    icon: undefined,
    disabled: item.disabled,
    items: item.items ? mapItems(item.items) : undefined,
    command: item.onSelect
      ? () => item.onSelect?.()
      : undefined,
  }))
}

export function SideMenu({
  items,
  className,
}: SideMenuProps) {
  return (
    <PrimeMenu
      model={mapItems(items)}
      className={className}
    />
  )
}