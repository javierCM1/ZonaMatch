import type { AspectScores } from '../types'

/** "3,6" */
export const formatRating = (value: number) => value.toFixed(1).replace('.', ',')

/**
 * Puntaje general de una reseña: el promedio de los aspectos, como lo calcula el backend.
 * 0 mientras falte puntuar algún aspecto.
 */
export function overallRating(aspects: AspectScores): number {
	const scores = Object.values(aspects)

	if (scores.some((score) => score === 0)) {
		return 0
	}

	return scores.reduce((sum, score) => sum + score, 0) / scores.length
}
