import { useEffect, useState } from 'react'
import { Button } from 'primereact/button'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { SearchBar, SideMenu, TopBar } from '../components'

export interface AppLayoutOutletContext {
  search: string
  setSearch: (search: string) => void
}

const menuItems = [
  { id: 'home', label: 'Inicio', icon: <i className="pi pi-home" />, path: '/' },
  { id: 'explore', label: 'Buscar zona', icon: <i className="pi pi-compass" />, path: '/explorar' },
  { id: 'analysis', label: 'Mi análisis', icon: <i className="pi pi-chart-bar" />, path: '/analisis' },
  { id: 'comparisons', label: 'Comparaciones', icon: <i className="pi pi-chart-line" />, path: '/comparaciones' },
  { id: 'saved', label: 'Zonas guardadas', icon: <i className="pi pi-bookmark" />, path: '/guardadas' },
]

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const syncSidebar = () => setCollapsed(mobileQuery.matches)

    syncSidebar()
    mobileQuery.addEventListener('change', syncSidebar)

    return () => mobileQuery.removeEventListener('change', syncSidebar)
  }, [])

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#f7f8f6] text-slate-950">
      <TopBar
        className="z-20 !h-[74px] !min-h-[74px] !border-x-0 !border-t-0 !border-white/20 !bg-linear-to-r !from-[#1f4a38] !to-[#b7d5c0] !px-3 !shadow-none sm:!px-6"
        start={
          <div className="flex min-w-0 items-center gap-3 text-white">
            <Button
              aria-label={collapsed ? 'Abrir menú' : 'Colapsar menú'}
              className="!h-9 !w-9 !shrink-0 !bg-transparent !p-0 !text-white hover:!bg-white/15"
              icon="pi pi-bars"
              onClick={() => setCollapsed((value) => !value)}
              rounded
            />
            <div className="flex items-center gap-2.5 whitespace-nowrap text-[17px] font-bold sm:text-xl">
              <i aria-hidden="true" className="pi pi-map-marker text-xl" />
              ZonaMatch
            </div>
          </div>
        }
        center={
          <SearchBar
            aria-label="Buscar zonas, barrios o localidades"
            className="!h-8 !min-h-0 !w-[min(420px,38vw)] !rounded-full !border-white/50 !bg-white/85 !px-4 !py-0 !shadow-none"
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar zonas, barrios o localidades..."
            value={search}
          />
        }
        end={
          <div className="flex items-center gap-2">
            <Button
              aria-label="Notificaciones"
              className="!h-9 !w-9 !bg-transparent !p-0 !text-white hover:!bg-white/15"
              icon="pi pi-bell"
              rounded
            />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-[13px] font-medium text-[#1f4a38]">
              VP
            </div>
          </div>
        }
      />

      <div className="flex min-h-0 flex-1">
        <aside
          className={`shrink-0 border-r border-[#e3e8e2] bg-white px-[14px] py-6 transition-[width] duration-200 ${
            collapsed ? 'w-[72px]' : 'w-[240px]'
          }`}
        >
          <SideMenu
            className="[&_.p-menu-list]:flex [&_.p-menu-list]:flex-col [&_.p-menu-list]:gap-1"
            collapsed={collapsed}
            items={menuItems.map(({ path, ...item }) => ({
              ...item,
              selected: location.pathname === path,
              onSelect: () => navigate(path),
            }))}
          />
        </aside>
        <main className="min-h-0 min-w-0 flex-1 overflow-auto bg-[#f7f8f6] px-8 py-6 max-[1023px]:px-3 max-[1023px]:py-3">
          <Outlet context={{ search, setSearch }} />
        </main>
      </div>
    </div>
  )
}
