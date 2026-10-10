interface StarInputProps {
	label: string
	/** 0 = sin elegir; 1 a 5. */
	value: number
	onChange: (value: number) => void
	size?: 'md' | 'lg'
}

const TOTAL_STARS = 5

// Puntaje de 1 a 5 como grupo de radios: se elige con clic o con las flechas del teclado
export function StarInput({ label, value, onChange, size = 'md' }: StarInputProps) {
	return (
		<div aria-label={label} className="flex items-center" role="radiogroup">
			{Array.from({ length: TOTAL_STARS }, (_, index) => {
				const star = index + 1
				const checked = value === star

				return (
					<button
						aria-checked={checked}
						aria-label={`${star} de ${TOTAL_STARS}`}
						className={`cursor-pointer rounded px-0.5 leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
							size === 'lg' ? 'text-[28px]' : 'text-xl'
						} ${star <= value ? 'text-[#f5b94d]' : 'text-[#e3e8e2] hover:text-[#f5d38a]'}`}
						key={star}
						onClick={() => onChange(star)}
						onKeyDown={(event) => {
							if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
								event.preventDefault()
								onChange(Math.min(TOTAL_STARS, Math.max(1, value + 1)))
							} else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
								event.preventDefault()
								onChange(Math.max(1, value - 1))
							}
						}}
						role="radio"
						// Solo la estrella elegida (o la primera) entra en el orden de tabulación
						tabIndex={checked || (value === 0 && star === 1) ? 0 : -1}
						type="button"
					>
						★
					</button>
				)
			})}
		</div>
	)
}
