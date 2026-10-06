import { useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Dialog } from '../../../shared/components/dialog'
import { Button } from '../../../shared/components/button'
import { InputText } from '../../../shared/components/input-text'
import { Map } from '../../../shared/components/map'
import type { MapMarker } from '../../../shared/components/map'
import { fetchAddressByCoordinates, geolocationAddressQueryKey } from '../../../shared/api/api.geolocation'
import type { GeolocationAddress, GeolocationCoordinates } from '../../../shared/api/api.geolocation'
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

// Street + house number, e.g. "Av. Córdoba 3933" — kept separate from the
// locality so it can be guaranteed to show up in the address line below,
// regardless of what ends up in the title.
function formatStreet(address: GeolocationAddress): string {
	return [address.calle, address.altura].filter(Boolean).join(' ')
}

function formatLocality(address: GeolocationAddress): string {
	return [address.localidad, address.partido ?? address.comuna, address.provincia].filter(Boolean).join(', ')
}

function resolveTitle(address: GeolocationAddress): string {
	return address.nombre || formatStreet(address) || address.direccionCompleta || address.localidad || 'Ubicación seleccionada'
}

// The street number is the whole point of a map click, so it's always
// included here even when `nombre` (used for the title) already mentions
// the street — this is what was going missing before.
function resolveSubtitle(address: GeolocationAddress, coordinates: GeolocationCoordinates): string {
	if (address.direccionCompleta) {
		return address.direccionCompleta
	}

	const combined = [formatStreet(address), formatLocality(address)].filter(Boolean).join(', ')
	return combined || formatCoordinates(coordinates)
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
	const queryClient = useQueryClient()

	const [query, setQuery] = useState('')
	const [history, setHistory] = useState<CandidatePoint[]>([])
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [resolvingIds, setResolvingIds] = useState<ReadonlySet<string>>(new Set())
	const [selectedTagId, setSelectedTagId] = useState<string | null>(null)
	const [customTagLabel, setCustomTagLabel] = useState('')
	const [pointName, setPointName] = useState('')

	const searchResults = useMemo(() => searchPlaces(query), [query])

	const visibleList = useMemo(() => {
		const merged = [...searchResults]

		history.forEach((point) => {
			if (!merged.some((item) => item.id === point.id)) {
				merged.push(point)
			}
		})

		return merged.slice(0, 6)
	}, [searchResults, history])

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

	function updatePoint(id: string, changes: Partial<Pick<CandidatePoint, 'title' | 'address'>>) {
		setHistory((current) => current.map((point) => (point.id === id ? { ...point, ...changes } : point)))
	}

	// Each map click resolves independently: the placeholder is selected right
	// away, and whichever lookup settles later only ever touches its own
	// point by id — so adding several points in a row no longer makes the
	// earlier ones snap back to "Buscando ubicación…".
	async function handleMapClick(coordinates: GeolocationCoordinates) {
		const id = mapClickPointId(coordinates)

		selectPoint({
			id,
			title: 'Buscando ubicación…',
			address: formatCoordinates(coordinates),
			latitude: coordinates.latitude,
			longitude: coordinates.longitude,
		})
		setResolvingIds((current) => new Set(current).add(id))

		try {
			const address = await queryClient.query({
				queryKey: geolocationAddressQueryKey(coordinates),
				queryFn: ({ signal }) => fetchAddressByCoordinates(coordinates, signal),
				staleTime: 5 * 60_000,
			})
			updatePoint(id, { title: resolveTitle(address), address: resolveSubtitle(address, coordinates) })
		} catch {
			updatePoint(id, { title: 'Ubicación seleccionada', address: formatCoordinates(coordinates) })
		} finally {
			setResolvingIds((current) => {
				const next = new Set(current)
				next.delete(id)
				return next
			})
		}
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

	const isResolvingSelectedPoint = selectedId != null && resolvingIds.has(selectedId)

	const canSubmit = Boolean(selectedPoint) && Boolean(resolvedTag) && !isResolvingSelectedPoint

	function resetState() {
		setQuery('')
		setHistory([])
		setSelectedId(null)
		setResolvingIds(new Set())
		setSelectedTagId(null)
		setCustomTagLabel('')
		setPointName('')
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
			size="xl"
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

					<div className="h-80 overflow-hidden rounded-xl border border-[#e3e8e2]">
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
