import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../shared/components/button'
import { SiteHeader } from '../../../shared/components/site-header'
import { SiteFooter } from '../../../shared/components/site-footer'
import homeCompareIcon from '../../../assets/home-compare.svg'
import homeHeroImage from '../../../assets/home-hero.png'
// import homePinIcon from '../../../assets/home-pin.svg'
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

const fieldClass =
  'w-full rounded-xl border border-[#e3e8e2] bg-white px-4 text-[15px] text-[#12261e] placeholder:text-[#8a9a91] focus:border-[#1f4a38] focus:outline-none focus:ring-2 focus:ring-[#1f4a38]/20'

export function LandingPage() {
  const navigate = useNavigate()
  const [sent, setSent] = useState(false)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    // TODO: enviar el email y el comentario al backend. Por ahora solo simula el envío.
    event.currentTarget.reset()
    setSent(true)
  }

  return (
    <div className="landing-root min-h-dvh bg-white text-[#12261e]">
      <SiteHeader />
      <main className="landing-main">
        {/* Hero: header + hero ocupan exactamente la pantalla (100dvh). Las alturas del header son 64 / 76 / 94 px. */}
        <section
          aria-labelledby="landing-title"
          className="relative isolate h-[calc(100dvh-64px)] min-h-[520px] overflow-hidden sm:h-[calc(100dvh-76px)] lg:h-[calc(100dvh-94px)]"
        >
          <img
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[52%_center]"
            src={homeHeroImage}
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,34,31,0.34)_0%,rgba(5,34,31,0.12)_48%,rgba(5,34,31,0.06)_100%)]" />
          <div className="landing-hero-inner mx-auto grid h-full min-h-0 max-w-[1792px] grid-cols-1 content-center px-5 py-6 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-0 lg:pl-0 lg:pr-16">
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

        {/* Beneficios */}
        <section
          aria-label="Beneficios de ZonaMatch"
          className="landing-benefits bg-white px-5 py-10 sm:px-8 lg:px-16 lg:py-14"
          id="beneficios"
        >
          <div className="landing-benefit-grid mx-auto grid max-w-[1792px] gap-4 lg:grid-cols-3 lg:gap-6">
            {benefits.map((benefit) => (
              <article
                className={`landing-benefit-card flex items-center gap-3 rounded-xl px-4 py-3 lg:min-h-[163px] lg:flex-col lg:items-stretch lg:rounded-2xl lg:p-6 ${benefit.background}`}
                key={benefit.title}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white lg:h-11 lg:w-11 lg:rounded-2xl">
                  <img alt="" height="24" src={benefit.icon} width="24" />
                </div>
                <div className="min-w-0 lg:mt-2.5">
                  <h2 className="text-[15px] font-semibold leading-5 text-[#12261e] lg:text-[17px] lg:leading-6">
                    {benefit.title}
                  </h2>
                  <p className="mt-0.5 text-[13px] leading-5 text-[#586a61] lg:mt-1.5 lg:text-sm">
                    {benefit.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Contacto */}
        <section
          aria-labelledby="contacto-title"
          className="landing-contact bg-[#f7f8f6] px-5 py-12 sm:px-8 lg:px-16 lg:py-16"
          id="contacto"
        >
          <div className="mx-auto max-w-[640px]">
            <h2 className="text-2xl font-bold text-[#1f4a38] lg:text-3xl" id="contacto-title">
              Contacto
            </h2>
            <p className="mt-2 text-[15px] leading-6 text-[#586a61]">
              ¿Tenés una duda o una sugerencia? Dejanos tu email y tu comentario.
            </p>
            <form className="mt-6 flex flex-col gap-4" onChange={() => setSent(false)} onSubmit={handleSubmit}>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#12261e]" htmlFor="contact-email">
                  Email
                </label>
                <input
                  autoComplete="email"
                  className={`${fieldClass} h-12`}
                  id="contact-email"
                  name="email"
                  placeholder="tu@email.com"
                  required
                  type="email"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#12261e]" htmlFor="contact-message">
                  Comentario
                </label>
                <textarea
                  className={`${fieldClass} min-h-[120px] resize-y py-3`}
                  id="contact-message"
                  maxLength={1000}
                  name="message"
                  placeholder="Contanos en qué podemos ayudarte"
                  required
                  rows={4}
                />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  className="inline-flex h-[46px] items-center justify-center rounded-full border border-[#b7e24d] bg-[#b7e24d] px-6 text-[15px] font-semibold text-[#1f4a38] transition-colors hover:border-[#a9d63e] hover:bg-[#a9d63e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f4a38] focus-visible:ring-offset-2"
                  type="submit"
                >
                  Enviar
                </button>
                <p aria-live="polite" className="text-sm font-medium text-[#1f4a38]">
                  {sent ? '¡Gracias por tu mensaje!' : ''}
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* Legales (colapsable) */}
        <section
          aria-label="Información legal"
          className="landing-legal bg-white px-5 py-10 sm:px-8 lg:px-16"
          id="legales"
        >
          <details className="group mx-auto max-w-[860px] rounded-2xl border border-[#e3e8e2] bg-white px-5 py-4 lg:px-6">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold text-[#12261e] [&::-webkit-details-marker]:hidden">
              Legales
              <svg
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-[#586a61] transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className="mt-3 space-y-3 text-[14px] leading-6 text-[#586a61]">
              <p>
                Texto provisional. Acá va a ir la información legal de ZonaMatch: el origen de los
                datos, el alcance del servicio y las condiciones de uso. Los resultados son
                orientativos y no reemplazan el asesoramiento profesional.
              </p>
              <p>
                Podés leer los{' '}
                <Link className="font-medium text-[#1f4a38] underline" to="/terminos">
                  Términos de Servicio
                </Link>{' '}
                y la{' '}
                <Link className="font-medium text-[#1f4a38] underline" to="/privacidad">
                  Política de Privacidad
                </Link>{' '}
                completos.
              </p>
            </div>
          </details>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
