import { Link } from 'react-router-dom'
import { BrandLogo } from '../../../shared/components/brand-logo'
import { AUTH_IMAGE_URL } from '../auth.config'
import { RegisterForm } from '../components/RegisterForm'

export function RegisterPage() {
  return (
    <main className="grid min-h-dvh bg-white text-[#14201a] lg:grid-cols-[minmax(390px,0.42fr)_minmax(0,0.58fr)]">
      <section className="flex min-h-dvh flex-col px-6 py-5 sm:px-10 lg:px-14 xl:px-20">
        <Link aria-label="Ir al inicio" className="mx-auto flex w-fit items-center" to="/">
          <BrandLogo className="h-16 w-[120px]" />
        </Link>

        <div className="mx-auto flex w-full max-w-[390px] flex-1 flex-col justify-center py-6">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#5d8a39]">
              Encontrá tu lugar
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[#14201a] sm:text-[34px]">
              Crea tu cuenta
            </h1>
            <p className="mt-2 text-sm leading-5 text-[#68756d]">
              Regístrate y empezá a encontrar la zona ideal para vos.
            </p>
          </div>

          <RegisterForm />

          <p className="mt-4 text-center text-xs leading-4 text-[#87928b]">
            Tus datos se utilizarán únicamente para ofrecerte los servicios de ZonaMatch.
          </p>
          <p className="mt-3 text-center text-sm text-[#68756d]">
            ¿Ya tenés cuenta?{' '}
            <Link className="font-semibold text-[#47742e] underline underline-offset-2" to="/login">
              Iniciá sesión
            </Link>
          </p>
        </div>
      </section>

      <aside aria-label="ZonaMatch te ayuda a encontrar tu lugar ideal" className="relative hidden min-h-dvh overflow-hidden bg-[#e8eee8] lg:block">
        {AUTH_IMAGE_URL && (
          <img
            alt="Interior luminoso de una vivienda"
            className="absolute inset-0 h-full w-full object-cover"
            src={AUTH_IMAGE_URL}
          />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#14201a]/20 via-transparent to-transparent" />
      </aside>
    </main>
  )
}
