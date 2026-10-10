import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { apiClient } from '../../../core/api/api.client'
import type { Coordinates, PoiCategoryId, RadiusMeters, ZonePoi } from '../types'
import { typeLabel } from '../utils/poi-labels'
import type { TypeCount } from '../utils/poi-labels'

/** Dónde se buscan los puntos: toda la zona o un radio alrededor de un punto elegido en el mapa. */
export type PoiArea =
	| { kind: 'zone'; zoneId: string }
	| { kind: 'radius'; center: Coordinates; radius: RadiusMeters }

// Respuesta de GET /Zonas/{slug}/puntos-interes y GET /Geolocation/puntos-interes
interface PuntoInteresResponse {
	id: string
	nombre: string | null
	categoria: PoiCategoryId
	tipo: string | null
	operador: string | null
	latitud: number
	longitud: number
	distanciaMetros: number
	/** "vecinos": punto agregado por la comunidad y validado por otros vecinos. */
	fuente: 'osm' | 'vecinos'
}

interface PuntosInteresCercanosResponse {
	puntos: PuntoInteresResponse[]
	truncado: boolean
}

export interface AreaPois {
	pois: ZonePoi[]
	/** Hay más puntos que el límite del backend: solo vienen los más cercanos al centro. */
	truncated: boolean
}

// Respuesta de los endpoints .../puntos-interes/resumen
interface ResumenPuntosInteresResponse {
	/** null cuando el área es una zona. */
	radioMetros: number | null
	categorias: {
		categoria: PoiCategoryId
		total: number
		tipos: { tipo: string | null; cantidad: number }[]
	}[]
}

export interface CategorySummary {
	categoryId: PoiCategoryId
	total: number
	types: TypeCount[]
}

function toZonePoi(point: PuntoInteresResponse): ZonePoi {
	const type = typeLabel(point.categoria, point.tipo)

	return {
		id: point.id,
		name: point.nombre ?? type,
		categoryId: point.categoria,
		detail: point.operador ? `${type} · ${point.operador}` : type,
		source: point.fuente === 'vecinos' ? 'Aporte de vecinos' : 'OpenStreetMap',
		latitude: point.latitud,
		longitude: point.longitud,
	}
}

/** URL y parámetros de cada endpoint según el área. */
function areaRequest(area: PoiArea, path: '' | '/resumen') {
	return area.kind === 'zone'
		? { url: `/Zonas/${encodeURIComponent(area.zoneId)}/puntos-interes${path}`, params: {} }
		: {
				url: `/Geolocation/puntos-interes${path}`,
				params: { latitud: area.center.latitude, longitud: area.center.longitude, radioMetros: area.radius },
			}
}

const areaKey = (area: PoiArea) =>
	area.kind === 'zone'
		? (['zone', area.zoneId] as const)
		: (['radius', area.center.latitude.toFixed(5), area.center.longitude.toFixed(5), area.radius] as const)

export async function fetchAreaPois(area: PoiArea, categories: PoiCategoryId[], signal?: AbortSignal): Promise<AreaPois> {
	const { url, params } = areaRequest(area, '')
	const { data } = await apiClient.get<PuntosInteresCercanosResponse>(url, {
		params: { ...params, categorias: categories.join(',') },
		signal,
	})

	return { pois: data.puntos.map(toZonePoi), truncated: data.truncado }
}

export function useAreaPois(area: PoiArea, categories: PoiCategoryId[]) {
	const sortedCategories = [...categories].sort()

	return useQuery({
		queryKey: ['zone-detail', 'pois', ...areaKey(area), sortedCategories] as const,
		queryFn: ({ signal }) => fetchAreaPois(area, sortedCategories, signal),
		// Sin capas activas no hay nada que pedir
		enabled: sortedCategories.length > 0,
		// Al cambiar de área o de capas, los marcadores anteriores quedan hasta que llega la respuesta
		placeholderData: keepPreviousData,
		staleTime: 5 * 60_000,
	})
}

export async function fetchAreaPoiSummary(area: PoiArea, signal?: AbortSignal): Promise<CategorySummary[]> {
	const { url, params } = areaRequest(area, '/resumen')
	const { data } = await apiClient.get<ResumenPuntosInteresResponse>(url, { params, signal })

	return data.categorias.map((item) => ({
		categoryId: item.categoria,
		total: item.total,
		types: item.tipos.map((tipo) => ({ type: tipo.tipo, count: tipo.cantidad })),
	}))
}

export function useAreaPoiSummary(area: PoiArea) {
	return useQuery({
		queryKey: ['zone-detail', 'pois-summary', ...areaKey(area)] as const,
		queryFn: ({ signal }) => fetchAreaPoiSummary(area, signal),
		placeholderData: keepPreviousData,
		staleTime: 5 * 60_000,
	})
}
