import type { PoiCategoryId } from '../types'

interface TypeLabel {
	one: string
	other: string
}

// Valor de la etiqueta de OSM que clasificó al punto (campo `tipo` del backend) -> texto para mostrar
const TYPE_LABELS: Record<string, TypeLabel> = {
	station: { one: 'estación de tren', other: 'estaciones de tren' },
	halt: { one: 'apeadero', other: 'apeaderos' },
	tram_stop: { one: 'parada de tranvía', other: 'paradas de tranvía' },
	subway_entrance: { one: 'entrada de subte', other: 'entradas de subte' },
	bus_stop: { one: 'parada de colectivo', other: 'paradas de colectivo' },
	bus_station: { one: 'terminal de ómnibus', other: 'terminales de ómnibus' },
	kindergarten: { one: 'jardín de infantes', other: 'jardines de infantes' },
	school: { one: 'escuela', other: 'escuelas' },
	college: { one: 'instituto terciario', other: 'institutos terciarios' },
	university: { one: 'universidad', other: 'universidades' },
	hospital: { one: 'hospital', other: 'hospitales' },
	clinic: { one: 'clínica', other: 'clínicas' },
	doctors: { one: 'consultorio', other: 'consultorios' },
	dentist: { one: 'dentista', other: 'dentistas' },
	pharmacy: { one: 'farmacia', other: 'farmacias' },
	bank: { one: 'banco', other: 'bancos' },
	marketplace: { one: 'mercado', other: 'mercados' },
	post_office: { one: 'correo', other: 'correos' },
	supermarket: { one: 'supermercado', other: 'supermercados' },
	convenience: { one: 'almacén', other: 'almacenes' },
	bakery: { one: 'panadería', other: 'panaderías' },
	greengrocer: { one: 'verdulería', other: 'verdulerías' },
	butcher: { one: 'carnicería', other: 'carnicerías' },
	sports_centre: { one: 'centro deportivo', other: 'centros deportivos' },
	fitness_centre: { one: 'gimnasio', other: 'gimnasios' },
	stadium: { one: 'estadio', other: 'estadios' },
	swimming_pool: { one: 'pileta', other: 'piletas' },
	park: { one: 'parque o plaza', other: 'parques y plazas' },
	garden: { one: 'jardín', other: 'jardines' },
	nature_reserve: { one: 'reserva natural', other: 'reservas naturales' },
	restaurant: { one: 'restaurante', other: 'restaurantes' },
	cafe: { one: 'café', other: 'cafés' },
	bar: { one: 'bar', other: 'bares' },
	pub: { one: 'pub', other: 'pubs' },
	fast_food: { one: 'local de comida rápida', other: 'locales de comida rápida' },
	ice_cream: { one: 'heladería', other: 'heladerías' },
	theatre: { one: 'teatro', other: 'teatros' },
	cinema: { one: 'cine', other: 'cines' },
	arts_centre: { one: 'centro cultural', other: 'centros culturales' },
	library: { one: 'biblioteca', other: 'bibliotecas' },
	museum: { one: 'museo', other: 'museos' },
	gallery: { one: 'galería de arte', other: 'galerías de arte' },
}

// Cualquier otro shop=* (ferretería, kiosco, concesionaria...) se resume como comercio genérico
const FALLBACK_LABEL: Record<PoiCategoryId, TypeLabel> = {
	transporte: { one: 'punto de transporte', other: 'puntos de transporte' },
	educacion: { one: 'establecimiento educativo', other: 'establecimientos educativos' },
	salud: { one: 'centro de salud', other: 'centros de salud' },
	comercios: { one: 'otro comercio', other: 'otros comercios' },
	deporte: { one: 'lugar para hacer deporte', other: 'lugares para hacer deporte' },
	'espacios-verdes': { one: 'espacio verde', other: 'espacios verdes' },
	cultura: { one: 'lugar', other: 'lugares' },
}

// Tipos que más le importan a quien busca dónde vivir: se muestran primero en el resumen aunque
// haya otros más numerosos (en comercios, las concesionarias suelen ganar por cantidad).
const PRIORITY_TYPES: Partial<Record<PoiCategoryId, string[]>> = {
	transporte: ['station', 'subway_entrance', 'bus_stop'],
	comercios: ['supermarket', 'pharmacy', 'bank', 'greengrocer', 'bakery', 'convenience'],
}

const MAX_TYPES_IN_SUMMARY = 3

function capitalize(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1)
}

function labelFor(categoryId: PoiCategoryId, type: string | null): TypeLabel | undefined {
	return type ? TYPE_LABELS[type] : FALLBACK_LABEL[categoryId]
}

/** Etiqueta en singular para el card de un lugar, p. ej. "Estación de tren". */
export function typeLabel(categoryId: PoiCategoryId, type: string | null): string {
	return capitalize((type && TYPE_LABELS[type]?.one) || FALLBACK_LABEL[categoryId].one.replace(/^otro /, ''))
}

export interface TypeCount {
	type: string | null
	count: number
}

/**
 * Texto del panel "En el radio de…", p. ej. "1 estación de tren  ·  95 paradas de colectivo".
 * Muestra hasta 3 tipos (primero los prioritarios) y agrupa el resto como "otros".
 */
export function summarizeTypes(categoryId: PoiCategoryId, types: TypeCount[]): string {
	if (types.length === 0) {
		return 'Sin lugares registrados'
	}

	// Los tipos sin etiqueta propia se suman en un único grupo genérico
	const grouped = new Map<string, { label: TypeLabel; count: number }>()

	for (const { type, count } of types) {
		const known = type !== null && TYPE_LABELS[type] !== undefined
		const key = known ? type : '__otros__'
		const label = known ? labelFor(categoryId, type)! : FALLBACK_LABEL[categoryId]
		const current = grouped.get(key)
		grouped.set(key, { label, count: (current?.count ?? 0) + count })
	}

	const priority = PRIORITY_TYPES[categoryId] ?? []
	const rank = (key: string) => {
		const index = priority.indexOf(key)
		return index === -1 ? priority.length : index
	}

	const ordered = [...grouped.entries()].sort(([keyA, a], [keyB, b]) => {
		// El grupo genérico siempre va al final
		if (keyA === '__otros__') return 1
		if (keyB === '__otros__') return -1
		return rank(keyA) - rank(keyB) || b.count - a.count
	})

	const shown = ordered.slice(0, MAX_TYPES_IN_SUMMARY)
	const restCount = ordered.slice(MAX_TYPES_IN_SUMMARY).reduce((sum, [, entry]) => sum + entry.count, 0)

	const parts = shown.map(([, { label, count }]) => `${count} ${count === 1 ? label.one : label.other}`)

	if (restCount > 0) {
		parts.push(`${restCount} ${restCount === 1 ? 'otro' : 'otros'}`)
	}

	return parts.join('  ·  ')
}
