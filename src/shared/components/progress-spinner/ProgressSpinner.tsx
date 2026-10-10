import { ProgressSpinner as PrimeProgressSpinner } from 'primereact/progressspinner'
import type { ProgressSpinnerProps as PrimeProgressSpinnerProps } from 'primereact/progressspinner'

export type ProgressSpinnerSize = 'sm' | 'md' | 'lg'

export interface ProgressSpinnerProps extends Omit<PrimeProgressSpinnerProps, 'className' | 'style'> {
  className?: string
  size?: ProgressSpinnerSize
  label?: string
}

const SIZE_CLASSES: Record<ProgressSpinnerSize, string> = {
  sm: '!h-5 !w-5',
  md: '!h-10 !w-10',
  lg: '!h-16 !w-16',
}

export function ProgressSpinner({
  className = '',
  size = 'md',
  label = 'Cargando',
  strokeWidth = '4',
  animationDuration = '1s',
  ...props
}: ProgressSpinnerProps) {
  return (
    <PrimeProgressSpinner
      {...props}
      animationDuration={animationDuration}
      aria-label={label}
      className={`${SIZE_CLASSES[size]} ${className}`.trim()}
      pt={{ circle: { className: '!stroke-[#5d8a39]' } }}
      role="status"
      strokeWidth={strokeWidth}
    />
  )
}
