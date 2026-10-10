import type { ReactNode } from 'react'
import { Menu as PrimeMenu } from 'primereact/menu'
import type { MenuItem } from 'primereact/menuitem'
import { Tooltip } from 'primereact/tooltip'

export interface SideMenuItem {
  id: string
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
  selected?: boolean
  items?: SideMenuItem[]
  onSelect?: () => void
}

export interface SideMenuProps {
  items: SideMenuItem[]
  className?: string
  collapsed?: boolean
}

function mapItems(items: SideMenuItem[], collapsed: boolean): MenuItem[] {
  return items.map((item) => ({
    id: item.id,
    label: typeof item.label === 'string' ? item.label : item.id,
    disabled: item.disabled,
    items: item.items ? mapItems(item.items, collapsed) : undefined,
    command: item.onSelect
      ? () => item.onSelect?.()
      : undefined,
    template: (_menuItem, options) => {
      const tooltipLabel = typeof item.label === 'string' ? item.label : item.id

      return (
        <a
          aria-label={collapsed ? tooltipLabel : undefined}
          aria-disabled={item.disabled || undefined}
          className={`${options.className} flex min-h-11 items-center gap-3 rounded-xl py-3 text-sm font-medium transition-colors hover:bg-slate-100 hover:text-slate-950 ${
            item.selected ? 'bg-[#e6f3e9] text-[#1f4a38]' : 'text-slate-600'
          } ${
            collapsed ? 'side-menu-item-tooltip justify-center px-0' : 'px-3'
          }`}
          data-pr-position="right"
          data-pr-tooltip={collapsed ? tooltipLabel : undefined}
          href="#"
          onClick={(event) => {
            event.preventDefault()
            options.onClick(event)
          }}
          tabIndex={item.disabled ? -1 : undefined}
        >
          {item.icon && <span className="flex h-5 w-5 shrink-0 items-center justify-center text-base">{item.icon}</span>}
          {!collapsed && <span className="truncate">{item.label}</span>}
        </a>
      )
    },
  }))
}

export function SideMenu({
  items,
  className,
  collapsed = false,
}: SideMenuProps) {
  return (
    <>
      {collapsed && (
        <Tooltip
          pt={{ text: { className: '!px-4 !py-3 !text-xs leading-4' } }}
          target=".side-menu-item-tooltip"
        />
      )}
      <PrimeMenu
        model={mapItems(items, collapsed)}
        className={`w-full border-0 bg-transparent p-0 ${className ?? ''}`}
      />
    </>
  )
}
