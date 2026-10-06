import type {
	AgeRange,
	CriterioOption,
	Frecuencia,
	LugarDefaults,
	LugarPrioridad,
	LugarTipo,
	MobilityOption,
	PetOption,
	PrioridadId,
	QuienVa,
	TiempoViaje,
} from '../types'

export const ANALYSIS_STEPS = [{ label: 'Contexto' }, { label: 'Criterios' }, { label: 'Puntos y restricciones' }]

export const MAX_PEOPLE = 8

export const DEFAULT_AGE_RANGE: AgeRange = '26–35 años'

export const AGE_RANGES: AgeRange[] = [
	'18–25 años',
	'26–35 años',
	'36–45 años',
	'46–60 años',
	'Más de 60 años',
]

export const MOBILITY_OPTIONS: MobilityOption[] = [
	{ id: 'a-pie', label: 'A pie' },
	{ id: 'transporte-publico', label: 'Transporte público' },
	{ id: 'vehiculo', label: 'Vehículo propio' },
	{ id: 'bici', label: 'Bici / monopatín' },
]

export const PET_OPTIONS: PetOption[] = [
	{ id: 'perro', label: 'Perro', emoji: '🐶' },
	{ id: 'gato', label: 'Gato', emoji: '🐱' },
	{ id: 'otras', label: 'Otras', emoji: '🐾' },
	{ id: 'ninguna', label: 'No tengo', emoji: '➖' },
]

export const PRIORITIES: PrioridadId[] = ['baja', 'media', 'alta']

export const PRIORITY_LABELS: Record<PrioridadId, string> = {
	baja: 'Baja',
	media: 'Media',
	alta: 'Alta',
}

export const DEFAULT_PRIORITY: PrioridadId = 'media'

export const CRITERIOS: CriterioOption[] = [
	{ id: 'seguridad', nombre: 'Seguridad', descripcion: 'Delitos y percepción de seguridad', icon: 'pi pi-shield' },
	{ id: 'movilidad', nombre: 'Movilidad', descripcion: 'Tiempo a tus lugares y transporte', icon: 'pi pi-car' },
	{ id: 'espacios-verdes', nombre: 'Espacios verdes', descripcion: 'Plazas y parques cercanos', icon: 'pi pi-sun' },
	{ id: 'educacion', nombre: 'Educación', descripcion: 'Escuelas y universidades', icon: 'pi pi-graduation-cap' },
	{ id: 'salud', nombre: 'Salud', descripcion: 'Hospitales y salitas', icon: 'pi pi-heart' },
]

export const LUGAR_TYPES: LugarTipo[] = ['Trabajo', 'Estudio', 'Colegio', 'Salud', 'Familiar', 'Otro']

export const QUIEN_VA_OPTIONS: QuienVa[] = ['Yo', 'Nosotros', 'Hijo/a', 'Otro']

export const FRECUENCIAS: Frecuencia[] = [
	'5x por semana',
	'3x por semana',
	'2x por semana',
	'1x por semana',
	'Ocasional',
]

export const LUGAR_PRIORIDADES: LugarPrioridad[] = ['Muy importante', 'Alta', 'Media', 'Baja']

export const TIEMPOS_VIAJE: TiempoViaje[] = ['15 min', '20 min', '30 min', '45 min', '60 min', '90 min']

/** Marker colors as feature-scoped tokens, so the palette stays in the CSS. */
export const MARKER_COLORS = [
	'var(--color-forest-800)',
	'var(--color-forest-700)',
	'var(--color-brand-600)',
	'var(--color-ink-500)',
	'var(--color-brand-800)',
	'var(--color-danger)',
]

export const LUGAR_DEFAULTS: LugarDefaults = {
	quienVa: 'Yo',
	frecuencia: '5x por semana',
	prioridad: 'Media',
	tiempoMax: '45 min',
}

/** Maps a free-text place priority to the slug used for its accent color. */
export const PLACE_PRIORITY_SLUGS: Record<LugarPrioridad, PrioridadId> = {
	'Muy importante': 'alta',
	Alta: 'media',
	Media: 'baja',
	Baja: 'baja',
}