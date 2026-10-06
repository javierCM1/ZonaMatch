import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../button'
import isotipo from '../../../assets/isotipo.png'
import logotipo from '../../../assets/logotipo.png'

export function SiteHeader() {
  const navigate = useNavigate()

  return (
    <header className="landing-header h-[64px] border-b border-[#e8eee9] bg-white sm:h-[76px] lg:h-[94px]">
      <div className="mx-auto flex h-full max-w-[1792px] items-center justify-between px-5 sm:px-8 lg:px-16">
        <Link aria-label="ZonaMatch, inicio" className="flex items-center gap-2 sm:gap-3" to="/">
          <img alt="" aria-hidden="true" className="h-9 w-auto sm:h-12" src={isotipo} />
          <img alt="ZonaMatch" className="h-6 w-auto sm:h-8" src={logotipo} />
        </Link>
        <nav aria-label="Acceso a la aplicación" className="flex items-center gap-3">
          <div className="hidden sm:block">
            <Button
              className="!h-[46px] !rounded-full !border-[#e3e8e2] !bg-white !px-6 !text-[#1f4a38] hover:!bg-[#f6f8f5]"
              label="Iniciar sesión"
              onClick={() => navigate('/analisis')}
              variant="outlined"
            />
          </div>
          <div>
            <Button
              className="!h-[46px] !rounded-full !border-[#b7e24d] !bg-[#b7e24d] !px-6 !text-[#1f4a38] hover:!border-[#a9d63e] hover:!bg-[#a9d63e]"
              label="Empezar gratis"
              onClick={() => navigate('/analisis')}
            />
          </div>
        </nav>
      </div>
    </header>
  )
}