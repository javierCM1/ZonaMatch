import logo from '../../../assets/zonamatch-logo.svg'

interface BrandLogoProps {
  className?: string
}

export function BrandLogo({ className = '' }: BrandLogoProps) {
  return <img alt="ZonaMatch" className={`object-contain ${className}`.trim()} src={logo} />
}
