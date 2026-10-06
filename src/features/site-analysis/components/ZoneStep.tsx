import { Button } from '../../../shared/components/button'
import { Chip } from '../../../shared/components/chip'
import { InputNumber } from '../../../shared/components/input-number'

export interface PointOfInterest {
	id: string
	tag: string
	title: string
	address: string
}

export interface ZoneStepProps {
	initialZone: string
	onInitialZoneChange: (value: string) => void
	points: PointOfInterest[]
	onRemovePoint: (id: string) => void
	onAddPoint: () => void
	maxCommute: string
	onMaxCommuteChange: (value: string) => void
	maxBudget: number | null
	onMaxBudgetChange: (value: number | null) => void
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
				<div className="flex items-center gap-3 rounded-xl border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-4 py-2.5">
					<i aria-hidden="true" className="pi pi-search text-[var(--color-ink-400)]" />
					<input
						className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[var(--color-ink-900)] outline-none placeholder:text-[var(--color-ink-400)] focus:border-[var(--color-forest-800)]"
						onChange={(event) => onInitialZoneChange(event.target.value)}
						placeholder="Buscar una zona..."
						value={initialZone}
					/>
				</div>
				<p className="text-xs text-[var(--color-ink-500)]">
					Si la dejás vacía, te mostramos las zonas que mejor cumplen tus criterios. En el paso siguiente podés revisar
					sus zonas aledañas.
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
