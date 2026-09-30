import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { apiClient } from '../../core/api/api.client'
import type { ApiResponse } from '../../core/types/api'

export interface GeolocationCoordinates {
	latitude: number
	longitude: number
}

/**
 * Shape returned by GET /Geolocation/zona.
 * Only `localidad` is guaranteed — the rest are best-effort fields some
 * backends include; adjust once the real contract is confirmed.
 */
export interface GeolocationZone {
	localidad: string
	partido?: string
	provincia?: string
	codigoPostal?: string
}

function toQueryKey({ latitude, longitude }: GeolocationCoordinates) {
	// Round to ~11m precision so the cache doesn't miss on floating-point noise
	// (e.g. re-clicking the same spot on the map).
	return [latitude.toFixed(4), longitude.toFixed(4)] as const
}

/**
 * Resolves the locality/zone name for a pair of coordinates (reverse geocoding).
 * Shared across any page that needs to label a point picked on the map.
 */
export async function fetchZoneByCoordinates(
	{ latitude, longitude }: GeolocationCoordinates,
	signal?: AbortSignal,
): Promise<GeolocationZone> {
	const { data } = await apiClient.get<ApiResponse<GeolocationZone>>('/Geolocation/zona', {
		params: { latitud: latitude, longitud: longitude },
		signal,
	})

	if (!data.success) {
		throw new Error(data.message ?? 'No se pudo obtener la localidad para esas coordenadas.')
	}

	return data.data
}

export function geolocationZoneQueryKey(coordinates: GeolocationCoordinates | null) {
	return ['geolocation', 'zona', coordinates ? toQueryKey(coordinates) : null] as const
}

export type UseGeolocationZoneOptions = Omit<
	UseQueryOptions<GeolocationZone, Error>,
	'queryKey' | 'queryFn'
>

/**
 * React Query hook that resolves the locality name for a pair of coordinates.
 * Pass `coordinates` as `null` while nothing is selected yet — the request
 * stays disabled (and cancels in-flight requests on unmount/coordinate change,
 * via axios' AbortSignal support) until real coordinates are provided.
 */
export function useGeolocationZone(coordinates: GeolocationCoordinates | null, options?: UseGeolocationZoneOptions) {
	return useQuery({
		staleTime: 5 * 60_000,
		gcTime: 30 * 60_000,
		retry: 1,
		...options,
		queryKey: geolocationZoneQueryKey(coordinates),
		queryFn: ({ signal }) => fetchZoneByCoordinates(coordinates as GeolocationCoordinates, signal),
		enabled: (options?.enabled ?? true) && coordinates != null,
	})
}
