import { Select } from '../../../shared/components/select'
import { AGE_RANGES, MAX_PEOPLE, MOBILITY_OPTIONS, PET_OPTIONS } from '../constants/analysis.constants'
import type { AgeRange, MobilityId, PetId } from '../types'
import { PeopleCounter } from './PeopleCounter'
import { StepField } from './StepField'
import { ToggleChip } from './ToggleChip'

export interface ContextoStepProps {
	personas: number
	edades: AgeRange[]
	movilidad: MobilityId[]
	mascotas: PetId[]
	onPersonasChange: (personas: number) => void
	onEdadChange: (index: number, edad: AgeRange) => void
	onToggleMovilidad: (id: MobilityId) => void
	onToggleMascota: (id: PetId) => void
}

export function ContextoStep({
	personas,
	edades,
	movilidad,
	mascotas,
	onPersonasChange,
	onEdadChange,
	onToggleMovilidad,
	onToggleMascota,
}: ContextoStepProps) {
	const movilidadCount = movilidad.length
	const mascotaCount = mascotas.length

	return (
		<div className="screen">
			<header className="screen__header">
				<h1 className="screen__title">Contanos tu situación</h1>
				<p className="screen__subtitle">
					Esto orienta la configuración, pero no reemplaza tu selección explícita de criterios en el
					próximo paso.
				</p>
			</header>

			<div className="card">
				<StepField
					hint="Rango etario de cada integrante (opcional)"
					icon="pi pi-users"
					title="¿Cuántas personas se mudan?"
				>
					<PeopleCounter
						max={MAX_PEOPLE}
						min={1}
						onChange={onPersonasChange}
						unitLabel="personas"
						value={personas}
					/>

					<div className="age-list">
						{edades.map((edad, index) => (
							<label className="age-field" key={`persona-${index}`}>
								<span aria-hidden="true" className="age-field__index">
									{index + 1}
								</span>

								<span className="age-field__label">Persona {index + 1}</span>

								<Select
									aria-label={`Rango etario de la persona ${index + 1}`}
									className="age-field__select"
									onChange={(event) => onEdadChange(index, event.value as AgeRange)}
									options={AGE_RANGES}
									plain
									value={edad}
								/>
							</label>
						))}
					</div>
				</StepField>

				<StepField
					hint={
						mascotaCount === 0
							? 'Opcional — ayudanos a priorizar zonas pet friendly'
							: `${mascotaCount} ${mascotaCount === 1 ? 'seleccionada' : 'seleccionadas'}`
					}
					icon="pi pi-paw"
					title="Mascotas"
				>
					<div className="pet-chips">
						{PET_OPTIONS.map((option) => (
							<ToggleChip
								className="pet-chip"
								icon={<span className="pet-chip__emoji">{option.emoji}</span>}
								key={option.id}
								label={option.label}
								onToggle={() => onToggleMascota(option.id)}
								selected={mascotas.includes(option.id)}
							/>
						))}
					</div>
				</StepField>

				<StepField
					hint={
						movilidadCount === 0
							? 'Sin opciones seleccionadas'
							: `${movilidadCount} ${movilidadCount === 1 ? 'opción seleccionada' : 'opciones seleccionadas'}`
					}
					icon="pi pi-directions"
					title="Movilidad habitual"
				>
					<div className="chips">
						{MOBILITY_OPTIONS.map((option) => (
							<ToggleChip
								key={option.id}
								label={option.label}
								onToggle={() => onToggleMovilidad(option.id)}
								selected={movilidad.includes(option.id)}
							/>
						))}
					</div>
				</StepField>
			</div>
		</div>
	)
}