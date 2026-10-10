import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../../shared/components/button'
import { Reveal } from '../../../shared/components/reveal'
import { SiteHeader } from '../../../shared/components/site-header'
import { SiteFooter } from '../../../shared/components/site-footer'
import homeCompareIcon from '../../../assets/home-compare.svg'
import homeHeroImage from '../../../assets/home-hero.png'
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
    <div className="min-h-dvh bg-white text-[#12261e]">
      <SiteHeader />
      <main>
        {/* Hero: header + hero ocupan exactamente la pantalla (100dvh). Alturas del header: 64 / 76 / 94 px.
            Celular y tablet: todo centrado. Escritorio (1024px o más): texto a la izquierda y botones a la derecha. */}
        <section
          aria-labelledby="landing-title"
          className="relative isolate h-[calc(100dvh-64px)] min-h-[560px] overflow-hidden sm:h-[calc(100dvh-76px)] lg:h-[calc(100dvh-94px)]"
        >
          <img
            alt=""
            className="absolute inset-0 -z-20 h-full w-full object-cover object-[52%_center]"
            src={homeHeroImage}
          />
          <div className="absolute inset-0 -z-10 bg-[#05221f]/35 lg:hidden" />
          <div className="absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,rgba(5,34,31,0.34)_0%,rgba(5,34,31,0.12)_48%,rgba(5,34,31,0.06)_100%)] lg:block" />
          <div className="mx-auto grid h-full max-w-[1792px] grid-cols-1 content-center justify-items-center px-6 py-8 text-center lg:grid-cols-2 lg:content-normal lg:items-center lg:justify-items-stretch lg:px-0 lg:py-0 lg:pr-16 lg:text-left">
            <div className="flex flex-col items-center lg:ml-[89px] lg:max-w-[360px] lg:items-start">
              <Reveal>
                <p className="inline-flex min-h-6 items-center rounded-full bg-[#edf7ee] px-3.5 text-[11px] font-semibold text-[#1f4a38] lg:min-h-[30px] lg:px-4 lg:text-[13px]">
                  Encontrá dónde vivir, con datos reales
                </p>
              </Reveal>
              <Reveal className="mt-4 lg:mt-[56px]" delay={120}>
                <h1
                  className="text-[32px] font-bold leading-[1.1] text-white sm:text-[40px] lg:text-[48px] lg:leading-[1.25]"
                  id="landing-title"
                >
                  <span className="block">Tu próxima</span>
                  <span className="block">zona, elegida</span>
                  <span className="block">con criterio.</span>
                </h1>
              </Reveal>
              <Reveal className="mt-4 lg:mt-[56px]" delay={240}>
                <p className="max-w-[460px] text-[14px] leading-5 text-white lg:max-w-[344px] lg:text-[17px] lg:leading-[21px]">
                  ZonaMatch cruza seguridad, movilidad, vivienda y tus prioridades personales para
                  mostrarte qué barrios de CABA y GBA realmente encajan con tu vida.
                </p>
              </Reveal>
              {/* Botones en celular y tablet: en fila, centrados, debajo del texto */}
              <Reveal className="mt-6 lg:hidden" delay={360}>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Button
                    className="!h-11 !min-w-[187px] !rounded-full !border-[#b7e24d] !bg-[#b7e24d] !px-6 !text-[#1f4a38]"
                    label="Empezar mi análisis"
                    onClick={() => navigate('/analisis')}
                  />
                  <a
                    className="inline-flex h-11 min-w-[187px] items-center justify-center rounded-full border border-white bg-transparent px-6 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
                    href="#beneficios"
                  >
                    Ver cómo funciona
                  </a>
                </div>
              </Reveal>
            </div>
            {/* Botones en escritorio: apilados, a la derecha */}
            <Reveal className="hidden self-center justify-self-end lg:block" delay={360}>
              <div className="flex flex-col items-stretch gap-[9px]">
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
            </Reveal>
          </div>
        </section>

        {/* Beneficios */}
        <section
          aria-label="Beneficios de ZonaMatch"
          className="bg-white px-8 py-12 sm:px-12 lg:px-16 lg:py-14"
          id="beneficios"
        >
          <div className="mx-auto grid max-w-[1792px] gap-5 lg:grid-cols-3 lg:gap-6">
            {benefits.map((benefit, index) => (
              <Reveal className="h-full" delay={index * 120} key={benefit.title}>
                <article
                  className={`flex h-full items-center gap-4 rounded-2xl px-5 py-5 lg:min-h-[163px] lg:flex-col lg:items-stretch lg:gap-0 lg:p-6 ${benefit.background}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white lg:h-11 lg:w-11 lg:rounded-2xl">
                    <img alt="" height="24" src={benefit.icon} width="24" />
                  </div>
                  <div className="min-w-0 lg:mt-3">
                    <h2 className="text-[16px] font-semibold leading-6 text-[#12261e] lg:text-[17px]">
                      {benefit.title}
                    </h2>
                    <p className="mt-1 text-[14px] leading-5 text-[#586a61]">{benefit.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Contacto */}
        <section
          aria-labelledby="contacto-title"
          className="bg-[#f7f8f6] px-8 py-12 sm:px-12 lg:px-16 lg:py-16"
          id="contacto"
        >
          <Reveal className="mx-auto max-w-[640px]">
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
          </Reveal>
        </section>

        {/* Legales (colapsable) */}
        <section aria-label="Información legal" className="bg-white px-8 py-10 sm:px-12 lg:px-16" id="legales">
          <Reveal className="mx-auto max-w-[860px]">
            <details className="group rounded-2xl border border-[#e3e8e2] bg-white px-5 py-4 lg:px-6">
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
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}