import isotipo from '../../../assets/isotipo.png'
import logotipo from '../../../assets/logotipo.png'

export interface BrandLockupProps {
  className?: string
}

export function BrandLockup({ className = '' }: BrandLockupProps) {
  return (
    <span className={`flex items-center gap-1.5 ${className}`}>
      <img alt="" aria-hidden="true" className="h-6 w-auto shrink-0 select-none" decoding="async" src={isotipo} />
      <img alt="ZonaMatch" className="h-4 w-auto shrink-0 select-none" decoding="async" src={logotipo} />
    </span>
  )
}
