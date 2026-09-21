import { Button } from 'primereact/button'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link className="text-xl font-semibold tracking-tight text-blue-700" to="/">
            ZonaMatch
          </Link>
          <Link className="text-sm font-medium text-slate-600 hover:text-blue-700" to="/explorar">
            Explorar
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">
        <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
              Plataforma de encuentros
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Encontrá tu próximo match en la zona.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              El punto de partida de ZonaMatch ya está listo para crecer por features, con una base
              tipada y preparada para datos reales.
            </p>
            <Link to="/explorar">
              <Button className="mt-8" label="Explorar" icon="pi pi-arrow-right" iconPos="right" />
            </Link>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-8">
            <p className="text-sm font-medium text-blue-700">Estado del proyecto</p>
            <p className="mt-3 text-3xl font-semibold text-slate-950">Base lista</p>
            <p className="mt-2 text-slate-600">
              Router, providers, Tailwind, PrimeReact y capas de datos configuradas.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
