import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

export interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

/**
 * Anima (fade + subida suave) el contenido la primera vez que entra en pantalla.
 * Usa IntersectionObserver y clases de Tailwind, sin librerías extra.
 * Si el usuario tiene activado "reducir movimiento" en su sistema, no anima.
 */
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Si el navegador no soporta IntersectionObserver, se muestra todo de entrada.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const element = ref.current
    if (!element || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={`transition-[opacity,translate] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      } ${className}`}
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}