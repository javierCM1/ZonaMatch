import type { AspectId, CorrectionReason, PoiCategory, PoiCategoryId, RadiusMeters } from './types'

// Paleta categórica validada (skill dataviz, todos los pares sobre el fondo del mapa). Las 4 capas que
// arrancan activas pasan los controles de daltonismo entre sí; con las 7 a la vez ninguna paleta puede,
// por eso cada categoría suma un ícono propio como segunda codificación.
const DARK_GLYPH = '#14201a'
const LIGHT_GLYPH = '#ffffff'

export const POI_CATEGORIES: PoiCategory[] = [
	{ id: 'transporte', label: 'Transporte', color: '#2a78d6', icon: 'pi-car', iconColor: LIGHT_GLYPH },
	{ id: 'educacion', label: 'Educación', color: '#eda100', icon: 'pi-graduation-cap', iconColor: DARK_GLYPH },
	{ id: 'salud', label: 'Salud', color: '#e34948', icon: 'pi-heart-fill', iconColor: LIGHT_GLYPH },
	{ id: 'comercios', label: 'Comercios y servicios', color: '#4a3aa7', icon: 'pi-shopping-cart', iconColor: LIGHT_GLYPH },
	{ id: 'deporte', label: 'Deporte', color: '#1baf7a', icon: 'pi-trophy', iconColor: DARK_GLYPH },
	{ id: 'espacios-verdes', label: 'Espacios verdes', color: '#008300', icon: 'pi-sun', iconColor: LIGHT_GLYPH },
	{ id: 'cultura', label: 'Cultura y gastronomía', color: '#e87ba4', icon: 'pi-palette', iconColor: DARK_GLYPH },
]

export const POI_CATEGORY_BY_ID = Object.fromEntries(
	POI_CATEGORIES.map((category) => [category.id, category]),
) as Record<PoiCategoryId, PoiCategory>

export const DEFAULT_ACTIVE_CATEGORIES: PoiCategoryId[] = ['transporte', 'educacion', 'salud', 'comercios']

export const RADIUS_OPTIONS: { value: RadiusMeters; label: string }[] = [
	{ value: 500, label: '500 m' },
	{ value: 1000, label: '1 km' },
	{ value: 2000, label: '2 km' },
]

export const DEFAULT_RADIUS: RadiusMeters = 1000

/** Aspectos de una reseña, en el orden del resumen. */
export const ASPECTS: { id: AspectId; label: string }[] = [
	{ id: 'seguridad', label: 'Seguridad' },
	{ id: 'transporte', label: 'Transporte' },
	{ id: 'conectividad', label: 'Conectividad' },
	{ id: 'comercios', label: 'Comercios y servicios' },
	{ id: 'espacios-verdes', label: 'Espacios verdes' },
]

export const ASPECT_LABEL = Object.fromEntries(ASPECTS.map((aspect) => [aspect.id, aspect.label])) as Record<AspectId, string>

export const CORRECTION_REASONS: { id: CorrectionReason; label: string }[] = [
	{ id: 'cerro', label: 'Cerró o ya no existe' },
	{ id: 'nombre', label: 'El nombre está mal' },
	{ id: 'ubicacion', label: 'Está en otro lugar' },
	{ id: 'categoria', label: 'La categoría está mal' },
	{ id: 'otro', label: 'Otro' },
]

export const CORRECTION_REASON_LABEL = Object.fromEntries(
	CORRECTION_REASONS.map((reason) => [reason.id, reason.label]),
) as Record<CorrectionReason, string>

/** Diferencia de votos con la que un aporte se aprueba o rechaza (igual que en el backend). */
export const VOTES_TO_RESOLVE = 3

export type ReviewFilterId = 'recientes' | AspectId | 'verificados'

export const REVIEW_FILTERS: { id: ReviewFilterId; label: string }[] = [
	{ id: 'recientes', label: 'Más recientes' },
	{ id: 'seguridad', label: 'Seguridad' },
	{ id: 'transporte', label: 'Transporte' },
	{ id: 'conectividad', label: 'Conectividad' },
	{ id: 'verificados', label: 'Vecinos verificados' },
]

// Clases de botón del diseño (pill lima primaria y pill con borde). Se aplican sobre
// el Button compartido, que ya trae el foco accesible y la transición.
export const LIME_BUTTON_CLASS =
	'!rounded-full !border-0 !bg-[#b7e24d] !px-6 !py-3 !text-[15px] !font-semibold !text-[#1f4a38] hover:!bg-[#a6d13c] disabled:!cursor-not-allowed disabled:!opacity-50'

export const GHOST_BUTTON_CLASS =
	'!rounded-full !border-[1.5px] !border-[#e3e8e2] !bg-transparent !px-6 !py-3 !text-[15px] !font-semibold !text-[#1f4a38] hover:!bg-[#f2faf3]'

export const CARD_CLASS = 'rounded-2xl border border-[#e3e8e2] bg-white'

export const TEXTAREA_CLASS =
	'w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition-colors placeholder:text-slate-400 hover:border-emerald-400 focus:border-emerald-500 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.15)] focus:outline-none'

export const FIELD_LABEL_CLASS = 'text-[13px] font-medium text-[#586a61]'

/** Texto de error de un envío, debajo del formulario. */
export const ERROR_TEXT_CLASS = 'text-[13px] font-medium text-[#b42318]'
