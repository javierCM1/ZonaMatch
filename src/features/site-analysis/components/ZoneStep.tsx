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

const INPUT_CLASS =
	'w-full rounded-xl border border-[#dfe7df] bg-white px-4 py-2.5 text-sm text-[#2d493a] placeholder:text-[#9aa79f] outline-none focus:border-[#2d493a]'

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
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold text-[#2d493a] sm:text-3xl">Zona inicial, puntos y límites</h1>
				<p className="text-sm text-[#56675e]">
					Elegí una zona para empezar (opcional), sumá los lugares a los que van seguido y definí tus límites.
				</p>
			</div>

			<div className="flex flex-col gap-3 rounded-2xl border border-[#e3e8e2] bg-white p-6 sm:p-8">
				<div className="flex items-center gap-2">
					<h2 className="text-sm font-semibold text-[#2d493a]">Zona inicial</h2>
					<span className="rounded-full bg-[#eef1ee] px-2 py-0.5 text-xs font-medium text-[#56675e]">Opcional</span>
				</div>
				<div className="flex items-center gap-3 rounded-xl border border-[#dfe7df] bg-white px-4 py-2.5">
					<i aria-hidden="true" className="pi pi-search text-[#9aa79f]" />
					<input
						className="min-w-0 flex-1 border-0 bg-transparent text-sm text-[#2d493a] outline-none placeholder:text-[#9aa79f]"
						onChange={(event) => onInitialZoneChange(event.target.value)}
						placeholder="Buscar una zona..."
						value={initialZone}
					/>
				</div>
				<p className="text-xs text-[#8b968f]">
					Si la dejás vacía, te mostramos las zonas que mejor cumplen tus criterios. En el paso siguiente podés revisar
					sus zonas aledañas.
				</p>
			</div>

			<div className="flex flex-col gap-3 rounded-2xl border border-[#e3e8e2] bg-white p-6 sm:p-8">
				<h2 className="text-sm font-semibold text-[#2d493a]">Puntos de interés</h2>

				{points.map((point) => (
					<div
						className="flex items-center gap-3 rounded-xl bg-[#e7f2e9] px-4 py-3"
						key={point.id}
					>
						<Chip
							className="!h-6 !shrink-0 !rounded-full !border-0 !bg-white !px-2.5 !text-xs !font-medium !text-[#2d493a]"
							label={point.tag}
						/>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-semibold text-[#2d493a]">{point.title}</p>
							<p className="truncate text-xs text-[#56675e]">{point.address}</p>
						</div>
						<Button
							aria-label={`Quitar ${point.title}`}
							className="!h-8 !w-8 !shrink-0 !bg-transparent !p-0 !text-[#2d493a] hover:!bg-[#dce5dc]"
							icon="pi pi-times"
							onClick={() => onRemovePoint(point.id)}
							rounded
						/>
					</div>
				))}

				<Button
					className="!h-14 !w-full !rounded-xl !border-2 !border-dashed !border-[#c6d3c9] !bg-transparent !text-sm !font-medium !text-[#2d493a] !shadow-none hover:!bg-[#f4f6f4]"
					icon="pi pi-plus"
					label="Agregar punto de interés"
					onClick={onAddPoint}
					outlined
				/>
			</div>

			<div className="flex flex-col gap-4 rounded-2xl border border-[#e3e8e2] bg-white p-6 sm:p-8">
				<h2 className="text-sm font-semibold text-[#2d493a]">Restricciones</h2>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div className="flex flex-col gap-1.5">
						<label className="text-sm text-[#56675e]" htmlFor="max-commute">
							Tiempo máx. de traslado
						</label>
						<input
							className={INPUT_CLASS}
							id="max-commute"
							onChange={(event) => onMaxCommuteChange(event.target.value)}
							value={maxCommute}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<label className="text-sm text-[#56675e]" htmlFor="max-budget">
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
			</div>
		</div>
	)
}
