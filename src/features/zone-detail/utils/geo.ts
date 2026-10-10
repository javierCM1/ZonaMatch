import type { Coordinates } from '../types'

export function formatCoordinates({ latitude, longitude }: Coordinates): string {
	return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
}
