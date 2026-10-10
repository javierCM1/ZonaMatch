import type { PoiCategory } from '../types'

interface CategoryBadgeProps {
	category: PoiCategory
	/** Diámetro en px. */
	size?: number
}

// Círculo con el color y el ícono de la categoría: el mismo código visual que los marcadores del mapa.
export function CategoryBadge({ category, size = 16 }: CategoryBadgeProps) {
	return (
		<span
			aria-hidden="true"
			className="inline-flex shrink-0 items-center justify-center rounded-full"
			style={{ backgroundColor: category.color, height: size, width: size }}
		>
			<i className={`pi ${category.icon}`} style={{ color: category.iconColor, fontSize: Math.round(size * 0.55) }} />
		</span>
	)
}
