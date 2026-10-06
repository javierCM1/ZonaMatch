import { useState } from 'react'
import { AnalysisStepper } from '../../../shared/components/analysis-stepper'
import { StepActions } from '../../../shared/components/step-actions'
import { CriteriaStep } from '../components/CriteriaStep'
import { NewPoiPopup } from '../components/NewPoiPopup'
import { ZoneStep, type PointOfInterest } from '../components/ZoneStep'
import { GUEST_CRITERIA_LIMIT, type CriteriosState, type PrioridadId } from '../data/criteria.constants'
import '../../../styles/analysis-wizard.css'

export interface SiteAnalysisPageProps {
	/** Called when leaving the wizard from the first step ("Volver al mapa"). */
	onExit?: () => void
	/** Called when finishing the wizard from the last step ("Continuar"). */
	onComplete?: () => void
}

const STEPS = [{ label: 'Criterios y prioridad' }, { label: 'Zona inicial y puntos' }]

const DEFAULT_PRIORITY: PrioridadId = 'media'

const INITIAL_POINTS: PointOfInterest[] = [
	{ id: 'oficina', tag: 'Trabajo', title: 'Oficina', address: 'Av. Corrientes 1200, CABA' },
	{ id: 'facultad', tag: 'Estudio', title: 'Facultad', address: 'Florencio Varela 1903, San Justo' },
]

export function SiteAnalysisPage({ onComplete }: SiteAnalysisPageProps) {
	const [activeStep, setActiveStep] = useState(0)

	const [selected, setSelected] = useState<CriteriosState>({})

	const [initialZone, setInitialZone] = useState('Palermo, CABA')
	const [points, setPoints] = useState<PointOfInterest[]>(INITIAL_POINTS)
	const [maxCommute, setMaxCommute] = useState('45 minutos')
	const [maxBudget, setMaxBudget] = useState<number | null>(600_000)
	const [isAddPoiOpen, setIsAddPoiOpen] = useState(false)

	const isLastStep = activeStep === STEPS.length - 1

	function addCriterio(id: string) {
		setSelected((current) => {
			if (current[id]) return current
			// Defensa en profundidad: el paso ya bloquea el clic, esto protege el estado.
			if (Object.keys(current).length >= GUEST_CRITERIA_LIMIT) return current

			return { ...current, [id]: DEFAULT_PRIORITY }
		})
	}

	function selectPrioridad(id: string, prioridad: PrioridadId) {
		setSelected((current) => {
			// Clic en la prioridad ya activa → desactiva y libera un cupo.
			if (current[id] === prioridad) {
				const { [id]: _removed, ...rest } = current
				return rest
			}

			return { ...current, [id]: prioridad }
		})
	}

	function removePoint(id: string) {
		setPoints((current) => current.filter((point) => point.id !== id))
	}

	function handlePoiAdded(poi: PointOfInterest) {
		setPoints((current) => [...current, poi])
		setIsAddPoiOpen(false)
	}

	function handleBack() {
		setActiveStep((step) => Math.max(0, step - 1))
	}

	function handleContinue() {
		if (isLastStep) {
			onComplete?.()
			return
		}

		setActiveStep((step) => step + 1)
	}

	return (
		<>
			{/* Scope del design system compartido: stepper, criterios y acciones. */}
			<div className="zm-analysis">
				<div className="flex justify-center">
					<div className="flex w-full max-w-3xl flex-col gap-4 py-1">
						<AnalysisStepper activeIndex={activeStep} onSelect={setActiveStep} steps={STEPS} />

						{activeStep === 0 ? (
							<CriteriaStep
								onAddCriterio={addCriterio}
								onSelectPrioridad={selectPrioridad}
								selected={selected}
							/>
						) : (
							<ZoneStep
								initialZone={initialZone}
								maxBudget={maxBudget}
								maxCommute={maxCommute}
								onAddPoint={() => setIsAddPoiOpen(true)}
								onInitialZoneChange={setInitialZone}
								onMaxBudgetChange={setMaxBudget}
								onMaxCommuteChange={setMaxCommute}
								onRemovePoint={removePoint}
								points={points}
							/>
						)}

						<StepActions
							cancelLabel="Atrás"
							className={activeStep === 0 ? 'step-actions--end' : ''}
							onCancel={activeStep === 0 ? undefined : handleBack}
							onContinue={handleContinue}
						/>
					</div>
				</div>
			</div>

			<NewPoiPopup onAdd={handlePoiAdded} onHide={() => setIsAddPoiOpen(false)} visible={isAddPoiOpen} />
		</>
	)
}
