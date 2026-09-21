import { useState } from 'react'
import { Button } from 'primereact/button'
import { Outlet, useNavigate } from 'react-router-dom'
import { SideMenu, TopBar } from '../components'

const menuItems = [
  { id: 'home', label: 'Inicio', icon: <i className="pi pi-home" />, path: '/' },
  { id: 'explore', label: 'Buscar zona', icon: <i className="pi pi-compass" />, path: '/explorar' },
  { id: 'analysis', label: 'Mi análisis', icon: <i className="pi pi-chart-bar" />, path: '/analisis' },
  { id: 'comparisons', label: 'Comparaciones', icon: <i className="pi pi-chart-line" />, path: '/comparaciones' },
  { id: 'saved', label: 'Zonas guardadas', icon: <i className="pi pi-bookmark" />, path: '/guardadas' },
]

export function AppLayout() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen min-h-[680px] flex-col overflow-hidden bg-[#f7f8f6] text-slate-950">
      <TopBar
        className="z-20 !min-h-[72px] !border-x-0 !border-t-0 !border-slate-200 !bg-white !px-6 !shadow-sm"
        start={
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <i className="pi pi-map-marker text-sm" />
            </div>
            <div>
              <p className="text-base font-semibold tracking-tight text-slate-950">ZonaMatch</p>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">
                Explorá tu zona
              </p>
            </div>
          </div>
        }
        end={
          <div className="flex items-center gap-2">
            <Button
              aria-label="Notificaciones"
              className="!h-9 !w-9 !bg-transparent !p-0 !text-slate-500 hover:!bg-slate-100"
              icon="pi pi-bell"
              rounded
            />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              LM
            </div>
          </div>
        }
      />

      <div className="flex min-h-0 flex-1">
        <aside
          className={`shrink-0 border-r border-slate-200 bg-white px-3 py-5 transition-[width] duration-200 ${
            collapsed ? 'w-[72px]' : 'w-[236px]'
          }`}
        >
          <Button
            aria-label={collapsed ? 'Abrir menú' : 'Colapsar menú'}
            className="mb-5 !h-10 !w-10 !bg-transparent !p-0 !text-slate-500 hover:!bg-slate-100"
            icon={collapsed ? 'pi pi-bars' : 'pi pi-angle-left'}
            onClick={() => setCollapsed((value) => !value)}
            rounded
          />
          {!collapsed && (
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
              Navegación
            </p>
          )}
          <SideMenu
            className={`[&_.p-menuitem-link]:flex [&_.p-menuitem-link]:items-center [&_.p-menuitem-link]:gap-3 [&_.p-menuitem-link]:rounded-xl [&_.p-menuitem-link]:px-3 [&_.p-menuitem-link]:py-3 [&_.p-menuitem-link]:text-sm [&_.p-menuitem-link]:font-medium [&_.p-menuitem-link]:text-slate-600 [&_.p-menuitem-link:hover]:bg-slate-100 [&_.p-menuitem-link:hover]:text-slate-950 ${
              collapsed ? '[&_.p-menuitem-text]:hidden' : ''
            }`}
            items={menuItems.map(({ path, ...item }) => ({
              ...item,
              onSelect: () => navigate(path),
            }))}
          />
          {!collapsed && (
            <div className="mt-8 rounded-2xl bg-emerald-50 p-4">
              <p className="text-sm font-semibold text-emerald-950">Tu zona, tus planes</p>
              <p className="mt-2 text-xs leading-5 text-emerald-800">
                Descubrí lugares nuevos y conectá con personas cerca tuyo.
              </p>
            </div>
          )}
        </aside>
        <main className="min-h-0 min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
