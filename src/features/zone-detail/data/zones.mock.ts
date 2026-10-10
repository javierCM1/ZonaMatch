import type { ZoneContent } from '../types'

// Datos de prueba de "Información general" hasta que haya fuentes de censo, alquileres y seguridad.
// El nombre, el límite, el centro y la superficie vienen de GET /Zonas/{slug}; los puntos de interés y la
// comunidad (reseñas, preguntas y aportes), de sus endpoints en /Zonas/{slug}/...
// Los textos y cifras replican el diseño de Figma ("Flujo principal").

const ZONE_CONTENT: Record<string, ZoneContent> = {
	'villa-luro': {
		population: 34_000,
		extraInfo: [
			{ label: 'Hogares con internet fija', value: '88%' },
			{ label: 'Alquiler promedio 3 amb.', value: '$ 880.000' },
			{ label: 'Delitos cada 1.000 hab. (2025)', value: '27 · prom. CABA 36' },
		],
		sourcesNote:
			'Fuentes: Censo 2022 (INDEC) · GCBA Datos Abiertos · Mapa Educativo Nacional · publicaciones de alquiler (sep. 2026). Cada dato indica su nivel geográfico.',
	},
}

/** Zonas sin datos de prueba: solo se muestra lo que viene de OpenStreetMap. */
const EMPTY_CONTENT: ZoneContent = {
	extraInfo: [],
	sourcesNote: 'Fuente: OpenStreetMap. Todavía no hay datos de censo, alquileres ni seguridad para esta zona.',
}

export function getZoneContent(zoneId: string): ZoneContent {
	return ZONE_CONTENT[zoneId] ?? EMPTY_CONTENT
}
