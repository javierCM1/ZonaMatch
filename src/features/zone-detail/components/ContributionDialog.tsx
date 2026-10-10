import { useCallback, useMemo, useRef, useState } from 'react'
import { fetchAddressByCoordinates } from '../../../shared/api/api.geolocation'
import { Button } from '../../../shared/components/button'
import { Checkbox } from '../../../shared/components/checkbox'
import { ChoiceChip } from '../../../shared/components/chip'
import { Dialog } from '../../../shared/components/dialog'
import { InputText } from '../../../shared/components/input-text'
import { Map } from '../../../shared/components/map'
import type { MapClickEvent, MapMarker } from '../../../shared/components/map'
import { communityErrorMessage, useSuggestCorrection, useSuggestPoi } from '../api/community.api'
import { useAreaPois } from '../api/zone-pois.api'
import {
	CORRECTION_REASONS,
	ERROR_TEXT_CLASS,
	FIELD_LABEL_CLASS,
	GHOST_BUTTON_CLASS,
	LIME_BUTTON_CLASS,
	POI_CATEGORIES,
	POI_CATEGORY_BY_ID,
	TEXTAREA_CLASS,
	VOTES_TO_RESOLVE,
} from '../constants'
import type {
	ContributionMode,
	Coordinates,
	CorrectionReason,
	PoiCategoryId,
	ZoneDetail,
	ZonePoi,
} from '../types'
import { formatCoordinates } from '../utils/geo'
import { CategoryBadge } from './CategoryBadge'

interface ContributionDialogProps {
	zone: ZoneDetail
	initialMode: ContributionMode
	onHide: () => void
	/** El aporte se guardó y quedó pendiente de validación. */
	onSent: () => void
}

const MODES: { id: ContributionMode; label: string }[] = [
	{ id: 'poi', label: 'Nuevo punto de interés' },
	{ id: 'correccion', label: 'Corregir un dato existente' },
]

const NEW_LOCATION_MARKER_COLOR = '#ef4444'
const ALL_CATEGORIES = POI_CATEGORIES.map((category) => category.id)
const MAX_COMMENT = 500

const locationMarker = (location: Coordinates, label: string): MapMarker => ({
	id: 'new-location',
	...location,
	color: NEW_LOCATION_MARKER_COLOR,
	label,
	selected: true,
})

export function ContributionDialog({ zone, initialMode, onHide, onSent }: ContributionDialogProps) {
	const [mode, setMode] = useState<ContributionMode>(initialMode)
	const suggestPoi = useSuggestPoi(zone.id)
	const suggestCorrection = useSuggestCorrection(zone.id)

	// Cada pestaña guarda su formulario; al cambiar de pestaña no se pierde lo cargado
	const [poiForm, setPoiForm] = useState<PoiFormState>(EMPTY_POI_FORM)
	const [correctionForm, setCorrectionForm] = useState<CorrectionFormState>(EMPTY_CORRECTION_FORM)

	const poiReady = isPoiReady(poiForm)
	const correctionReady = isCorrectionReady(correctionForm)
	const pending = suggestPoi.isPending || suggestCorrection.isPending
	const canSubmit = !pending && (mode === 'poi' ? poiReady : correctionReady)

	const handleSubmit = () => {
		if (!canSubmit) {
			return
		}

		if (mode === 'poi' && poiForm.categoryId && poiForm.location) {
			suggestPoi.mutate(
				{
					categoryId: poiForm.categoryId,
					name: poiForm.name.trim(),
					schedule: poiForm.schedule.trim(),
					address: poiForm.address.trim(),
					location: poiForm.location,
					livesOrWorksInZone: poiForm.livesOrWorksInZone,
				},
				{ onSuccess: onSent },
			)
			return
		}

		const { place, reason } = correctionForm

		if (mode === 'correccion' && place && reason) {
			suggestCorrection.mutate(
				{
					placeId: place.id,
					placeName: place.name,
					reason,
					proposedName: reason === 'nombre' ? correctionForm.proposedName.trim() : undefined,
					proposedCategoryId: reason === 'categoria' ? (correctionForm.proposedCategoryId ?? undefined) : undefined,
					proposedLocation: reason === 'ubicacion' ? (correctionForm.proposedLocation ?? undefined) : undefined,
					comment: correctionForm.comment.trim() || undefined,
				},
				{ onSuccess: onSent },
			)
		}
	}

	const error = mode === 'poi' ? suggestPoi.error : suggestCorrection.error

	return (
		<Dialog
			footer={
				<div className="flex w-full flex-wrap items-center gap-3">
					<p className="mr-auto text-[13px] text-[#8a9a91]">
						Se publica cuando lo confirman {VOTES_TO_RESOLVE} vecinos más de los que lo rechazan
					</p>
					<Button className={GHOST_BUTTON_CLASS} label="Cancelar" onClick={onHide} variant="outlined" />
					<Button
						className={LIME_BUTTON_CLASS}
						disabled={!canSubmit}
						label={pending ? 'Enviando…' : 'Enviar aporte'}
						onClick={handleSubmit}
					/>
				</div>
			}
			header={
				<div className="flex flex-col gap-1">
					<h2 className="text-[22px] font-bold text-[#14201a]">Aportar a la zona</h2>
					<p className="text-sm font-normal text-[#586a61]">
						{zone.name} · Los aportes se publican cuando los validan otros vecinos.
					</p>
				</div>
			}
			onHide={onHide}
			size="xl"
			visible
		>
			<div className="flex flex-col gap-5">
				<div className="flex w-fit gap-1 rounded-xl bg-[#fafbf8] p-1" role="tablist">
					{MODES.map((option) => {
						const active = mode === option.id

						return (
							<button
								aria-selected={active}
								className={`cursor-pointer rounded-[9px] border px-4 py-2 text-sm transition-colors ${
									active
										? 'border-[#e3e8e2] bg-white font-semibold text-[#14201a]'
										: 'border-transparent font-medium text-[#586a61] hover:text-[#14201a]'
								}`}
								key={option.id}
								onClick={() => setMode(option.id)}
								role="tab"
								type="button"
							>
								{option.label}
							</button>
						)
					})}
				</div>

				{mode === 'correccion' ? (
					<CorrectionForm form={correctionForm} onChange={setCorrectionForm} zone={zone} />
				) : (
					<PoiForm form={poiForm} onChange={setPoiForm} zone={zone} />
				)}

				{error && (
					<p className={ERROR_TEXT_CLASS} role="alert">
						{communityErrorMessage(error, 'No pudimos enviar tu aporte. Intentá de nuevo.')}
					</p>
				)}
			</div>
		</Dialog>
	)
}

// ---------- Nuevo punto de interés ----------

interface PoiFormState {
	address: string
	location: Coordinates | null
	categoryId: PoiCategoryId | null
	name: string
	schedule: string
	livesOrWorksInZone: boolean
}

const EMPTY_POI_FORM: PoiFormState = {
	address: '',
	location: null,
	categoryId: null,
	name: '',
	schedule: '',
	livesOrWorksInZone: true,
}

const isPoiReady = (form: PoiFormState) => form.name.trim().length >= 2 && form.categoryId !== null && form.location !== null

interface FormProps<T> {
	zone: ZoneDetail
	form: T
	onChange: (update: (current: T) => T) => void
}

function PoiForm({ zone, form, onChange }: FormProps<PoiFormState>) {
	const addressRequestRef = useRef(0)
	const set = <K extends keyof PoiFormState>(key: K, value: PoiFormState[K]) => onChange((current) => ({ ...current, [key]: value }))

	const markers = useMemo<MapMarker[]>(
		() => (form.location ? [locationMarker(form.location, 'Ubicación del nuevo punto')] : []),
		[form.location],
	)

	// Al marcar un punto en el mapa se completa la dirección con el servicio de
	// geolocalización; si falla, la persona igual conserva las coordenadas.
	const handleMapClick = useCallback(
		async ({ latitude, longitude }: MapClickEvent) => {
			const coordinates = { latitude, longitude }
			const requestId = ++addressRequestRef.current

			onChange((current) => ({ ...current, location: coordinates, address: formatCoordinates(coordinates) }))

			try {
				const result = await fetchAddressByCoordinates(coordinates)
				const resolved = result.direccionCompleta || [result.calle, result.altura].filter(Boolean).join(' ')

				if (resolved && addressRequestRef.current === requestId) {
					onChange((current) => ({ ...current, address: resolved }))
				}
			} catch {
				// Sin dirección resuelta se mantienen las coordenadas ya cargadas.
			}
		},
		[onChange],
	)

	return (
		<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
			<div className="flex min-w-0 flex-col gap-3">
				<InputText
					aria-label="Dirección del lugar"
					fullWidth
					leftIcon={<i aria-hidden="true" className="pi pi-search text-sm" />}
					onChange={(event) => {
						addressRequestRef.current += 1
						set('address', event.target.value)
					}}
					placeholder="Marcá el lugar en el mapa o escribí la dirección"
					value={form.address}
				/>
				<div className="h-[300px] overflow-hidden rounded-xl border border-[#e3e8e2]">
					<Map fitToArea markers={markers} onMapClick={handleMapClick} selectedArea={zone.area} />
				</div>
				{!form.location && <p className="text-xs text-[#8a9a91]">Tocá el mapa, dentro de la zona, donde está el lugar.</p>}
			</div>

			<div className="flex flex-col gap-3.5">
				<div className="flex flex-col gap-1">
					<p className="text-sm font-semibold text-[#14201a]">Categoría</p>
					<p className="text-xs text-[#8a9a91]">Categorías del listado estándar de ZonaMatch</p>
				</div>
				<div aria-label="Categoría" className="flex flex-wrap gap-2" role="group">
					{POI_CATEGORIES.map((category) => (
						<ChoiceChip
							key={category.id}
							label={category.label}
							leading={<CategoryBadge category={category} size={18} />}
							onClick={() => set('categoryId', category.id)}
							selected={form.categoryId === category.id}
						/>
					))}
				</div>

				<div className="flex flex-col gap-1.5">
					<label className={FIELD_LABEL_CLASS} htmlFor="contribution-name">
						Nombre del lugar
					</label>
					<InputText
						fullWidth
						id="contribution-name"
						maxLength={120}
						onChange={(event) => set('name', event.target.value)}
						value={form.name}
					/>
				</div>

				<div className="flex flex-col gap-1.5">
					<label className={FIELD_LABEL_CLASS} htmlFor="contribution-schedule">
						Días y horario (opcional)
					</label>
					<InputText
						fullWidth
						id="contribution-schedule"
						maxLength={120}
						onChange={(event) => set('schedule', event.target.value)}
						placeholder="Lun. a sáb. · 9 a 19 h"
						value={form.schedule}
					/>
				</div>

				<Checkbox
					checked={form.livesOrWorksInZone}
					label="Vivo o trabajo en esta zona"
					labelClassName="font-medium text-[#14201a]"
					onChange={(event) => set('livesOrWorksInZone', Boolean(event.checked))}
				/>
			</div>
		</div>
	)
}

// ---------- Corregir un dato existente ----------

interface CorrectionFormState {
	place: ZonePoi | null
	reason: CorrectionReason | null
	proposedName: string
	proposedCategoryId: PoiCategoryId | null
	proposedLocation: Coordinates | null
	comment: string
}

const EMPTY_CORRECTION_FORM: CorrectionFormState = {
	place: null,
	reason: null,
	proposedName: '',
	proposedCategoryId: null,
	proposedLocation: null,
	comment: '',
}

function isCorrectionReady(form: CorrectionFormState): boolean {
	if (!form.place || !form.reason) {
		return false
	}

	switch (form.reason) {
		case 'nombre':
			return form.proposedName.trim().length > 0 && form.proposedName.trim() !== form.place.name
		case 'categoria':
			return form.proposedCategoryId !== null && form.proposedCategoryId !== form.place.categoryId
		case 'ubicacion':
			return form.proposedLocation !== null
		case 'otro':
			return form.comment.trim().length > 0
		default:
			return true
	}
}

function CorrectionForm({ zone, form, onChange }: FormProps<CorrectionFormState>) {
	const [placeFilter, setPlaceFilter] = useState('')
	const poisQuery = useAreaPois({ kind: 'zone', zoneId: zone.id }, ALL_CATEGORIES)
	const set = <K extends keyof CorrectionFormState>(key: K, value: CorrectionFormState[K]) =>
		onChange((current) => ({ ...current, [key]: value }))

	const pois = poisQuery.data?.pois
	const { place, reason } = form

	const markers = useMemo<MapMarker[]>(() => {
		const asMarker = (poi: ZonePoi, selected = false): MapMarker => {
			const category = POI_CATEGORY_BY_ID[poi.categoryId]
			return {
				id: poi.id,
				latitude: poi.latitude,
				longitude: poi.longitude,
				color: category.color,
				icon: category.icon,
				iconColor: category.iconColor,
				label: poi.name,
				selected,
			}
		}

		// Elegido el lugar, el mapa muestra solo ese (y la ubicación nueva, si se corrige la ubicación)
		if (place) {
			return [
				asMarker(place, true),
				...(reason === 'ubicacion' && form.proposedLocation ? [locationMarker(form.proposedLocation, 'Ubicación correcta')] : []),
			]
		}

		const filter = placeFilter.trim().toLocaleLowerCase('es')
		return (pois ?? []).filter((poi) => !filter || poi.name.toLocaleLowerCase('es').includes(filter)).map((poi) => asMarker(poi))
	}, [pois, place, reason, form.proposedLocation, placeFilter])

	const handleMarkerSelect = useCallback(
		(marker: MapMarker) => {
			const selected = pois?.find((poi) => poi.id === marker.id)

			if (selected) {
				onChange((current) => (current.place ? current : { ...EMPTY_CORRECTION_FORM, place: selected }))
			}
		},
		[pois, onChange],
	)

	const handleMapClick = useCallback(
		({ latitude, longitude }: MapClickEvent) =>
			onChange((current) =>
				current.place && current.reason === 'ubicacion' ? { ...current, proposedLocation: { latitude, longitude } } : current,
			),
		[onChange],
	)

	const hint = !place
		? 'Tocá en el mapa el lugar que querés corregir.'
		: reason === 'ubicacion'
			? 'Tocá en el mapa dónde está realmente el lugar.'
			: null

	return (
		<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
			<div className="flex min-w-0 flex-col gap-3">
				{!place && (
					<InputText
						aria-label="Buscar el lugar por nombre"
						fullWidth
						leftIcon={<i aria-hidden="true" className="pi pi-search text-sm" />}
						onChange={(event) => setPlaceFilter(event.target.value)}
						placeholder="Buscá el lugar por nombre o tocalo en el mapa"
						value={placeFilter}
					/>
				)}
				<div className="relative h-[300px] overflow-hidden rounded-xl border border-[#e3e8e2]">
					<Map
						fitToArea
						markers={markers}
						onMapClick={handleMapClick}
						onMarkerSelect={handleMarkerSelect}
						selectedArea={zone.area}
					/>
					{poisQuery.isFetching && (
						<p className="absolute right-3 top-3 z-[1000] rounded-lg bg-white/90 px-3 py-1.5 text-xs text-[#586a61] shadow-sm" role="status">
							Cargando lugares…
						</p>
					)}
				</div>
				{hint && <p className="text-xs text-[#8a9a91]">{hint}</p>}
			</div>

			<div className="flex flex-col gap-3.5">
				{!place ? (
					<p className="rounded-xl bg-[#fafbf8] px-4 py-6 text-sm text-[#586a61]">
						Elegí en el mapa el lugar con el dato equivocado. Si el lugar no aparece, sumalo desde “Nuevo punto de interés”.
					</p>
				) : (
					<>
						<div className="flex items-start gap-2.5 rounded-xl bg-[#fafbf8] px-3.5 py-3">
							<CategoryBadge category={POI_CATEGORY_BY_ID[place.categoryId]} size={22} />
							<div className="flex min-w-0 flex-1 flex-col gap-0.5">
								<p className="text-sm font-semibold text-[#14201a]">{place.name}</p>
								<p className="text-xs text-[#586a61]">
									{POI_CATEGORY_BY_ID[place.categoryId].label} · {place.detail}
								</p>
							</div>
							<button
								className="cursor-pointer text-xs font-semibold text-[#1f4a38] underline"
								onClick={() => onChange(() => EMPTY_CORRECTION_FORM)}
								type="button"
							>
								Cambiar
							</button>
						</div>

						<div className="flex flex-col gap-2">
							<p className="text-sm font-semibold text-[#14201a]">¿Qué está mal?</p>
							<div aria-label="Qué está mal" className="flex flex-wrap gap-2" role="group">
								{CORRECTION_REASONS.map((option) => (
									<ChoiceChip
										key={option.id}
										label={option.label}
										onClick={() => set('reason', option.id)}
										selected={reason === option.id}
									/>
								))}
							</div>
						</div>

						{reason === 'nombre' && (
							<div className="flex flex-col gap-1.5">
								<label className={FIELD_LABEL_CLASS} htmlFor="correction-name">
									Nombre correcto
								</label>
								<InputText
									fullWidth
									id="correction-name"
									maxLength={120}
									onChange={(event) => set('proposedName', event.target.value)}
									value={form.proposedName}
								/>
							</div>
						)}

						{reason === 'categoria' && (
							<div aria-label="Categoría correcta" className="flex flex-wrap gap-2" role="group">
								{POI_CATEGORIES.filter((category) => category.id !== place.categoryId).map((category) => (
									<ChoiceChip
										key={category.id}
										label={category.label}
										leading={<CategoryBadge category={category} size={18} />}
										onClick={() => set('proposedCategoryId', category.id)}
										selected={form.proposedCategoryId === category.id}
									/>
								))}
							</div>
						)}

						{reason === 'ubicacion' && (
							<p className="text-[13px] text-[#586a61]">
								{form.proposedLocation
									? `Ubicación nueva: ${formatCoordinates(form.proposedLocation)}`
									: 'Marcá en el mapa la ubicación correcta (tiene que estar dentro de la zona).'}
							</p>
						)}

						{reason && (
							<div className="flex flex-col gap-1.5">
								<label className={FIELD_LABEL_CLASS} htmlFor="correction-comment">
									{reason === 'otro' ? 'Contanos qué hay que corregir' : 'Comentario (opcional)'}
								</label>
								<textarea
									className={TEXTAREA_CLASS}
									id="correction-comment"
									maxLength={MAX_COMMENT}
									onChange={(event) => set('comment', event.target.value)}
									rows={3}
									value={form.comment}
								/>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}
