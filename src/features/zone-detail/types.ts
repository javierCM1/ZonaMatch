import type { MapArea } from '../../shared/components/map'

export type PoiCategoryId =
	| 'transporte'
	| 'educacion'
	| 'salud'
	| 'comercios'
	| 'deporte'
	| 'espacios-verdes'
	| 'cultura'

export interface PoiCategory {
	id: PoiCategoryId
	label: string
	color: string
	/** Clase de PrimeIcons: con 7 categorías el color solo no alcanza para distinguirlas. */
	icon: string
	/** Color del ícono sobre `color` (oscuro en los tonos claros). */
	iconColor: string
}

export type RadiusMeters = 500 | 1000 | 2000

export interface Coordinates {
	latitude: number
	longitude: number
}

export interface ZonePoi extends Coordinates {
	id: string
	name: string
	categoryId: PoiCategoryId
	/** Texto corto bajo el nombre, p. ej. "Tren Sarmiento". */
	detail: string
	source: string
}

export interface ZoneInfoRow {
	label: string
	value: string
}

/** Aspectos que se puntúan en una reseña; también son los temas de los que habla (filtros). */
export type AspectId = 'seguridad' | 'transporte' | 'conectividad' | 'comercios' | 'espacios-verdes'

export type AspectScores = Record<AspectId, number>

export interface Review {
	id: string
	initials: string
	/** "Vive en la zona hace 9 años"; null si no lo indicó. */
	yearsInZone: number | null
	verified: boolean
	/** Promedio de los aspectos, de 1 a 5 (con un decimal). */
	rating: number
	aspects: AspectScores
	topics: AspectId[]
	text: string
	/** ISO. */
	publishedAt: string
	helpfulCount: number
	markedHelpfulByMe: boolean
	mine: boolean
}

export interface AspectRating {
	id: AspectId
	/** 0 a 5. */
	value: number
}

export interface ReviewSummary {
	average: number
	total: number
	verified: number
	aspects: AspectRating[]
}

export interface ZoneReviews {
	summary: ReviewSummary
	reviews: Review[]
}

/** Lo que se envía al escribir o editar la reseña propia. */
export interface ReviewDraft {
	/** El puntaje general no se envía: el backend lo calcula a partir de los aspectos. */
	aspects: AspectScores
	text: string
	yearsInZone: number | null
	topics: AspectId[]
}

export interface Answer {
	id: string
	text: string
	initials: string
	/** ISO. */
	publishedAt: string
	mine: boolean
}

export interface Question {
	id: string
	text: string
	initials: string
	/** ISO. */
	publishedAt: string
	mine: boolean
	/** De la más vieja a la más nueva. */
	answers: Answer[]
}

export interface ContributionStats {
	total: number
	approved: number
	pending: number
}

export type CorrectionReason = 'cerro' | 'nombre' | 'ubicacion' | 'categoria' | 'otro'

/** Aporte pendiente de validación, como lo ven los vecinos. */
export interface PendingContribution {
	id: string
	kind: 'punto-nuevo' | 'correccion'
	initials: string
	/** ISO. */
	publishedAt: string
	mine: boolean
	/** true confirmó, false rechazó, null no votó. */
	myVote: boolean | null
	confirmations: number
	rejections: number
	/** Punto nuevo: sus datos. Corrección: el valor propuesto. */
	name: string | null
	categoryId: PoiCategoryId | null
	location: Coordinates | null
	schedule: string | null
	address: string | null
	/** Solo correcciones. */
	placeName: string | null
	reason: CorrectionReason | null
	comment: string | null
}

/** Límite administrativo que contiene a la zona (comuna, partido, provincia). */
export interface Jurisdiction {
	name: string
	/** `admin_level` de OSM: 4 provincia, 5 partido, 7 comuna, 8 localidad, 9 y 10 barrio. */
	adminLevel: number
}

/** Zona según los límites de OpenStreetMap (GET /Zonas/{slug}). */
export interface ZoneBoundary {
	/** Slug de la URL, p. ej. "villa-luro". */
	id: string
	name: string
	adminLevel: number
	/** De la más específica a la menos específica. */
	jurisdictions: Jurisdiction[]
	areaKm2: number
	center: Coordinates
	area: MapArea
}

/** Datos de "Información general" que todavía no vienen del backend (ver data/zones.mock.ts). */
export interface ZoneContent {
	population?: number
	/** Filas de "Información general" además de superficie, población y densidad. */
	extraInfo: ZoneInfoRow[]
	sourcesNote: string
}

export interface ZoneDetail {
	id: string
	/** "Villa Luro, CABA" */
	name: string
	/** Datos que van bajo el título: jurisdicción, comuna, superficie, habitantes. */
	subtitleParts: string[]
	center: Coordinates
	area: MapArea
	info: ZoneInfoRow[]
	sourcesNote: string
}

export type ZoneTabId = 'datos' | 'comunidad'

export type ContributionMode = 'poi' | 'correccion'

export interface PoiContribution {
	categoryId: PoiCategoryId
	name: string
	schedule: string
	address: string
	location: Coordinates
	livesOrWorksInZone: boolean
}

export interface CorrectionContribution {
	placeId: string
	placeName: string
	reason: CorrectionReason
	proposedName?: string
	proposedCategoryId?: PoiCategoryId
	proposedLocation?: Coordinates
	comment?: string
}
