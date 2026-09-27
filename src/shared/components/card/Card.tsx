import { Card as PrimeCard } from 'primereact/card'
import type { CardProps as PrimeCardProps } from 'primereact/card'

export type CardVariant = 'default' | 'outlined' | 'elevated'

export interface CardProps extends Omit<PrimeCardProps, 'className'> {
	className?: string
	variant?: CardVariant
	interactive?: boolean
}

const variantClasses: Record<CardVariant, string> = {
	default: 'border border-slate-200 bg-white shadow-sm',
	outlined: 'border border-slate-200 bg-transparent shadow-none',
	elevated: 'border border-slate-100 bg-white shadow-md',
}

export function Card({
	className = '',
	variant = 'default',
	interactive = false,
	...props
}: CardProps) {
	const interactionClasses = interactive
		? 'transition-shadow duration-200 hover:shadow-md'
		: ''

	return (
		<PrimeCard
			{...props}
			className={`rounded-md ${variantClasses[variant]} ${interactionClasses} ${className}`.trim()}
		/>
	)
}
