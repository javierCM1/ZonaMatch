import { useMemo, useState } from 'react'
import { Dialog } from '../../../shared/components/dialog'
import { Button } from '../../../shared/components/button'
import { InputText } from '../../../shared/components/input-text'
import { Map } from '../../../shared/components/map'
import type { MapMarker } from '../../../shared/components/map'
import { useGeolocationZone } from '../../../shared/api/api.geolocation'
import type { GeolocationCoordinates, GeolocationZone } from '../../../shared/api/api.geolocation'
import poiTagsData from '../data/poi-tags.json'
import type { PointOfInterest } from './ZoneStep'

interface PoiTag {
	id: string
	label: string
}

const POI_TAGS = poiTagsData as PoiTag[]
const CUSTOM_TAG_ID = 'custom'

interface CandidatePoint {
	id: string
	title: string
	address: string
	latitude: number
	longitude: number
}

const PALERMO_CENTER: [number, number] = [-34.5885, -58.4238]

// Placeholder "geocoding" data — a real address search API will replace this.
const MOCK_PLACES: CandidatePoint[] = [
	{
		id: 'sanatorio-guemes',
		title: 'Sanatorio Güemes',
		address: 'Av. Córdoba 3933, Palermo',
		latitude: -34.5885,
		longitude: -58.4238,
	},
	{
		id: 'club-atletico-palermo',
		title: 'Club Atlético Palermo',
		address: 'Av. Sarmiento 2601, Palermo',
		latitude: -34.5765,
		longitude: -58.4172,
	},
	{
		id: 'colegio-nacional',
		title: 'Colegio Nacional Buenos Aires',
		address: 'Bolívar 263, San Telmo',
		latitude: -34.611,
		longitude: -58.3731,
	},
	{
		id: 'oficina-microcentro',
		title: 'Oficina Microcentro',
		address: 'Av. Corrientes 1200, CABA',
		latitude: -34.6035,
		longitude: -58.3838,
	},
]

function hashString(value: string): number {
	let hash = 0
	for (let index = 0; index < value.length; index += 1) {
		hash = (hash * 31 + value.charCodeAt(index)) >>> 0
	}
	return hash
}

function fallbackCoordinates(query: string): { latitude: number; longitude: number } {
	const hash = hashString(query)
	const latOffset = (((hash % 1000) / 1000) - 0.5) * 0.06
	const lngOffset = ((((hash >> 10) % 1000) / 1000) - 0.5) * 0.06
	return { latitude: PALERMO_CENTER[0] + latOffset, longitude: PALERMO_CENTER[1] + lngOffset }
}

function mapClickPointId(coordinates: GeolocationCoordinates): string {
	return `map:${coordinates.latitude.toFixed(5)},${coordinates.longitude.toFixed(5)}`
}

function formatCoordinates(coordinates: GeolocationCoordinates): string {
	return `${coordinates.latitude.toFixed(4)}, ${coordinates.longitude.toFixed(4)}`
}

function formatZoneAddress(zone: GeolocationZone): string {
	return [zone.partido, zone.provincia].filter(Boolean).join(', ')
}

function searchPlaces(query: string): CandidatePoint[] {
	const normalized = query.trim().toLowerCase()

	if (!normalized) {
		return []
	}

	const matches = MOCK_PLACES.filter(
		(place) => place.title.toLowerCase().includes(normalized) || place.address.toLowerCase().includes(normalized),
	)

	const firstMatch = matches[0]
	const locality = firstMatch ? firstMatch.address.split(',').slice(1).join(',').trim() : 'CABA'
	const coordinates = firstMatch ?? fallbackCoordinates(query)

	const rawAddress: CandidatePoint = {
		id: `address:${query.trim()}`,
		title: query.trim(),
		address: locality,
		latitude: coordinates.latitude,
		longitude: coordinates.longitude,
	}

	return [...matches, rawAddress]
}

export interface NewPoiPopupProps {
	visible: boolean
	onHide: () => void
	onAdd: (poi: PointOfInterest) => void
}

const CHIP_BASE_CLASS = '!h-10 !rounded-full !border !px-4 !text-sm !font-medium !shadow-none'
const CHIP_SELECTED_CLASS = '!border-[#2d493a] !bg-[#e7f2e9] !text-[#2d493a]'
const CHIP_UNSELECTED_CLASS = '!border-[#dfe7df] !bg-white !text-[#56675e]'

export function NewPoiPopup({ visible, onHide, onAdd }: NewPoiPopupProps) {
	const [query, setQuery] = useState('')
	const [history, setHistory] = useState<CandidatePoint[]>([])
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [selectedTagId, setSelectedTagId] = useState<string | null>(null)
	const [customTagLabel, setCustomTagLabel] = useState('')
	const [pointName, setPointName] = useState('')
	const [mapClickCoordinates, setMapClickCoordinates] = useState<GeolocationCoordinates | null>(null)

	const zoneQuery = useGeolocationZone(mapClickCoordinates)

	const searchResults = useMemo(() => searchPlaces(query), [query])

	// The map-click entry is stored in `history` with a loading placeholder;
	// once the reverse-geocoding query settles, overlay the resolved name
	// here instead of writing it back into state.
	const enrichedHistory = useMemo(() => {
		if (!mapClickCoordinates || zoneQuery.isPending) {
			return history
		}

		const id = mapClickPointId(mapClickCoordinates)
		const title = zoneQuery.data?.localidad ?? 'Ubicación seleccionada'
		const address = zoneQuery.data
			? formatZoneAddress(zoneQuery.data) || formatCoordinates(mapClickCoordinates)
			: formatCoordinates(mapClickCoordinates)

		return history.map((point) => (point.id === id ? { ...point, title, address } : point))
	}, [history, mapClickCoordinates, zoneQuery.data, zoneQuery.isPending])

	const visibleList = useMemo(() => {
		const merged = [...searchResults]

		enrichedHistory.forEach((point) => {
			if (!merged.some((item) => item.id === point.id)) {
				merged.push(point)
			}
		})

		return merged.slice(0, 6)
	}, [searchResults, enrichedHistory])

	const selectedPoint = visibleList.find((point) => point.id === selectedId) ?? null

	const markers: MapMarker[] = visibleList.map((point) => ({
		id: point.id,
		latitude: point.latitude,
		longitude: point.longitude,
		label: point.title,
		selected: point.id === selectedId,
		color: point.id === selectedId ? '#286348' : '#59916f',
	}))

	function selectPoint(point: CandidatePoint) {
		setHistory((current) => [point, ...current.filter((item) => item.id !== point.id)].slice(0, 6))
		setSelectedId(point.id)
	}

	function handleMapClick(coordinates: GeolocationCoordinates) {
		setMapClickCoordinates(coordinates)
		selectPoint({
			id: mapClickPointId(coordinates),
			title: 'Buscando ubicación…',
			address: formatCoordinates(coordinates),
			latitude: coordinates.latitude,
			longitude: coordinates.longitude,
		})
	}

	function handleMarkerSelect(marker: MapMarker) {
		const point = visibleList.find((item) => item.id === marker.id)

		if (point) {
			selectPoint(point)
		}
	}

	const resolvedTag =
		selectedTagId === CUSTOM_TAG_ID
			? customTagLabel.trim()
			: (POI_TAGS.find((tag) => tag.id === selectedTagId)?.label ?? '')

	const isResolvingSelectedPoint =
		zoneQuery.isPending && mapClickCoordinates != null && selectedId === mapClickPointId(mapClickCoordinates)

	const canSubmit = Boolean(selectedPoint) && Boolean(resolvedTag) && !isResolvingSelectedPoint

	function resetState() {
		setQuery('')
		setHistory([])
		setSelectedId(null)
		setSelectedTagId(null)
		setCustomTagLabel('')
		setPointName('')
		setMapClickCoordinates(null)
	}

	function handleCancel() {
		resetState()
		onHide()
	}

	function handleSubmit() {
		if (!selectedPoint || !resolvedTag) {
			return
		}

		onAdd({
			id: selectedPoint.id,
			tag: resolvedTag,
			title: pointName.trim() || selectedPoint.title,
			address: selectedPoint.address,
		})
		resetState()
		onHide()
	}

	return (
		<Dialog
			header={
				<div>
					<h2 className="text-lg font-semibold text-[#2d493a]">Agregar punto de interés</h2>
					<p className="mt-1 text-sm font-normal text-[#56675e]">Buscalo por dirección o tocá el mapa, y asignale un tag.</p>
				</div>
			}
			footer={
				<>
					<Button
						className="!h-11 !rounded-full !border !border-[#dfe7df] !bg-white !px-6 !text-sm !font-medium !text-[#2d493a] !shadow-none hover:!bg-[#f4f6f4]"
						label="Cancelar"
						onClick={handleCancel}
						outlined
					/>
					<Button
						className="!h-11 !rounded-full !border-transparent !bg-[#bfdf69] !px-8 !text-sm !font-semibold !text-[#2d493a] !shadow-none enabled:hover:!brightness-95 disabled:!opacity-50"
						disabled={!canSubmit}
						label="Agregar punto"
						onClick={handleSubmit}
					/>
				</>
			}
			onHide={handleCancel}
			size="lg"
			visible={visible}
		>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
				<div className="flex flex-col gap-3">
					<InputText
						fullWidth
						leftIcon={<i className="pi pi-search" />}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Buscar dirección..."
						value={query}
					/>

					{visibleList.length > 0 && (
						<div className="flex flex-col gap-2">
							{visibleList.map((point) => {
								const selected = point.id === selectedId

								return (
									<button
										className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
											selected
												? 'border-[#2d493a] bg-[#e7f2e9]'
												: 'border-[#dfe7df] bg-white hover:bg-[#f4f6f4]'
										}`}
										key={point.id}
										onClick={() => selectPoint(point)}
										type="button"
									>
										<i aria-hidden="true" className="pi pi-map-marker mt-0.5 text-[#2d493a]" />
										<span className="min-w-0">
											<span className="block truncate text-sm font-semibold text-[#2d493a]">{point.title}</span>
											<span className="block truncate text-xs text-[#56675e]">{point.address}</span>
										</span>
									</button>
								)
							})}
						</div>
					)}

					<div className="h-56 overflow-hidden rounded-xl border border-[#e3e8e2]">
						<Map className="h-full w-full" markers={markers} onMapClick={handleMapClick} onMarkerSelect={handleMarkerSelect} />
					</div>
				</div>

				<div className="flex flex-col gap-4">
					<div className="rounded-xl bg-[#e7f2e9] px-4 py-3">
						<span className="text-xs font-semibold uppercase tracking-wide text-[#59916f]">Punto seleccionado</span>
						{selectedPoint ? (
							<>
								<p className="mt-1 text-sm font-semibold text-[#2d493a]">{selectedPoint.title}</p>
								<p className="text-xs text-[#56675e]">{selectedPoint.address}</p>
							</>
						) : (
							<p className="mt-1 text-sm text-[#56675e]">Buscá una dirección o tocá el mapa.</p>
						)}
					</div>

					<div className="flex flex-col gap-2">
						<h3 className="text-sm font-semibold text-[#2d493a]">Tag</h3>
						<div className="flex flex-wrap gap-2">
							{POI_TAGS.map((tag) => (
								<Button
									className={`${CHIP_BASE_CLASS} ${selectedTagId === tag.id ? CHIP_SELECTED_CLASS : CHIP_UNSELECTED_CLASS}`}
									key={tag.id}
									label={tag.label}
									onClick={() => setSelectedTagId(tag.id)}
									outlined
								/>
							))}
							<Button
								className={`${CHIP_BASE_CLASS} ${selectedTagId === CUSTOM_TAG_ID ? CHIP_SELECTED_CLASS : CHIP_UNSELECTED_CLASS}`}
								icon="pi pi-plus"
								label="Tag personalizado"
								onClick={() => setSelectedTagId(CUSTOM_TAG_ID)}
								outlined
							/>
						</div>

						{selectedTagId === CUSTOM_TAG_ID && (
							<InputText
								autoFocus
								fullWidth
								onChange={(event) => setCustomTagLabel(event.target.value)}
								placeholder="Ej: Peluquería, Dentista..."
								value={customTagLabel}
							/>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<label className="text-sm font-medium text-[#2d493a]" htmlFor="poi-name">
							Nombre (opcional)
						</label>
						<InputText
							fullWidth
							id="poi-name"
							onChange={(event) => setPointName(event.target.value)}
							placeholder={selectedPoint?.title ?? 'Nombre del punto'}
							value={pointName}
						/>
					</div>
				</div>
			</div>
		</Dialog>
	)
}
