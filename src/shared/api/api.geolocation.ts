import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { apiClient } from '../../core/api/api.client'

export interface GeolocationCoordinates {
	latitude: number
	longitude: number
}


export interface GeolocationAddress {
	ubicacion: { latitud: number; longitud: number }
	nombre: string | null
	calle: string | null
	altura: string | null
	localidad: string | null
	partido: string | null
	comuna: string | null
	provincia: string | null
	codigoPostal: string | null
	direccionCompleta: string | null
}

function toQueryKey({ latitude, longitude }: GeolocationCoordinates) {	
	return [latitude.toFixed(4), longitude.toFixed(4)] as const
}


export async function fetchAddressByCoordinates(
	{ latitude, longitude }: GeolocationCoordinates,
	signal?: AbortSignal,
): Promise<GeolocationAddress> {
	const { data } = await apiClient.get<GeolocationAddress>('/Geolocation/direccion', {
		params: { latitud: latitude, longitud: longitude },
		signal,
	})

	return data
}

export function geolocationAddressQueryKey(coordinates: GeolocationCoordinates | null) {
	return ['geolocation', 'direccion', coordinates ? toQueryKey(coordinates) : null] as const
}

export type UseGeolocationAddressOptions = Omit<
	UseQueryOptions<GeolocationAddress, Error>,
	'queryKey' | 'queryFn'
>

export function useGeolocationAddress(coordinates: GeolocationCoordinates | null, options?: UseGeolocationAddressOptions) {
	return useQuery({
		staleTime: 5 * 60_000,
		gcTime: 30 * 60_000,
		retry: 1,
		...options,
		queryKey: geolocationAddressQueryKey(coordinates),
		queryFn: ({ signal }) => fetchAddressByCoordinates(coordinates as GeolocationCoordinates, signal),
		enabled: (options?.enabled ?? true) && coordinates != null,
	})
}
