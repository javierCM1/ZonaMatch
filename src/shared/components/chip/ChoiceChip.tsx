import type { ButtonHTMLAttributes, ReactNode } from 'react'

export interface ChoiceChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
	label: string
	selected?: boolean
	/** Elemento antes del texto, p. ej. un punto con el color de la capa. */
	leading?: ReactNode
}

// Pill seleccionable (filtros de categoría, radios, etc.). Se expone como botón
// de dos estados para que sea accesible por teclado y lectores de pantalla.
export function ChoiceChip({ label, selected = false, leading, className = '', type = 'button', ...props }: ChoiceChipProps) {
	const stateClasses = selected
		? 'border-[#1f4a38] bg-[#e4f3e8] font-semibold'
		: 'border-[#e3e8e2] bg-white font-medium hover:bg-[#f2faf3]'

	return (
		<button
			{...props}
			aria-pressed={selected}
			className={`inline-flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full border-[1.5px] px-[18px] py-2.5 text-sm text-[#1f4a38] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${stateClasses} ${className}`.trim()}
			type={type}
		>
			{leading}
			{label}
		</button>
	)
}
