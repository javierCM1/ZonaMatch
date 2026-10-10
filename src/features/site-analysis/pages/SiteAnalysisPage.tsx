import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnalysisStepper } from '../../../shared/components/analysis-stepper'
import { StepActions } from '../../../shared/components/step-actions'
import { CriteriaStep } from '../components/CriteriaStep'
import { NewPoiPopup } from '../components/NewPoiPopup'
import { ZoneStep, type PointOfInterest, type SelectedZone } from '../components/ZoneStep'
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

// Por ahora el resultado del wizard invitado siempre es Palermo; se reemplaza cuando exista
// el cálculo real de zonas según criterios.
const RESULTADO_ZONE_SLUG = 'palermo'

export function SiteAnalysisPage({ onComplete }: SiteAnalysisPageProps) {
	const navigate = useNavigate()
	const [activeStep, setActiveStep] = useState(0)
	const [validationError, setValidationError] = useState('')

	const [selected, setSelected] = useState<CriteriosState>({})

	const [initialZone, setInitialZone] = useState<SelectedZone | null>(null)
	const [points, setPoints] = useState<PointOfInterest[]>([])
	const [maxCommute, setMaxCommute] = useState('')
	const [maxBudget, setMaxBudget] = useState<number | null>(null)
	const [isAddPoiOpen, setIsAddPoiOpen] = useState(false)

	const isLastStep = activeStep === STEPS.length - 1
	const criteriosCount = Object.keys(selected).length

	function addCriterio(id: string) {
		setValidationError('')
		setSelected((current) => {
			if (current[id]) return current
			// Defensa en profundidad: el paso ya bloquea el clic, esto protege el estado.
			if (Object.keys(current).length >= GUEST_CRITERIA_LIMIT) return current

			return { ...current, [id]: DEFAULT_PRIORITY }
		})
	}

	function selectPrioridad(id: string, prioridad: PrioridadId) {
		setValidationError('')
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
		setValidationError('')
		setPoints((current) => [...current, poi])
		setIsAddPoiOpen(false)
	}

	function handleBack() {
		setValidationError('')
		setActiveStep((step) => Math.max(0, step - 1))
	}

	function handleContinue() {
		// Validación por paso: no se avanza sin lo mínimo indispensable.
		if (activeStep === 0 && criteriosCount === 0) {
			setValidationError('Elegí al menos un criterio para poder continuar.')
			return
		}

		if (isLastStep) {
			if (points.length === 0) {
				setValidationError('Agregá al menos un punto de interés para poder continuar.')
				return
			}

			// Fin del wizard invitado: por ahora siempre Palermo; se reemplaza por el cálculo real.
			onComplete?.()
			navigate(`/zonas/${RESULTADO_ZONE_SLUG}`)
			return
		}

		setValidationError('')
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

						{validationError && (
							<p
								aria-live="polite"
								className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
								role="alert"
							>
								{validationError}
							</p>
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
