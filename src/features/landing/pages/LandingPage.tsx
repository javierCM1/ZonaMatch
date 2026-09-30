import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../shared/components/button'
import homeCompareIcon from '../../../assets/home-compare.svg'
import homeHeroImage from '../../../assets/home-hero.png'
import homePinIcon from '../../../assets/home-pin.svg'
import homeShieldIcon from '../../../assets/home-shield.svg'
import homeSlidersIcon from '../../../assets/home-sliders.svg'

const benefits = [
  {
    title: 'Datos reales, no promesas',
    description: 'Seguridad, movilidad, servicios y ambiente con fuente y fecha visibles.',
    icon: homeShieldIcon,
    background: 'bg-[#f2faf3]',
  },
  {
    title: 'Personalización real',
    description: 'Definí qué te importa y cuánto: el resultado se ordena según tu vida.',
    icon: homeSlidersIcon,
    background: 'bg-[#fceed0]',
  },
  {
    title: 'Compará sin vueltas',
    description: 'Poné dos o más zonas lado a lado y viví los trade-offs, no solo el puntaje.',
    icon: homeCompareIcon,
    background: 'bg-[#e4eefc]',
  },
]

export function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="landing-root grid h-dvh min-h-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden bg-white text-[#12261e]">
      <header className="landing-header h-[64px] border-b border-[#e8eee9] bg-white sm:h-[76px] lg:h-[94px]">
        <div className="mx-auto flex h-full max-w-[1792px] items-center justify-between px-5 lg:px-0">
          <Link aria-label="ZonaMatch, inicio" className="flex items-center gap-2.5" to="/">
            <img alt="" height="24" src={homePinIcon} width="24" />
            <span className="text-xl font-bold text-[#1f4a38]">ZonaMatch</span>
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
      <main className="landing-main grid min-h-0 grid-rows-[minmax(0,1fr)_clamp(190px,25dvh,242px)] lg:grid-rows-[minmax(0,1fr)_242px]">
        <section
          aria-labelledby="landing-title"
          className="relative isolate min-h-0 overflow-hidden"
        >
          <img
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[52%_center]"
            src={homeHeroImage}
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,34,31,0.34)_0%,rgba(5,34,31,0.12)_48%,rgba(5,34,31,0.06)_100%)]" />
          <div className="landing-hero-inner mx-auto grid h-full min-h-0 max-w-[1792px] grid-cols-1 content-start px-5 py-3 sm:px-6 lg:grid-cols-2 lg:content-normal lg:px-0 lg:pb-0 lg:pt-[42px]">
            <div className="landing-hero-copy max-w-[360px] lg:ml-[89px]">
              <p className="inline-flex min-h-6 items-center rounded-full bg-[#edf7ee] px-3.5 text-[11px] font-semibold text-[#1f4a38] lg:min-h-[30px] lg:px-4 lg:text-[13px]">
                Encontrá dónde vivir, con datos reales
              </p>
              <h1
                className="landing-title mt-3 text-[30px] font-bold leading-[1.1] text-white sm:text-[34px] lg:mt-[56px] lg:text-[48px] lg:leading-[1.25]"
                id="landing-title"
              >
                <span className="block">Tu próxima</span>
                <span className="block">zona, elegida</span>
                <span className="block">con criterio.</span>
              </h1>
              <p className="landing-copy mt-2 max-w-[344px] text-[13px] leading-[18px] text-white sm:text-[14px] lg:mt-[56px] lg:text-[17px] lg:leading-[21px]">
                ZonaMatch cruza seguridad, movilidad, vivienda y tus prioridades personales para
                mostrarte qué barrios de CABA y GBA realmente encajan con tu vida.
              </p>
              <div className="landing-mobile-actions mt-3 flex flex-wrap gap-2 lg:hidden">
                <Button
                  className="!h-10 !rounded-full !border-[#b7e24d] !bg-[#b7e24d] !px-4 !text-[14px] !text-[#1f4a38]"
                  label="Empezar mi análisis"
                  onClick={() => navigate('/analisis')}
                />
                <a
                  className="inline-flex h-10 items-center justify-center rounded-full border border-white bg-transparent px-4 text-[14px] font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                  href="#beneficios"
                >
                  Ver cómo funciona
                </a>
              </div>
            </div>
            <div className="hidden flex-col items-stretch gap-[9px] justify-self-end self-center lg:flex lg:mr-0">
              <Button
                className="!h-[43px] !w-[187px] !rounded-full !border-[#b7e24d] !bg-[#b7e24d] !px-4 !text-[#1f4a38] hover:!border-[#a9d63e] hover:!bg-[#a9d63e]"
                label="Empezar mi análisis"
                onClick={() => navigate('/analisis')}
              />
              <a
                className="inline-flex h-[46px] w-[187px] items-center justify-center rounded-full border border-white bg-transparent px-4 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                href="#beneficios"
              >
                Ver cómo funciona
              </a>
            </div>
          </div>
        </section>

        <section aria-label="Beneficios de ZonaMatch" className="landing-benefits min-h-0 bg-white px-5 py-2 lg:h-[242px] lg:px-16 lg:py-10" id="beneficios">
          <div className="landing-benefit-grid mx-auto grid h-full min-h-0 max-w-[1792px] grid-rows-3 gap-1 lg:grid-cols-3 lg:grid-rows-1 lg:gap-6">
            {benefits.map((benefit) => (
              <article
                className={`landing-benefit-card flex min-h-0 items-center gap-3 rounded-xl px-3 py-1.5 lg:min-h-[163px] lg:flex-col lg:items-stretch lg:rounded-2xl lg:p-6 ${benefit.background}`}
                key={benefit.title}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white lg:h-11 lg:w-11 lg:rounded-2xl">
                  <img alt="" height="24" src={benefit.icon} width="24" />
                </div>
                <div className="min-w-0 lg:mt-2.5">
                  <h2 className="text-[13px] font-semibold leading-4 text-[#12261e] lg:text-[17px] lg:leading-6">
                    {benefit.title}
                  </h2>
                  <p className="mt-0.5 line-clamp-2 text-[12px] leading-[14px] text-[#586a61] lg:mt-1.5 lg:text-sm lg:leading-5">
                    {benefit.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="landing-footer min-h-[44px] border-t border-[#e8eee9] bg-white px-5 py-2 lg:h-[65px] lg:px-16 lg:py-0">
        <div className="landing-footer-inner mx-auto flex min-h-[44px] max-w-[1792px] flex-col justify-center gap-2 text-[11px] font-medium text-[#8a9a91] sm:flex-row sm:items-center sm:justify-between sm:text-[13px] lg:min-h-[65px]">
          <p>© 2026 ZonaMatch — Encontrá tu zona ideal</p>
          <nav aria-label="Enlaces legales" className="flex items-center gap-6">
            <a className="hover:text-[#1f4a38]" href="#privacidad">Privacidad</a>
            <a className="hover:text-[#1f4a38]" href="#terminos">Términos</a>
            <a className="hover:text-[#1f4a38]" href="mailto:hola@zonamatch.com">Contacto</a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
