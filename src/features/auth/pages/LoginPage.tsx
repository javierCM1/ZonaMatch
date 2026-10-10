import { Link } from 'react-router-dom'
import { LoginForm } from '../components/LoginForm'
import { AUTH_IMAGE_URL } from '../auth.config'
import { BrandLogo } from '../../../shared/components/brand-logo'

export function LoginPage() {
  return (
    <main className="grid min-h-dvh bg-white text-[#14201a] lg:grid-cols-[minmax(390px,0.42fr)_minmax(0,0.58fr)]">
      <section className="flex min-h-dvh flex-col px-6 py-7 sm:px-10 lg:px-14 xl:px-20">
        <Link aria-label="Ir al inicio" className="mx-auto flex w-fit items-center" to="/">
          <BrandLogo className="h-16 w-[120px]" />
        </Link>

        <div className="mx-auto flex w-full max-w-[390px] flex-1 flex-col justify-center py-12">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#5d8a39]">
              Qué bueno verte de nuevo
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[#14201a] sm:text-[34px]">
              Iniciar sesión
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#68756d]">
              Ingresá a tu cuenta para seguir encontrando tu lugar ideal.
            </p>
          </div>

          <LoginForm />

          <p className="mt-6 text-center text-sm text-[#68756d]">
            ¿Todavía no tenés cuenta?{' '}
            <Link className="font-semibold text-[#47742e] underline underline-offset-2" to="/register">
              Registrate
            </Link>
          </p>
        </div>
      </section>

      <aside
        aria-label="Encontrá tu lugar ideal con ZonaMatch"
        className="relative hidden min-h-dvh overflow-hidden bg-[#e8eee8] lg:block"
      >
        {AUTH_IMAGE_URL && (
          <img
            alt="Una casa y sus llaves, símbolo de un nuevo hogar"
            className="absolute inset-0 h-full w-full object-cover"
            src={AUTH_IMAGE_URL}
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[#14201a]/20 via-transparent to-transparent"
        />
      </aside>
    </main>
  )
}
