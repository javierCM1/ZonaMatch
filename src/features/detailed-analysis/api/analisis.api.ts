import { apiClient } from '../../../core/api/api.client'
import type { DetailedAnalysisState } from '../types'

export interface AnalisisDetallado {
	id: string
	nombre: string
	contexto: DetailedAnalysisState['contexto']
	criterios: DetailedAnalysisState['criterios']
	puntos: DetailedAnalysisState['puntos']
	fechaCreacion: string
	fechaActualizacion: string
}

export interface CrearAnalisisPayload {
	nombre: string
	contexto: DetailedAnalysisState['contexto']
	criterios: DetailedAnalysisState['criterios']
	puntos: DetailedAnalysisState['puntos']
}

export const MAX_ANALISIS_GUARDADOS = 3

export async function getAnalisis(): Promise<AnalisisDetallado[]> {
	const { data } = await apiClient.get<AnalisisDetallado[]>('/Analisis')
	return data
}

export async function createAnalisis(payload: CrearAnalisisPayload): Promise<AnalisisDetallado> {
	const { data } = await apiClient.post<AnalisisDetallado>('/Analisis', payload)
	return data
}

export async function updateAnalisis(id: string, payload: Partial<CrearAnalisisPayload>): Promise<AnalisisDetallado> {
	const { data } = await apiClient.put<AnalisisDetallado>(`/Analisis/${id}`, payload)
	return data
}

export async function deleteAnalisis(id: string): Promise<void> {
	await apiClient.delete(`/Analisis/${id}`)
}

/** Message for the "already have 3" conflict (409). */
export function getSaveErrorMessage(error: unknown): string {
	if (typeof error === 'object' && error !== null && 'response' in error) {
		const response = (error as { response?: { data?: { title?: string; message?: string } } }).response
		const message = response?.data?.title ?? response?.data?.message

		if (typeof message === 'string' && message.trim()) {
			return message
		}
	}

	return 'No se pudo guardar el análisis. Intentá nuevamente.'
}
