import { SiteFooter } from '../../../shared/components/site-footer'
import { SiteHeader } from '../../../shared/components/site-header'

// BORRADOR: texto provisional para probar el header/footer unificados.
// Revisarlo con el equipo (y, de ser posible, con alguien que sepa de temas legales) antes de publicarlo.
const lastUpdated = '4 de octubre de 2026'

const sections = [
  {
    title: '1. Sobre ZonaMatch',
    paragraphs: [
      'ZonaMatch es una aplicación que te ayuda a comparar zonas de CABA y GBA para mudarte. Cruza datos de seguridad, movilidad, servicios y vivienda con las prioridades que definís vos, y te muestra qué zonas encajan mejor con tu vida.',
      'ZonaMatch no es una inmobiliaria, no publica propiedades ni interviene en operaciones de alquiler o compra.',
    ],
  },
  {
    title: '2. Aceptación de los términos',
    paragraphs: [
      'Usar la aplicación implica aceptar estos términos. Si no estás de acuerdo con alguna parte, debés dejar de usarla.',
    ],
  },
  {
    title: '3. Cómo funciona el servicio',
    paragraphs: [
      'Definís tus criterios, por ejemplo seguridad, transporte o servicios cercanos, y cuánto pesa cada uno. ZonaMatch ordena las zonas según esas preferencias y te permite compararlas lado a lado.',
      'Los resultados son una guía para tu decisión: no reemplazan visitar la zona ni consultar a un profesional.',
    ],
  },
  {
    title: '4. Origen y exactitud de los datos',
    paragraphs: [
      'La información proviene de fuentes públicas y de terceros. Cuando es posible, mostramos la fuente y la fecha. Puede haber datos incompletos, desactualizados o con errores, y no garantizamos su exactitud.',
    ],
  },
  {
    title: '5. Limitación de responsabilidad',
    paragraphs: [
      'ZonaMatch es informativa. No constituye asesoramiento inmobiliario, jurídico ni financiero, ni garantiza el valor o la rentabilidad de ninguna zona.',
      'No somos responsables por decisiones tomadas en base a la información mostrada, ni por fallas de sitios o servicios de terceros.',
    ],
  },
  {
    title: '6. Propiedad intelectual',
    paragraphs: [
      'El diseño, la marca, el código y las funcionalidades de ZonaMatch pertenecen a sus creadores. Los datos de terceros pertenecen a sus respectivos titulares. No está permitido copiar ni reproducir la aplicación sin autorización.',
    ],
  },
  {
    title: '7. Uso aceptable',
    paragraphs: [
      'Te comprometés a no usar ZonaMatch para actividades ilegales o fraudulentas, ni para dañar o interferir con el servicio. Tampoco está permitido extraer información de forma masiva ni eludir los límites de uso.',
    ],
  },
  {
    title: '8. Modificaciones',
    paragraphs: [
      'Podemos modificar o interrumpir el servicio y actualizar estos términos cuando sea necesario. Los cambios se publican en esta página.',
    ],
  },
  {
    title: '9. Ley aplicable',
    paragraphs: ['Estos términos se rigen por las leyes de la República Argentina.'],
  },
  {
    title: '10. Contacto',
    paragraphs: ['Para consultas sobre estos términos escribinos a hola@zonamatch.com.'],
  },
]

export function TermsPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-[#12261e]">
      <SiteHeader />
      <main className="flex-1 px-5 py-10 lg:py-14">
        <article className="mx-auto w-full max-w-[860px]">
          <h1 className="text-3xl font-bold text-[#1f4a38] lg:text-4xl">Términos de Servicio</h1>
          <p className="mt-2 text-sm text-[#8a9a91]">Última actualización: {lastUpdated}</p>
          <p className="mt-6 text-[15px] leading-6 text-[#586a61]">
            Estos Términos de Servicio regulan el acceso y el uso de ZonaMatch. Al usar la
            aplicación aceptás lo que se describe acá. Si no estás de acuerdo, te pedimos que no la
            utilices.
          </p>
          {sections.map((section) => (
            <section className="mt-8" key={section.title}>
              <h2 className="text-lg font-semibold text-[#12261e] lg:text-xl">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p className="mt-2 text-[15px] leading-6 text-[#586a61]" key={paragraph}>
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
