import { Button } from '../../../shared/components/button'

export interface PeopleCounterProps {
	value: number
	min?: number
	max?: number
	onChange: (value: number) => void
	unitLabel?: string
	decrementLabel?: string
	incrementLabel?: string
}

export function PeopleCounter({
	value,
	min = 0,
	max = Number.MAX_SAFE_INTEGER,
	onChange,
	unitLabel,
	decrementLabel = 'Restar una persona',
	incrementLabel = 'Sumar una persona',
}: PeopleCounterProps) {
	return (
		<div className="counter">
			<Button
				aria-label={decrementLabel}
				className="counter__button"
				disabled={value <= min}
				icon="pi pi-minus"
				onClick={() => onChange(Math.max(min, value - 1))}
			/>

			<output aria-live="polite" className="counter__value">
				{value}
			</output>

			<Button
				aria-label={incrementLabel}
				className="counter__button"
				disabled={value >= max}
				icon="pi pi-plus"
				onClick={() => onChange(Math.min(max, value + 1))}
			/>

			{unitLabel && <span className="counter__unit">{unitLabel}</span>}
		</div>
	)
}