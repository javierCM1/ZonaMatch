import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import type { LatLngTuple } from 'leaflet'
import { apiClient } from '../../../core/api/api.client'
import type { MapArea } from '../../../shared/components/map'
import type { Jurisdiction, ZoneBoundary } from '../types'

type Position = [longitude: number, latitude: number]

// Respuesta de GET /Zonas/{slug}: un Feature de GeoJSON (coordenadas en [lon, lat])
interface ZonaResponse {
	type: 'Feature'
	id: string
	properties: {
		slug: string
		nombre: string
		nivelAdministrativo: number
		jurisdicciones: { nombre: string; nivelAdministrativo: number }[]
		superficieKm2: number
		centro: { latitud: number; longitud: number }
	}
	geometry: { type: 'Polygon'; coordinates: Position[][] } | { type: 'MultiPolygon'; coordinates: Position[][][] }
}

const toLatLngs = (ring: Position[]): LatLngTuple[] => ring.map(([longitude, latitude]) => [latitude, longitude])

function toMapArea(geometry: ZonaResponse['geometry']): MapArea {
	return geometry.type === 'Polygon'
		? geometry.coordinates.map(toLatLngs)
		: geometry.coordinates.map((polygon) => polygon.map(toLatLngs))
}

export async function fetchZone(slug: string, signal?: AbortSignal): Promise<ZoneBoundary> {
	const { data } = await apiClient.get<ZonaResponse>(`/Zonas/${encodeURIComponent(slug)}`, { signal })
	const { properties } = data

	return {
		id: properties.slug,
		name: properties.nombre,
		adminLevel: properties.nivelAdministrativo,
		jurisdictions: properties.jurisdicciones.map((item) => ({
			name: item.nombre,
			adminLevel: item.nivelAdministrativo,
		})),
		areaKm2: properties.superficieKm2,
		center: { latitude: properties.centro.latitud, longitude: properties.centro.longitud },
		area: toMapArea(data.geometry),
	}
}

/** El backend responde 400 a un slug mal formado y 404 si no existe: en los dos casos la zona no está. */
export const isZoneNotFound = (error: unknown) =>
	isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 400)

export function useZone(slug: string) {
	return useQuery({
		queryKey: ['zone-detail', 'zone', slug] as const,
		queryFn: ({ signal }) => fetchZone(slug, signal),
		// Los límites casi no cambian
		staleTime: 60 * 60_000,
		retry: (failureCount, error) => !isZoneNotFound(error) && failureCount < 2,
	})
}

// Respuesta de GET /Zonas?buscar=
interface ZonaResumenResponse {
	slug: string
	nombre: string
	nivelAdministrativo: number
	jurisdicciones: { nombre: string; nivelAdministrativo: number }[]
	superficieKm2: number
}

export interface ZoneSearchResult {
	id: string
	name: string
	adminLevel: number
	jurisdictions: Jurisdiction[]
	areaKm2: number
}

/** El backend ignora búsquedas más cortas (cuenta letras y números, sin espacios ni signos). */
export const MIN_ZONE_SEARCH_LENGTH = 2

export async function searchZones(text: string, signal?: AbortSignal): Promise<ZoneSearchResult[]> {
	const { data } = await apiClient.get<ZonaResumenResponse[]>('/Zonas', {
		params: { buscar: text, limite: 10 },
		signal,
	})

	return data.map((zone) => ({
		id: zone.slug,
		name: zone.nombre,
		adminLevel: zone.nivelAdministrativo,
		jurisdictions: zone.jurisdicciones.map((item) => ({ name: item.nombre, adminLevel: item.nivelAdministrativo })),
		areaKm2: zone.superficieKm2,
	}))
}

export function useZoneSearch(text: string) {
	const query = text.trim()

	return useQuery({
		queryKey: ['zone-detail', 'search', query.toLocaleLowerCase('es')] as const,
		queryFn: ({ signal }) => searchZones(query, signal),
		enabled: query.replace(/[^\p{L}\p{N}]/gu, '').length >= MIN_ZONE_SEARCH_LENGTH,
		// Mientras se escribe, los resultados anteriores quedan hasta que llegan los nuevos
		placeholderData: keepPreviousData,
		staleTime: 60 * 60_000,
	})
}
