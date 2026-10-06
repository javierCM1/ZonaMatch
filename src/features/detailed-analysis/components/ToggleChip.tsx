import type { ReactNode } from 'react'
import { Button } from '../../../shared/components/button'

export interface ToggleChipProps {
	selected: boolean
	onToggle: () => void
	label: string
	icon?: ReactNode
	className?: string
}

/**
 * Chip del prototipo. El punto indicador (`.chip::before`) lo aporta el CSS de la
 * feature, así que este componente no necesita pintar nada extra.
 */
export function ToggleChip({ selected, onToggle, label, icon, className = '' }: ToggleChipProps) {
	return (
		<Button
			aria-pressed={selected}
			className={`chip ${selected ? 'chip--selected' : ''} ${className}`.trim()}
			icon={icon}
			label={label}
			onClick={onToggle}
			outlined
		/>
	)
}