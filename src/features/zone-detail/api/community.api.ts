import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { apiClient } from '../../../core/api/api.client'
import { useAuthStore } from '../../../core/auth/auth.store'
import type {
	Answer,
	AspectId,
	AspectScores,
	ContributionStats,
	CorrectionContribution,
	CorrectionReason,
	PendingContribution,
	PoiCategoryId,
	PoiContribution,
	Question,
	Review,
	ReviewDraft,
	ZoneReviews,
} from '../types'

// Comunidad de una zona: reseñas, preguntas a los vecinos y aportes al mapa (/Zonas/{slug}/...).
// Leer es público; escribir manda el token de la sesión (lo agrega el interceptor de apiClient).

const zonePath = (zoneId: string) => `/Zonas/${encodeURIComponent(zoneId)}`

const communityKey = (zoneId: string, part: 'reviews' | 'questions' | 'contributions') =>
	['zone-detail', 'community', zoneId, part] as const

// ---------- Respuestas del backend ----------

interface PuntajesAspectosResponse {
	seguridad: number
	transporte: number
	conectividad: number
	comercios: number
	espaciosVerdes: number
}

interface ResenaResponse {
	id: string
	iniciales: string
	aniosEnZona: number | null
	verificada: boolean
	puntaje: number
	aspectos: PuntajesAspectosResponse
	temas: AspectId[]
	texto: string
	fecha: string
	utiles: number
	marcadaUtilPorMi: boolean
	esMia: boolean
}

interface ResenasZonaResponse {
	resumen: {
		promedio: number
		total: number
		verificadas: number
		aspectos: { aspecto: AspectId; promedio: number }[]
	}
	resenas: ResenaResponse[]
}

interface RespuestaResponse {
	id: string
	texto: string
	iniciales: string
	fecha: string
	esMia: boolean
}

interface PreguntaResponse extends RespuestaResponse {
	respuestas: RespuestaResponse[]
}

interface AporteResponse {
	id: string
	tipo: 'punto-nuevo' | 'correccion'
	iniciales: string
	fecha: string
	esMio: boolean
	miVoto: boolean | null
	confirmaciones: number
	rechazos: number
	nombre: string | null
	categoria: PoiCategoryId | null
	ubicacion: { latitud: number; longitud: number } | null
	horario: string | null
	direccion: string | null
	puntoInteresNombre: string | null
	motivo: CorrectionReason | null
	comentario: string | null
}

// ---------- Conversión ----------

const toAspectScores = (aspectos: PuntajesAspectosResponse): AspectScores => ({
	seguridad: aspectos.seguridad,
	transporte: aspectos.transporte,
	conectividad: aspectos.conectividad,
	comercios: aspectos.comercios,
	'espacios-verdes': aspectos.espaciosVerdes,
})

const toReview = (resena: ResenaResponse): Review => ({
	id: resena.id,
	initials: resena.iniciales,
	yearsInZone: resena.aniosEnZona,
	verified: resena.verificada,
	rating: resena.puntaje,
	aspects: toAspectScores(resena.aspectos),
	topics: resena.temas,
	text: resena.texto,
	publishedAt: resena.fecha,
	helpfulCount: resena.utiles,
	markedHelpfulByMe: resena.marcadaUtilPorMi,
	mine: resena.esMia,
})

const toAnswer = (respuesta: RespuestaResponse): Answer => ({
	id: respuesta.id,
	text: respuesta.texto,
	initials: respuesta.iniciales,
	publishedAt: respuesta.fecha,
	mine: respuesta.esMia,
})

const toQuestion = (pregunta: PreguntaResponse): Question => ({
	...toAnswer(pregunta),
	answers: pregunta.respuestas.map(toAnswer),
})

const toPendingContribution = (aporte: AporteResponse): PendingContribution => ({
	id: aporte.id,
	kind: aporte.tipo,
	initials: aporte.iniciales,
	publishedAt: aporte.fecha,
	mine: aporte.esMio,
	myVote: aporte.miVoto,
	confirmations: aporte.confirmaciones,
	rejections: aporte.rechazos,
	name: aporte.nombre,
	categoryId: aporte.categoria,
	location: aporte.ubicacion ? { latitude: aporte.ubicacion.latitud, longitude: aporte.ubicacion.longitud } : null,
	schedule: aporte.horario,
	address: aporte.direccion,
	placeName: aporte.puntoInteresNombre,
	reason: aporte.motivo,
	comment: aporte.comentario,
})

// ---------- Errores ----------

interface ProblemDetailsBody {
	title?: string
	errors?: Record<string, string[]>
}

/** Mensaje para mostrar de un error de la API (ProblemDetails de ASP.NET). */
export function communityErrorMessage(error: unknown, fallback: string): string {
	if (!isAxiosError<ProblemDetailsBody>(error)) {
		return fallback
	}

	if (!error.response) {
		return 'No pudimos conectarnos con el servidor. Revisá tu conexión e intentá de nuevo.'
	}

	if (error.response.status === 401) {
		return 'Tu sesión venció. Iniciá sesión de nuevo para continuar.'
	}

	const body = error.response.data
	const validation = body?.errors && Object.values(body.errors).flat()[0]

	return validation ?? body?.title ?? fallback
}

/**
 * Mutación de la comunidad: al terminar refresca la parte indicada y, si el token venció (401),
 * cierra la sesión para que la pantalla vuelva a pedir el inicio de sesión.
 */
function useCommunityMutation<TVariables, TResult>(
	zoneId: string,
	parts: ('reviews' | 'questions' | 'contributions' | 'pois')[],
	mutationFn: (variables: TVariables) => Promise<TResult>,
) {
	const queryClient = useQueryClient()
	const setAuthenticated = useAuthStore((state) => state.setAuthenticated)

	return useMutation({
		mutationFn,
		onError: (error) => {
			if (isAxiosError(error) && error.response?.status === 401) {
				setAuthenticated(false)
			}
		},
		onSettled: () =>
			Promise.all(
				parts.map((part) =>
					queryClient.invalidateQueries({
						// Los aportes aprobados cambian los puntos del mapa
						queryKey: part === 'pois' ? ['zone-detail', 'pois'] : communityKey(zoneId, part),
					}),
				),
			),
	})
}

// ---------- Reseñas ----------

export function useZoneReviews(zoneId: string) {
	// La sesión cambia qué reseña es "mía" y cuáles marqué como útiles
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

	return useQuery({
		queryKey: [...communityKey(zoneId, 'reviews'), isAuthenticated] as const,
		queryFn: async ({ signal }): Promise<ZoneReviews> => {
			const { data } = await apiClient.get<ResenasZonaResponse>(`${zonePath(zoneId)}/resenas`, { signal })

			return {
				summary: {
					average: data.resumen.promedio,
					total: data.resumen.total,
					verified: data.resumen.verificadas,
					aspects: data.resumen.aspectos.map((item) => ({ id: item.aspecto, value: item.promedio })),
				},
				reviews: data.resenas.map(toReview),
			}
		},
	})
}

export function useSaveReview(zoneId: string) {
	return useCommunityMutation(zoneId, ['reviews'], async (draft: ReviewDraft) => {
		const { data } = await apiClient.put<ResenaResponse>(`${zonePath(zoneId)}/resenas/mia`, {
			aspectos: {
				seguridad: draft.aspects.seguridad,
				transporte: draft.aspects.transporte,
				conectividad: draft.aspects.conectividad,
				comercios: draft.aspects.comercios,
				espaciosVerdes: draft.aspects['espacios-verdes'],
			},
			texto: draft.text,
			aniosEnZona: draft.yearsInZone,
			temas: draft.topics,
		})

		return toReview(data)
	})
}

export function useDeleteReview(zoneId: string) {
	return useCommunityMutation(zoneId, ['reviews'], async () => {
		await apiClient.delete(`${zonePath(zoneId)}/resenas/mia`)
	})
}

export function useToggleHelpful(zoneId: string) {
	return useCommunityMutation(zoneId, ['reviews'], async ({ reviewId, helpful }: { reviewId: string; helpful: boolean }) => {
		const url = `${zonePath(zoneId)}/resenas/${reviewId}/util`
		await (helpful ? apiClient.put(url) : apiClient.delete(url))
	})
}

// ---------- Preguntas ----------

export function useZoneQuestions(zoneId: string) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

	return useQuery({
		queryKey: [...communityKey(zoneId, 'questions'), isAuthenticated] as const,
		queryFn: async ({ signal }) => {
			const { data } = await apiClient.get<PreguntaResponse[]>(`${zonePath(zoneId)}/preguntas`, { signal })
			return data.map(toQuestion)
		},
	})
}

export function useAskQuestion(zoneId: string) {
	return useCommunityMutation(zoneId, ['questions'], async (text: string) => {
		const { data } = await apiClient.post<PreguntaResponse>(`${zonePath(zoneId)}/preguntas`, { texto: text })
		return toQuestion(data)
	})
}

export function useAnswerQuestion(zoneId: string) {
	return useCommunityMutation(zoneId, ['questions'], async ({ questionId, text }: { questionId: string; text: string }) => {
		const { data } = await apiClient.post<RespuestaResponse>(`${zonePath(zoneId)}/preguntas/${questionId}/respuestas`, {
			texto: text,
		})
		return toAnswer(data)
	})
}

// ---------- Aportes ----------

export function useContributionStats(zoneId: string) {
	return useQuery({
		queryKey: [...communityKey(zoneId, 'contributions'), 'stats'] as const,
		queryFn: async ({ signal }): Promise<ContributionStats> => {
			const { data } = await apiClient.get<{ total: number; aprobados: number; pendientes: number }>(
				`${zonePath(zoneId)}/aportes/resumen`,
				{ signal },
			)
			return { total: data.total, approved: data.aprobados, pending: data.pendientes }
		},
	})
}

export function usePendingContributions(zoneId: string) {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

	return useQuery({
		queryKey: [...communityKey(zoneId, 'contributions'), 'pending', isAuthenticated] as const,
		queryFn: async ({ signal }) => {
			const { data } = await apiClient.get<AporteResponse[]>(`${zonePath(zoneId)}/aportes/pendientes`, { signal })
			return data.map(toPendingContribution)
		},
	})
}

export function useSuggestPoi(zoneId: string) {
	return useCommunityMutation(zoneId, ['contributions'], async (contribution: PoiContribution) => {
		const { data } = await apiClient.post<AporteResponse>(`${zonePath(zoneId)}/aportes/puntos`, {
			categoria: contribution.categoryId,
			nombre: contribution.name,
			horario: contribution.schedule || null,
			direccion: contribution.address || null,
			latitud: contribution.location.latitude,
			longitud: contribution.location.longitude,
			viveOTrabajaEnZona: contribution.livesOrWorksInZone,
		})
		return toPendingContribution(data)
	})
}

export function useSuggestCorrection(zoneId: string) {
	return useCommunityMutation(zoneId, ['contributions'], async (correction: CorrectionContribution) => {
		const { data } = await apiClient.post<AporteResponse>(`${zonePath(zoneId)}/aportes/correcciones`, {
			puntoInteresId: correction.placeId,
			puntoInteresNombre: correction.placeName,
			motivo: correction.reason,
			nombrePropuesto: correction.proposedName ?? null,
			categoriaPropuesta: correction.proposedCategoryId ?? null,
			latitud: correction.proposedLocation?.latitude ?? null,
			longitud: correction.proposedLocation?.longitude ?? null,
			comentario: correction.comment ?? null,
		})
		return toPendingContribution(data)
	})
}

export function useValidateContribution(zoneId: string) {
	return useCommunityMutation(
		zoneId,
		['contributions', 'pois'],
		async ({ contributionId, confirm }: { contributionId: string; confirm: boolean }) => {
			const { data } = await apiClient.put<AporteResponse>(`${zonePath(zoneId)}/aportes/${contributionId}/validacion`, {
				confirma: confirm,
			})
			return toPendingContribution(data)
		},
	)
}
