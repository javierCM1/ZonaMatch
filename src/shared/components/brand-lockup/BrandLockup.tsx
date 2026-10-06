import lockup from '../../../assets/brand-lockup.png'

export interface BrandLockupProps {
  className?: string
}

export function BrandLockup({ className = '' }: BrandLockupProps) {
  return (
    <img
      alt="ZonaMatch"
      className={`h-9 w-auto shrink-0 select-none ${className}`}
      decoding="async"
      src={lockup}
    />
  )
}