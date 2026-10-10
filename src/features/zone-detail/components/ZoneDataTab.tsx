import { useCallback, useMemo, useState } from 'react'
import { Button } from '../../../shared/components/button'
import { ChoiceChip } from '../../../shared/components/chip'
import { Map } from '../../../shared/components/map'
import type { MapClickEvent, MapMarker } from '../../../shared/components/map'
import {
	CARD_CLASS,
	DEFAULT_ACTIVE_CATEGORIES,
	DEFAULT_RADIUS,
	LIME_BUTTON_CLASS,
	POI_CATEGORIES,
	POI_CATEGORY_BY_ID,
	RADIUS_OPTIONS,
} from '../constants'
import { useAreaPoiSummary, useAreaPois } from '../api/zone-pois.api'
import type { PoiArea } from '../api/zone-pois.api'
import type { Coordinates, PoiCategoryId, RadiusMeters, ZoneDetail } from '../types'
import { summarizeTypes } from '../utils/poi-labels'
import { CategoryBadge } from './CategoryBadge'

interface ZoneDataTabProps {
	zone: ZoneDetail
}

export function ZoneDataTab({ zone }: ZoneDataTabProps) {
	const [activeCategories, setActiveCategories] = useState<PoiCategoryId[]>(DEFAULT_ACTIVE_CATEGORIES)
	const [radius, setRadius] = useState<RadiusMeters>(DEFAULT_RADIUS)
	const [selectedPoiId, setSelectedPoiId] = useState<string | null>(null)
	// Punto tocado en el mapa: con él se busca en un radio; sin él, en toda la zona
	const [searchPoint, setSearchPoint] = useState<Coordinates | null>(null)

	const radiusLabel = RADIUS_OPTIONS.find((option) => option.value === radius)?.label ?? ''

	const area = useMemo<PoiArea>(
		() => (searchPoint ? { kind: 'radius', center: searchPoint, radius } : { kind: 'zone', zoneId: zone.id }),
		[searchPoint, radius, zone.id],
	)
	const areaLabel = searchPoint ? `radio de ${radiusLabel}` : 'toda la zona'

	const poisQuery = useAreaPois(area, activeCategories)
	const summaryQuery = useAreaPoiSummary(area)

	// Mientras llega la respuesta nueva se muestran los datos anteriores, filtrados a las capas activas
	// para que apagar una capa se vea al instante
	const visiblePois = useMemo(
		() =>
			activeCategories.length === 0
				? []
				: (poisQuery.data?.pois ?? []).filter((poi) => activeCategories.includes(poi.categoryId)),
		[poisQuery.data, activeCategories],
	)

	const markers = useMemo<MapMarker[]>(
		() =>
			visiblePois.map((poi) => {
				const category = POI_CATEGORY_BY_ID[poi.categoryId]

				return {
					id: poi.id,
					latitude: poi.latitude,
					longitude: poi.longitude,
					color: category.color,
					icon: category.icon,
					iconColor: category.iconColor,
					label: poi.name,
					selected: poi.id === selectedPoiId,
				}
			}),
		[visiblePois, selectedPoiId],
	)

	const handleMarkerSelect = useCallback((marker: MapMarker) => setSelectedPoiId(marker.id), [])
	const handleMapClick = useCallback(({ latitude, longitude }: MapClickEvent) => {
		setSearchPoint({ latitude, longitude })
		setSelectedPoiId(null)
	}, [])

	const toggleCategory = (categoryId: PoiCategoryId) => {
		setActiveCategories((current) =>
			current.includes(categoryId) ? current.filter((id) => id !== categoryId) : [...current, categoryId],
		)
	}

	const selectedPoi = visiblePois.find((poi) => poi.id === selectedPoiId)
	const legendCategories = POI_CATEGORIES.filter((category) => activeCategories.includes(category.id))

	return (
		<div className="flex flex-col gap-6 lg:flex-row lg:items-start">
			<div className="flex min-w-0 flex-1 flex-col gap-3.5">
				<div aria-label="Capas del mapa" className="flex flex-wrap items-center gap-2" role="group">
					{POI_CATEGORIES.map((category) => (
						<ChoiceChip
							key={category.id}
							label={category.label}
							leading={<CategoryBadge category={category} size={18} />}
							onClick={() => toggleCategory(category.id)}
							selected={activeCategories.includes(category.id)}
						/>
					))}
				</div>

				<div aria-label="Área de búsqueda" className="flex flex-wrap items-center gap-2" role="group">
					<span className="text-[13px] font-medium text-[#586a61]">Buscar en:</span>
					<ChoiceChip label="Toda la zona" onClick={() => setSearchPoint(null)} selected={!searchPoint} />
					{searchPoint ? (
						RADIUS_OPTIONS.map((option) => (
							<ChoiceChip
								key={option.value}
								label={`Radio ${option.label}`}
								onClick={() => setRadius(option.value)}
								selected={radius === option.value}
							/>
						))
					) : (
						<span className="text-[13px] text-[#586a61]">· Tocá el mapa para buscar en un radio alrededor de ese punto</span>
					)}
				</div>

				<div className="relative h-[60vh] min-h-[420px] overflow-hidden rounded-2xl border border-[#e3e8e2]">
					<Map
						circle={searchPoint ? { ...searchPoint, radiusMeters: radius } : undefined}
						fitToArea={!searchPoint}
						markers={markers}
						onMapClick={handleMapClick}
						onMarkerSelect={handleMarkerSelect}
						selectedArea={zone.area}
					/>

					<div className="pointer-events-none absolute left-4 top-4 z-[1000] flex flex-col gap-2 rounded-xl border border-[#e3e8e2] bg-white px-4 py-3.5">
						<p className="text-xs font-semibold text-[#14201a]">Capas activas · {areaLabel}</p>
						{legendCategories.length === 0 ? (
							<p className="text-xs text-[#586a61]">Sin capas seleccionadas</p>
						) : (
							legendCategories.map((category) => (
								<p className="flex items-center gap-2 text-xs text-[#14201a]" key={category.id}>
									<CategoryBadge category={category} />
									{category.label}
								</p>
							))
						)}
					</div>

					<div className="absolute right-4 top-4 z-[1000] flex flex-col items-end gap-2" role="status">
						{poisQuery.isFetching && (
							<p className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-[#586a61] shadow-sm">
								Cargando puntos de interés…
							</p>
						)}
						{poisQuery.isError && !poisQuery.isFetching && (
							<div className="flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-xs text-[#14201a] shadow-sm">
								No pudimos cargar los puntos de interés.
								<button
									className="cursor-pointer font-semibold text-[#1f4a38] underline"
									onClick={() => void poisQuery.refetch()}
									type="button"
								>
									Reintentar
								</button>
							</div>
						)}
						{poisQuery.data?.truncated && !poisQuery.isFetching && (
							<p className="rounded-lg bg-white/90 px-3 py-1.5 text-xs text-[#586a61] shadow-sm">
								Se muestran los {visiblePois.length} lugares más cercanos {searchPoint ? 'al punto' : 'al centro de la zona'}
							</p>
						)}
					</div>

					{selectedPoi && (
						<div className="absolute bottom-10 left-4 z-[1000] flex flex-col gap-1 rounded-xl border border-[#e3e8e2] bg-white px-4 py-3.5">
							<p className="text-sm font-semibold text-[#14201a]">{selectedPoi.name}</p>
							<p className="whitespace-pre text-xs text-[#586a61]">
								{`${POI_CATEGORY_BY_ID[selectedPoi.categoryId].label}  ·  ${selectedPoi.detail}`}
							</p>
							<p className="text-[11px] text-[#8a9a91]">Fuente: {selectedPoi.source}</p>
						</div>
					)}
				</div>
			</div>

			<div className="flex min-w-0 flex-col gap-5 lg:w-[40%] lg:max-w-[620px] lg:shrink-0">
				<section aria-labelledby="zone-info-title" className={`${CARD_CLASS} flex flex-col gap-3 px-[22px] py-5`}>
					<h2 className="text-[17px] font-semibold text-[#14201a]" id="zone-info-title">
						Información general
					</h2>
					<dl className="flex flex-col gap-3">
						{zone.info.map((row) => (
							<div className="flex items-center justify-between gap-4 text-sm" key={row.label}>
								<dt className="text-[#586a61]">{row.label}</dt>
								<dd className="text-right font-semibold text-[#14201a]">{row.value}</dd>
							</div>
						))}
					</dl>
				</section>

				<section aria-labelledby="zone-radius-title" className={`${CARD_CLASS} flex flex-col gap-3 px-[22px] py-5`}>
					<h2 className="text-[17px] font-semibold text-[#14201a]" id="zone-radius-title">
						{searchPoint ? `En el radio de ${radiusLabel}` : 'En la zona'}
					</h2>
					{summaryQuery.isPending ? (
						<p className="text-[13px] text-[#586a61]" role="status">
							Contando lugares…
						</p>
					) : summaryQuery.isError ? (
						<div className="flex items-center gap-2 text-[13px] text-[#14201a]">
							No pudimos calcular el resumen.
							<button
								className="cursor-pointer font-semibold text-[#1f4a38] underline"
								onClick={() => void summaryQuery.refetch()}
								type="button"
							>
								Reintentar
							</button>
						</div>
					) : (
						<ul className={`flex flex-col gap-3 transition-opacity ${summaryQuery.isPlaceholderData ? 'opacity-50' : ''}`}>
							{summaryQuery.data.map((item) => {
								const category = POI_CATEGORY_BY_ID[item.categoryId]

								return (
									<li className="flex items-start gap-2.5" key={item.categoryId}>
										<CategoryBadge category={category} />
										<div className="flex flex-col gap-0.5 text-[13px]">
											<p className="font-semibold text-[#14201a]">
												{category.label}
												<span className="font-normal text-[#586a61]"> · {item.total}</span>
											</p>
											<p className="whitespace-pre-wrap text-[#586a61]">
												{summarizeTypes(item.categoryId, item.types)}
											</p>
										</div>
									</li>
								)
							})}
						</ul>
					)}
					<p className="text-[11px] text-[#8a9a91]">Fuente: OpenStreetMap</p>
				</section>

				<p className="text-xs text-[#8a9a91]">{zone.sourcesNote}</p>

				<Button className={`${LIME_BUTTON_CLASS} self-start`} label="Ver propiedades en esta zona  →" />
			</div>
		</div>
	)
}
