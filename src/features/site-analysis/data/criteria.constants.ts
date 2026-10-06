/**
 * Criterios de la vista de invitado de "Mi análisis".
 *
 * Mismas categorías, descripciones e íconos que el wizard detallado para que
 * ambas vistas se lean idénticas. Los datos viven acá —y no se importan del otro
 * wizard— porque la lista que ve un invitado es una decisión de producto de esta
 * superficie: puede recortarse o ampliarse sin tocar el análisis detallado.
 */

export type PrioridadId = 'baja' | 'media' | 'alta'

export interface CriterioOption {
	id: string
	nombre: string
	descripcion: string
	icon: string
}

export type CriteriosState = Partial<Record<string, PrioridadId>>

export const PRIORITIES: PrioridadId[] = ['baja', 'media', 'alta']

export const PRIORITY_LABELS: Record<PrioridadId, string> = {
	baja: 'Baja',
	media: 'Media',
	alta: 'Alta',
}

/** Regla de negocio: un visitante sólo puede tener N criterios activos a la vez. */
export const GUEST_CRITERIA_LIMIT = 2

export const GUEST_CRITERIA: CriterioOption[] = [
	{ id: 'seguridad', nombre: 'Seguridad', descripcion: 'Delitos y percepción de seguridad', icon: 'pi pi-shield' },
	{ id: 'movilidad', nombre: 'Movilidad', descripcion: 'Tiempo a tus lugares y transporte', icon: 'pi pi-car' },
	{ id: 'espacios-verdes', nombre: 'Espacios verdes', descripcion: 'Plazas y parques cercanos', icon: 'pi pi-sun' },
	{ id: 'educacion', nombre: 'Educación', descripcion: 'Escuelas y universidades', icon: 'pi pi-graduation-cap' },
	{ id: 'salud', nombre: 'Salud', descripcion: 'Hospitales y salitas', icon: 'pi pi-heart' },
]

/** Copy exacto del límite; el número se deriva de la constante de negocio. */
export const GUEST_LIMIT_NOTICE = `Como visitante podés elegir hasta ${GUEST_CRITERIA_LIMIT} criterios. Registrate para desbloquear todos los criterios.`
