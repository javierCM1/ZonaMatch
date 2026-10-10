import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../button'
import isotipo from '../../../assets/isotipo.png'
import logotipo from '../../../assets/logotipo.png'

const iconButtonClass =
  'flex h-10 w-10 items-center justify-center rounded-full border text-[#1f4a38] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4a38] focus-visible:ring-offset-2'

const iconProps = {
  'aria-hidden': true,
  fill: 'none',
  height: 20,
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 2,
  viewBox: '0 0 24 24',
  width: 20,
} as const

export function SiteHeader() {
  const navigate = useNavigate()

  return (
    <header className="h-[64px] border-b border-[#e8eee9] bg-white sm:h-[76px] lg:h-[94px]">
      <div className="mx-auto flex h-full max-w-[1792px] items-center justify-between px-5 sm:px-8 lg:px-16">
        <Link aria-label="ZonaMatch, inicio" className="flex items-center gap-2 sm:gap-3" to="/">
          <img alt="" aria-hidden="true" className="h-9 w-auto sm:h-12" src={isotipo} />
          <img alt="ZonaMatch" className="h-6 w-auto sm:h-8" src={logotipo} />
        </Link>

        {/* responsive */}
        <nav aria-label="Acceso a la aplicación" className="flex items-center gap-2 sm:hidden">
          <Link
            aria-label="Iniciar sesión"
            className={`${iconButtonClass} border-[#e3e8e2] bg-white hover:bg-[#f6f8f5]`}
            to="/login"
          >
            <svg {...iconProps}>
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>
          <Link
            aria-label="Registrarse"
            className={`${iconButtonClass} border-[#b7e24d] bg-[#b7e24d] hover:border-[#a9d63e] hover:bg-[#a9d63e]`}
            to="/register"
          >
            <svg {...iconProps}>
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" x2="19" y1="8" y2="14" />
              <line x1="22" x2="16" y1="11" y2="11" />
            </svg>
          </Link>
        </nav>

        {/* tablet y desktop */}
        <nav aria-label="Acceso a la aplicación" className="hidden items-center gap-3 sm:flex">
          <Button
            className="!h-[46px] !rounded-full !border-[#e3e8e2] !bg-white !px-6 !text-[#1f4a38] hover:!bg-[#f6f8f5]"
            label="Iniciar sesión"
            onClick={() => navigate('/login')}
            variant="outlined"
          />
          <Button
            className="!h-[46px] !rounded-full !border-[#b7e24d] !bg-[#b7e24d] !px-6 !text-[#1f4a38] hover:!border-[#a9d63e] hover:!bg-[#a9d63e]"
            label="Empezar gratis"
            onClick={() => navigate('/analisis')}
          />
        </nav>
      </div>
    </header>
  )
}