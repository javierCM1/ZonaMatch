import type { Jurisdiction, ZoneBoundary, ZoneContent, ZoneDetail, ZoneInfoRow } from '../types'

const PROVINCE_LEVEL = 4
const PARTIDO_LEVEL = 5

// Nombres oficiales de OSM que en la app se muestran abreviados
const SHORT_NAMES: Record<string, string> = {
	'Ciudad Autónoma de Buenos Aires': 'CABA',
	'Provincia de Buenos Aires': 'Buenos Aires',
}

/** "Partido de La Matanza" → "La Matanza". */
const shortName = (name: string) => SHORT_NAMES[name] ?? name.replace(/^Partido de /, '')

const formatNumber = (value: number, maximumFractionDigits = 0) =>
	value.toLocaleString('es-AR', { maximumFractionDigits })

export const formatArea = (areaKm2: number) => `${formatNumber(areaKm2, 1)} km²`

/**
 * Lo que va después de la coma en el título: "Villa Luro, CABA", "Ramos Mejía, La Matanza".
 * En CABA alcanza con la ciudad; en provincia conviene el partido, que es lo que la gente reconoce.
 */
function titleSuffix(jurisdictions: Jurisdiction[]): string | undefined {
	const province = jurisdictions.find((item) => item.adminLevel === PROVINCE_LEVEL)
	const partido = jurisdictions.find((item) => item.adminLevel === PARTIDO_LEVEL)

	const reference = province && shortName(province.name) === 'CABA' ? province : (partido ?? province)

	return reference && shortName(reference.name)
}

export function zoneTitle(name: string, jurisdictions: Jurisdiction[]): string {
	const suffix = titleSuffix(jurisdictions)

	return suffix ? `${shortName(name)}, ${suffix}` : shortName(name)
}

/**
 * De la jurisdicción más amplia a la más chica, más la superficie: "CABA · Comuna 10 · 2,6 km²".
 * Se saltean los nombres repetidos (la localidad y el partido de Ituzaingó se llaman igual).
 */
export function zoneSubtitleParts(jurisdictions: Jurisdiction[], areaKm2: number): string[] {
	const names = [...jurisdictions].reverse().map((item) => shortName(item.name))

	return [...new Set(names), formatArea(areaKm2)]
}

function infoRows(boundary: ZoneBoundary, content: ZoneContent): ZoneInfoRow[] {
	const rows: ZoneInfoRow[] = [{ label: 'Superficie', value: formatArea(boundary.areaKm2) }]

	if (content.population) {
		rows.push(
			{ label: 'Población (Censo 2022)', value: `${formatNumber(content.population)} hab.` },
			{ label: 'Densidad', value: `${formatNumber(Math.round(content.population / boundary.areaKm2 / 100) * 100)} hab/km²` },
		)
	}

	return [...rows, ...content.extraInfo]
}

export function buildZoneDetail(boundary: ZoneBoundary, content: ZoneContent): ZoneDetail {
	const { population, sourcesNote } = content
	const subtitleParts = zoneSubtitleParts(boundary.jurisdictions, boundary.areaKm2)

	if (population) {
		subtitleParts.push(`${formatNumber(population)} hab.`)
	}

	return {
		sourcesNote,
		id: boundary.id,
		name: zoneTitle(boundary.name, boundary.jurisdictions),
		subtitleParts,
		center: boundary.center,
		area: boundary.area,
		info: infoRows(boundary, content),
	}
}
