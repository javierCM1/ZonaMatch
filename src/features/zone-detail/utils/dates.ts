const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/** "jun. 2026" */
export function formatMonthYear(iso: string): string {
	return new Date(iso).toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })
}

/** "hace 5 min", "hace 3 h", "ayer", "hace 4 días" y, más atrás, "12 jun." */
export function formatRelative(iso: string, now: Date = new Date()): string {
	const date = new Date(iso)
	const elapsed = now.getTime() - date.getTime()

	if (elapsed < MINUTE) {
		return 'recién'
	}

	if (elapsed < HOUR) {
		return `hace ${Math.floor(elapsed / MINUTE)} min`
	}

	if (elapsed < DAY) {
		return `hace ${Math.floor(elapsed / HOUR)} h`
	}

	const days = Math.floor(elapsed / DAY)

	if (days === 1) {
		return 'ayer'
	}

	if (days < 7) {
		return `hace ${days} días`
	}

	return date.toLocaleDateString('es-AR', {
		day: 'numeric',
		month: 'short',
		...(date.getFullYear() === now.getFullYear() ? {} : { year: 'numeric' }),
	})
}
