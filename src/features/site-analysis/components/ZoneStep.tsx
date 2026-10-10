import { useState } from 'react'
import { useDebouncedValue } from '../../../core/hooks'
import { Button } from '../../../shared/components/button'
import { Chip } from '../../../shared/components/chip'
import { InputNumber } from '../../../shared/components/input-number'
import { MIN_ZONE_SEARCH_LENGTH, useZoneSearch } from '../../zone-detail/api/zone.api'
import { zoneSubtitleParts, zoneTitle } from '../../zone-detail/utils/zone-detail'

export interface PointOfInterest {
	id: string
	tag: string
	title: string
	address: string
}

/** A zone picked from the real /Zonas search; its slug drives the /zonas/:zoneId detail route. */
export interface SelectedZone {
	slug: string
	name: string
}

export interface ZoneStepProps {
	initialZone: SelectedZone | null
	onInitialZoneChange: (zone: SelectedZone | null) => void
	points: PointOfInterest[]
	onRemovePoint: (id: string) => void
	onAddPoint: () => void
	maxCommute: string
	onMaxCommuteChange: (value: string) => void
	maxBudget: number | null
	onMaxBudgetChange: (value: number | null) => void
}

function ZoneSuggestions({ query, onPick }: { query: string; onPick: (zone: SelectedZone) => void }) {
	const debouncedQuery = useDebouncedValue(query.trim(), 250)
	const search = useZoneSearch(debouncedQuery)

	if (debouncedQuery.replace(/[^\p{L}\p{N}]/gu, '').length < MIN_ZONE_SEARCH_LENGTH) {
		return null
	}

	if (search.isPending) {
		return <p className="px-4 pb-2 text-xs text-[var(--color-ink-500)]">Buscando zonas…</p>
	}

	if (search.isError) {
		return <p className="px-4 pb-2 text-xs text-red-600">No pudimos buscar zonas. Probá de nuevo.</p>
	}

	if (search.data.length === 0) {
		return <p className="px-4 pb-2 text-xs text-[var(--color-ink-500)]">No encontramos zonas que coincidan.</p>
	}

	return (
		<ul
			aria-label="Zonas encontradas"
			className="absolute inset-x-0 top-full z-10 mt-1 max-h-60 overflow-auto rounded-xl border border-[var(--color-border-strong)] bg-white py-1 shadow-lg"
		>
			{search.data.map((zone) => (
				<li key={zone.id}>
					<button
						className="flex w-full flex-col gap-0.5 px-4 py-2.5 text-left transition-colors hover:bg-[var(--color-brand-50)] focus-visible:bg-[var(--color-brand-50)] focus-visible:outline-none"
						onClick={() => onPick({ slug: zone.id, name: zoneTitle(zone.name, zone.jurisdictions) })}
						type="button"
					>
						<span className="truncate text-sm font-semibold text-[var(--color-ink-900)]">
							{zoneTitle(zone.name, zone.jurisdictions)}
						</span>
						<span className="truncate text-xs text-[var(--color-ink-600)]">
							{zoneSubtitleParts(zone.jurisdictions, zone.areaKm2).join(' · ')}
						</span>
					</button>
				</li>
			))}
		</ul>
	)
}

export function ZoneStep({
	initialZone,
	onInitialZoneChange,
	points,
	onRemovePoint,
	onAddPoint,
	maxCommute,
	onMaxCommuteChange,
	maxBudget,
	onMaxBudgetChange,
}: ZoneStepProps) {
	const [query, setQuery] = useState('')

	function pickZone(zone: SelectedZone) {
		onInitialZoneChange(zone)
		setQuery('')
	}

	return (
		<div className="screen flex flex-col gap-6">
			<div className="flex flex-col">
				<h1 className="screen__title">Zona inicial, puntos y límites</h1>
				<p className="screen__subtitle">
					Elegí una zona para empezar (opcional), sumá los lugares a los que van seguido y definí tus límites.
				</p>
			</div>

			<section className="card flex flex-col gap-3">
				<div className="flex items-center gap-2">
					<h2 className="text-sm font-semibold text-[var(--color-ink-900)]">Zona inicial</h2>
					<span className="rounded-full bg-[var(--color-surface-sunken)] px-2 py-0.5 text-xs font-medium text-[var(--color-ink-600)]">
						Opcional
					</span>
				</div>

				{initialZone ? (
					<div className="flex items-center gap-3 rounded-xl border border-[var(--color-forest-800)] bg-[var(--color-brand-50)] px-4 py-2.5">
						<i aria-hidden="true" className="pi pi-map-marker text-[var(--color-forest-800)]" />
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-semibold text-[var(--color-ink-900)]">{initialZone.name}</p>
							<p className="truncate text-xs text-[var(--color-ink-600)]">Zona inicial elegida</p>
						</div>
						<Button
							aria-label="Quitar zona inicial"
							className="lugar__remove"
							icon="pi pi-times"
							onClick={() => onInitialZoneChange(null)}
						/>
					</div>
				) : (
					<div className="relative">
						<div className="flex items-center gap-3 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-2.5">
							<i aria-hidden="true" className="pi pi-search text-[var(--color-ink-400)]" />
							<input
								className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[var(--color-ink-900)] outline-none placeholder:text-[var(--color-ink-400)] focus:border-[var(--color-forest-800)]"
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Buscar una zona..."
								value={query}
							/>
						</div>
						<ZoneSuggestions onPick={pickZone} query={query} />
					</div>
				)}

				<p className="text-xs text-[var(--color-ink-500)]">
					Al terminar te llevamos al análisis de la zona que elijas. Si la dejás vacía, vas al buscador de zonas.
				</p>
			</section>

			<section className="card flex flex-col gap-3">
				<h2 className="text-sm font-semibold text-[var(--color-ink-900)]">Puntos de interés</h2>

				{points.map((point) => (
					<div
						className="flex items-center gap-3 rounded-[var(--radius-lg)] bg-[var(--color-brand-50)] px-4 py-3"
						key={point.id}
					>
						<Chip
							className="!h-6 !shrink-0 !rounded-full !border-0 !bg-[var(--color-surface)] !px-2.5 !text-xs !font-medium !text-[var(--color-ink-900)]"
							label={point.tag}
						/>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-semibold text-[var(--color-ink-900)]">{point.title}</p>
							<p className="truncate text-xs text-[var(--color-ink-600)]">{point.address}</p>
						</div>
						<Button
							aria-label={`Quitar ${point.title}`}
							className="lugar__remove"
							icon="pi pi-times"
							onClick={() => onRemovePoint(point.id)}
						/>
					</div>
				))}

				<Button
					className="button button--dashed"
					icon="pi pi-plus"
					label="Agregar punto de interés"
					onClick={onAddPoint}
				/>
			</section>

			<section className="card flex flex-col gap-4">
				<h2 className="text-sm font-semibold text-[var(--color-ink-900)]">Restricciones</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="flex flex-col gap-1.5">
						<label className="field-label" htmlFor="max-commute">
							Tiempo máx. de traslado
						</label>
						<input
							className="p-inputtext"
							id="max-commute"
							onChange={(event) => onMaxCommuteChange(event.target.value)}
							value={maxCommute}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label className="field-label" htmlFor="max-budget">
							Precio máx. vivienda / costo de vida
						</label>
						<InputNumber
							currency="ARS"
							fullWidth
							inputId="max-budget"
							locale="es-AR"
							maxFractionDigits={0}
							minFractionDigits={0}
							mode="currency"
							onValueChange={(event) => onMaxBudgetChange(event.value ?? null)}
							placeholder="$ 0"
							value={maxBudget}
						/>
					</div>
				</div>
			</section>
		</div>
	)
}
