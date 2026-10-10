import { useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { Menu } from 'primereact/menu'
import type { MenuItem } from 'primereact/menuitem'

export interface UserMenuProps {
  initials: string
  name?: string | null
  onLogout: () => void
}

export function UserMenu({ initials, name, onLogout }: UserMenuProps) {
  const menuRef = useRef<Menu>(null)
  const [open, setOpen] = useState(false)

  const items: MenuItem[] = [
    ...(name
      ? [
          {
            label: name,
            disabled: true,
            template: () => (
              <div className="border-b border-[#e3e8e2] px-4 py-3">
                <p className="text-xs text-[#68756d]">Sesión iniciada como</p>
                <p className="mt-0.5 max-w-[200px] truncate text-sm font-semibold text-[#1f4a38]">{name}</p>
              </div>
            ),
          },
        ]
      : []),
    {
      label: 'Cerrar sesión',
      icon: 'pi pi-sign-out',
      command: onLogout,
      template: (item, options) => (
        <button
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-[#e6f3e9] hover:text-[#1f4a38] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4a38]"
          onClick={options.onClick}
          role="menuitem"
          type="button"
        >
          <i aria-hidden="true" className={item.icon} />
          {item.label}
        </button>
      ),
    },
  ]

  function toggle(event: MouseEvent<HTMLButtonElement>) {
    menuRef.current?.toggle(event)
  }

  return (
    <>
      <Menu
        className="!min-w-[200px] !rounded-xl !border !border-[#e3e8e2] !bg-white !p-1 !shadow-lg"
        id="user-menu"
        model={items}
        onHide={() => setOpen(false)}
        onShow={() => setOpen(true)}
        popup
        ref={menuRef}
      />
      <button
        aria-controls="user-menu"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={name ? `Menú de usuario de ${name}` : 'Menú de usuario'}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-[13px] font-medium text-[#1f4a38] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1f4a38]"
        onClick={toggle}
        type="button"
      >
        {initials}
      </button>
    </>
  )
}
