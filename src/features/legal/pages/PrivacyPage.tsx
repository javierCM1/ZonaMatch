import { SiteFooter } from '../../../shared/components/site-footer'
import { SiteHeader } from '../../../shared/components/site-header'

// BORRADOR: texto provisional para probar el header/footer unificados.
// Antes de publicarlo, el equipo debe verificar que describa lo que la app realmente hace
// (qué datos guarda, con qué proveedores trabaja, cuánto tiempo los conserva).
const lastUpdated = '4 de octubre de 2026'

type Section = {
  title: string
  paragraphs: string[]
  items?: string[]
}

const sections: Section[] = [
  {
    title: '1. Quién es responsable de tus datos',
    paragraphs: [
      'ZonaMatch es responsable del tratamiento de los datos descritos en esta política.',
    ],
  },
  {
    title: '2. Qué información recopilamos',
    paragraphs: ['Según cómo uses la aplicación, podemos recopilar:'],
    items: [
      'Los criterios y puntos de interés que cargás para tu análisis, como zonas o direcciones que te importan.',
      'Datos de contacto, como tu correo electrónico, si nos escribís o creás una cuenta.',
      'Datos técnicos básicos, como dirección IP, navegador y dispositivo, y cómo y cuándo usás el servicio.',
    ],
  },
  {
    title: '3. Cómo usamos tu información',
    paragraphs: ['Usamos tu información para:'],
    items: [
      'Mostrarte las zonas que mejor encajan con tus prioridades.',
      'Mantener y mejorar el funcionamiento de la aplicación.',
      'Responder tus consultas y brindarte soporte.',
      'Prevenir abusos, cuidar la seguridad y cumplir con la ley.',
    ],
  },
  {
    title: '4. Con quién la compartimos',
    paragraphs: [
      'No vendemos tu información personal. Podemos compartir datos con proveedores que nos ayudan a operar el servicio, como alojamiento, mapas y geolocalización, y cuando una norma o una autoridad competente lo exija.',
    ],
  },
  {
    title: '5. Cookies y tecnologías similares',
    paragraphs: [
      'Podemos usar cookies y tecnologías similares para que el sitio funcione y para medir cómo se usa. Podés gestionarlas desde la configuración de tu navegador.',
    ],
  },
  {
    title: '6. Cuánto tiempo conservamos tu información',
    paragraphs: [
      'Conservamos tus datos mientras sean necesarios para prestar el servicio o cumplir obligaciones legales. Podés pedirnos que los eliminemos escribiendo a la dirección de contacto.',
    ],
  },
  {
    title: '7. Seguridad',
    paragraphs: [
      'Aplicamos medidas técnicas y organizativas para proteger tu información. Aun así, ningún sistema es completamente seguro y no podemos garantizar una protección absoluta.',
    ],
  },
  {
    title: '8. Menores de edad',
    paragraphs: [
      'ZonaMatch no está dirigida a menores de 18 años y no recopilamos a sabiendas información de ellos. Si detectamos que lo hicimos, la eliminaremos.',
    ],
  },
  {
    title: '9. Tus derechos',
    paragraphs: [
      'Podés pedir acceso, corrección o eliminación de tus datos personales, conforme a la legislación argentina de protección de datos personales (Ley 25.326).',
      'La Agencia de Acceso a la Información Pública (AAIP) es el órgano de control de esa ley y atiende denuncias y reclamos.',
    ],
  },
  {
    title: '10. Cambios en esta política',
    paragraphs: [
      'Podemos actualizar esta política cuando sea necesario. Los cambios se publican en esta página y rigen desde ese momento.',
    ],
  },
  {
    title: '11. Contacto',
    paragraphs: [
      'Para consultas sobre esta política o para ejercer tus derechos, escribinos a hola@zonamatch.com.',
    ],
  },
]

export function PrivacyPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-white text-[#12261e]">
      <SiteHeader />
      <main className="flex-1 px-5 py-10 lg:py-14">
        <article className="mx-auto w-full max-w-[860px]">
          <h1 className="text-3xl font-bold text-[#1f4a38] lg:text-4xl">Política de Privacidad</h1>
          <p className="mt-2 text-sm text-[#8a9a91]">Última actualización: {lastUpdated}</p>
          <p className="mt-6 text-[15px] leading-6 text-[#586a61]">
            Esta política explica cómo ZonaMatch recopila, usa y protege tu información cuando
            usás la aplicación. Si no estás de acuerdo con ella, te pedimos que no uses el
            servicio.
          </p>
          {sections.map((section) => (
            <section className="mt-8" key={section.title}>
              <h2 className="text-lg font-semibold text-[#12261e] lg:text-xl">{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p className="mt-2 text-[15px] leading-6 text-[#586a61]" key={paragraph}>
                  {paragraph}
                </p>
              ))}
              {section.items && (
                <ul className="mt-2 list-disc space-y-1 pl-5 text-[15px] leading-6 text-[#586a61]">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
