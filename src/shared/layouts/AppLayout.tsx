import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Button } from 'primereact/button'
import { Tooltip } from 'primereact/tooltip'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import isotipo from '../../assets/isotipo.png'
import logotipo from '../../assets/logotipo.png'
import { useAuthStore } from '../../core/auth/auth.store'
import { useCurrentUser } from '../../core/auth/useCurrentUser'
import { SearchBar, SideMenu, TopBar } from '../components'
import { UserMenu } from '../components/user-menu'

export interface AppLayoutOutletContext {
  search: string
  setSearch: (search: string) => void
}

interface LayoutMenuItem {
  id: string
  label: string
  icon: ReactNode
  path?: string
}

const homeItem: LayoutMenuItem = { id: 'home', label: 'Inicio', icon: <i className="pi pi-home" />, path: '/' }
const exploreItem: LayoutMenuItem = { id: 'explore', label: 'Buscar zona', icon: <i className="pi pi-compass" />, path: '/explorar' }
const guestAnalysisItem: LayoutMenuItem = { id: 'analysis', label: 'Mi análisis', icon: <i className="pi pi-chart-bar" />, path: '/analisis' }
const detailedAnalysisItem: LayoutMenuItem = {
  id: 'detailed-analysis',
  label: 'Mi análisis detallado',
  icon: <i className="pi pi-sliders-h" />,
  path: '/analisis-detallado',
}
const comparisonsItem: LayoutMenuItem = { id: 'comparisons', label: 'Comparaciones', icon: <i className="pi pi-chart-line" /> }
const savedItem: LayoutMenuItem = { id: 'saved', label: 'Zonas guardadas', icon: <i className="pi pi-bookmark" />, path: '/zonas' }

// "Mi análisis" es para invitados; "Mi análisis detallado" solo con sesión.
function buildMenuItems(isAuthenticated: boolean): LayoutMenuItem[] {
  const analysisItem = isAuthenticated ? detailedAnalysisItem : guestAnalysisItem
  return [homeItem, exploreItem, analysisItem, comparisonsItem, savedItem]
}

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, name, initials } = useCurrentUser()
  const logout = useAuthStore((state) => state.logout)
  const [collapsed, setCollapsed] = useState(false)
  const [search, setSearch] = useState('')

  const menuItems = buildMenuItems(isAuthenticated)

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 767px)')
    const syncSidebar = () => setCollapsed(mobileQuery.matches)

    syncSidebar()
    mobileQuery.addEventListener('change', syncSidebar)

    return () => mobileQuery.removeEventListener('change', syncSidebar)
  }, [])

  const showSearch = location.pathname.startsWith('/explorar')

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="flex h-dvh min-h-0 overflow-hidden bg-[#f7f8f6] text-slate-950">
      <aside
        className={`h-full shrink-0 border-r border-slate-200 bg-white transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-[240px]'
        }`}
      >
        {collapsed && (
          <Tooltip
            pt={{ text: { className: '!px-4 !py-3 !text-xs leading-4' } }}
            target=".aside-brand-toggle"
          />
        )}

        <div
          className={`h-16 shrink-0 border-b border-slate-200 transition-all duration-300 ${
            collapsed ? 'flex items-center justify-center' : 'flex items-center gap-1 px-6'
          }`}
        >
          {collapsed ? (
            <button
              aria-label="Expandir menú"
              className="aside-brand-toggle flex cursor-pointer items-center justify-center rounded transition-all duration-150 hover:opacity-75 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              data-pr-position="right"
              data-pr-tooltip="Expandir menú"
              onClick={() => setCollapsed(false)}
              type="button"
            >
              <img alt="" aria-hidden="true" className="h-7 w-auto shrink-0 select-none" decoding="async" src={isotipo} />
            </button>
          ) : (
            <>
              <Link
                aria-label="ZonaMatch, ir al inicio"
                className="flex min-w-0 flex-1 items-center rounded transition-all duration-150 hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                to="/"
              >
                <span className="flex items-center gap-1.5">
                  <img alt="" aria-hidden="true" className="h-6 w-auto shrink-0 select-none" decoding="async" src={isotipo} />
                  <img alt="" aria-hidden="true" className="h-4 w-auto shrink-0 select-none" decoding="async" src={logotipo} />
                </span>
              </Link>
              <Button
                aria-label="Colapsar menú"
                className="!h-8 !w-8 !border-0 !bg-transparent !p-0 !text-slate-500 hover:!bg-slate-100 hover:!text-slate-900 focus-visible:!outline-2 focus-visible:!outline-offset-2 focus-visible:!outline-emerald-600"
                icon="pi pi-angle-double-left"
                onClick={() => setCollapsed(true)}
                rounded
              />
            </>
          )}
        </div>

        <div className={`py-4 transition-all duration-300 ${collapsed ? 'px-2' : 'px-3'}`}>
          <SideMenu
            className="[&_.p-menu-list]:flex [&_.p-menu-list]:flex-col [&_.p-menu-list]:gap-1"
            collapsed={collapsed}
            items={menuItems.map(({ path, ...item }) => ({
              ...item,
              // The detail pages (/zonas/villa-luro) keep their section highlighted
              selected: !!path && (location.pathname === path || (path !== '/' && location.pathname.startsWith(`${path}/`))),
              onSelect: path ? () => navigate(path) : undefined,
            }))}
          />
        </div>
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <TopBar
          className="z-20 !h-16 !min-h-16 !shrink-0 !border-x-0 !border-t-0 !border-b !border-slate-200 !bg-white !px-3 !shadow-none sm:!px-6"
          start={
            showSearch ? (
              <SearchBar
                aria-label="Buscar zonas, barrios o localidades"
                className="!h-9 !min-h-0 !w-[min(420px,58vw)] !rounded-full !border-slate-200 !bg-slate-50 !px-4 !py-0 !shadow-none"
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar zonas, barrios o localidades..."
                value={search}
              />
            ) : undefined
          }
          end={
            <div className="flex items-center gap-2">
              {isAuthenticated ? (
                <>
                  <Button
                    aria-label="Notificaciones"
                    className="!h-9 !w-9 !bg-transparent !p-0 !text-slate-600 hover:!bg-slate-100"
                    icon="pi pi-bell"
                    rounded
                  />
                  <UserMenu initials={initials} name={name} onLogout={handleLogout} />
                </>
              ) : (
                <nav aria-label="Acceso a la aplicación" className="flex items-center gap-2">
                  <Button
                    className="!h-9 !rounded-full !border-0 !bg-white !px-4 !text-sm !text-[#1f4a38] hover:!bg-slate-50"
                    label="Iniciar sesión"
                    onClick={() => navigate('/login')}
                  />
                  <Button
                    className="!h-9 !rounded-full !border-[#b7e24d] !bg-[#b7e24d] !px-4 !text-sm !text-[#1f4a38] hover:!border-[#a9d63e] hover:!bg-[#a9d63e]"
                    label="Registrarse"
                    onClick={() => navigate('/register')}
                  />
                </nav>
              )}
            </div>
          }
        />
        <main className="min-h-0 min-w-0 flex-1 overflow-auto bg-[#f7f8f6] px-8 py-6 max-[1023px]:px-3 max-[1023px]:py-3">
          <Outlet context={{ search, setSearch }} />
        </main>
      </div>
    </div>
  )
}
