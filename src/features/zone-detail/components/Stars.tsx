interface StarsProps {
	/** 0 a 5. Se redondea al entero más cercano. */
	value: number
	className?: string
}

const TOTAL_STARS = 5

export function Stars({ value, className = '' }: StarsProps) {
	const filled = Math.max(0, Math.min(TOTAL_STARS, Math.round(value)))

	return (
		<span aria-label={`${value.toString().replace('.', ',')} de ${TOTAL_STARS} estrellas`} className={className} role="img">
			<span aria-hidden="true" className="text-[#f5b94d]">
				{'★'.repeat(filled)}
			</span>
			<span aria-hidden="true" className="text-[#e3e8e2]">
				{'★'.repeat(TOTAL_STARS - filled)}
			</span>
		</span>
	)
}
