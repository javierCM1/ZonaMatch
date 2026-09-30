import { useState } from 'react'
import { Button } from '../../../shared/components/button'
import { Stepper } from '../../../shared/components/stepper'
import type { StepContext } from '../../../shared/components/stepper'
import { CriteriaStep, type CriterionOption } from '../components/CriteriaStep'
import { NewPoiPopup } from '../components/NewPoiPopup'
import { ZoneStep, type PointOfInterest } from '../components/ZoneStep'

export interface SiteAnalysisPageProps {
	/** Called when leaving the wizard from the first step ("Volver al mapa"). */
	onExit?: () => void
	/** Called when finishing the wizard from the last step ("Continuar"). */
	onComplete?: () => void
}

const STEPS = [{ label: 'Criterios y prioridad' }, { label: 'Zona inicial y puntos' }]

const CRITERIA_OPTIONS: CriterionOption[] = [
	{ id: 'movilidad', label: 'Movilidad' },
	{ id: 'seguridad', label: 'Seguridad' },
]

const PRIORITY_LABELS = ['Baja', 'Media', 'Alta', 'Imprescindible']

const INITIAL_POINTS: PointOfInterest[] = [
	{ id: 'oficina', tag: 'Trabajo', title: 'Oficina', address: 'Av. Corrientes 1200, CABA' },
	{ id: 'facultad', tag: 'Estudio', title: 'Facultad', address: 'Florencio Varela 1903, San Justo' },
]

function stepNumberClassName({ active, highlighted }: StepContext) {
	return `!flex !h-8 !w-8 !shrink-0 !items-center !justify-center !rounded-full !border-2 !text-sm !font-semibold !transition-colors ${
		active
			? '!border-[#bfdf69] !bg-[#bfdf69] !text-[#2d493a]'
			: highlighted
				? '!border-[#2d493a] !bg-[#2d493a] !text-white'
				: '!border-[#d8ded9] !bg-white !text-[#9aa79f]'
	}`
}

function stepTitleClassName({ active }: StepContext) {
	return `!ml-2 !whitespace-nowrap !text-sm !font-medium ${active ? '!text-[#2d493a]' : '!text-[#9aa79f]'}`
}

function stepSeparatorClassName() {
	return '!mx-3 !h-0.5 !w-8 !bg-transparent'
}

export function SiteAnalysisPage({ onComplete }: SiteAnalysisPageProps) {
	const [activeStep, setActiveStep] = useState(0)

	const [selectedCriteria, setSelectedCriteria] = useState<string[]>(['movilidad', 'seguridad'])
	const [priorities, setPriorities] = useState<Record<string, number>>({ movilidad: 1, seguridad: 3 })

	const [initialZone, setInitialZone] = useState('Palermo, CABA')
	const [points, setPoints] = useState<PointOfInterest[]>(INITIAL_POINTS)
	const [maxCommute, setMaxCommute] = useState('45 minutos')
	const [maxBudget, setMaxBudget] = useState<number | null>(600_000)
	const [isAddPoiOpen, setIsAddPoiOpen] = useState(false)

	const isLastStep = activeStep === STEPS.length - 1

	function toggleCriterion(id: string) {
		setSelectedCriteria((current) =>
			current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
		)
	}

	function handlePriorityChange(id: string, value: number) {
		setPriorities((current) => ({ ...current, [id]: value }))
	}

	function removePoint(id: string) {
		setPoints((current) => current.filter((point) => point.id !== id))
	}

	function handlePoiAdded(poi: PointOfInterest) {
		setPoints((current) => [...current, poi])
		setIsAddPoiOpen(false)
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
			<div className="flex justify-center">
				<div className="flex w-full max-w-3xl flex-col gap-4 py-1">
					<Stepper
						activeStep={activeStep}
						linear
						numberClassName={stepNumberClassName}
						separatorClassName={stepSeparatorClassName}
						steps={STEPS}
						titleClassName={stepTitleClassName}
					/>

					{activeStep === 0 ? (
						<CriteriaStep
							criteria={CRITERIA_OPTIONS}
							onPriorityChange={handlePriorityChange}
							onToggleCriterion={toggleCriterion}
							priorities={priorities}
							priorityLabels={PRIORITY_LABELS}
							selectedCriteria={selectedCriteria}
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

					<div className="flex items-center justify-end"> 							
						<Button
							className="!h-11 !rounded-full !border-transparent !bg-[#bfdf69] !px-8 !text-sm !font-semibold !text-[#2d493a] !shadow-none hover:!brightness-95"
							label="Continuar"
							onClick={handleContinue}
						/>
					</div>
				</div>
			</div>

			<NewPoiPopup onAdd={handlePoiAdded} onHide={() => setIsAddPoiOpen(false)} visible={isAddPoiOpen} />
		</>
	)
}
