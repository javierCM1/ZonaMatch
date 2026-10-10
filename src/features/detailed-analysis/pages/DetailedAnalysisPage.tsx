import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ANALYSIS_STEPS } from '../constants/analysis.constants'
import { useDetailedAnalysisWizard } from '../hooks/useDetailedAnalysisWizard'
import { AnalysisStepper } from '../../../shared/components/analysis-stepper'
import { StepActions } from '../../../shared/components/step-actions'
import { ContextoStep } from '../components/ContextoStep'
import { CriteriosStep } from '../components/CriteriosStep'
import { PuntosStep } from '../components/PuntosStep'
import { SaveAnalysisDialog } from '../components/SaveAnalysisDialog'
import '../../../styles/analysis-wizard.css'

export interface DetailedAnalysisPageProps {
	/** Called when the wizard is restarted from the first step. */
	onReset?: () => void
	/** Called after the analysis is saved successfully. */
	onComplete?: () => void
}

// Por ahora el resultado del wizard detallado siempre es Recoleta; se reemplaza cuando exista
// el cálculo real de zonas según criterios.
const RESULTADO_ZONE_SLUG = 'recoleta'

export function DetailedAnalysisPage({ onReset, onComplete }: DetailedAnalysisPageProps) {
	const navigate = useNavigate()
	const { state, actions, steps } = useDetailedAnalysisWizard()
	const [activeStep, setActiveStep] = useState(0)
	const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
	const [validationError, setValidationError] = useState('')

	const isLastStep = activeStep === steps.total - 1
	const criteriosCount = Object.keys(state.criterios).length
	const movilidadCount = state.contexto.movilidad.length
	const lugaresCount = state.puntos.lugares.length

	function goToStep(index: number) {
		setValidationError('')
		setActiveStep(index)
		// El scroll lo maneja el `<main>` de AppLayout, no la ventana.
		document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' })
	}

	function handleCancel() {
		actions.reset()
		onReset?.()
		setValidationError('')
		goToStep(0)
	}

	function handleContinue() {
		// Validación por paso: no se avanza sin lo mínimo indispensable.
		if (activeStep === 0 && movilidadCount === 0) {
			setValidationError('Elegí al menos una forma de movilidad para poder continuar.')
			return
		}

		if (activeStep === 1 && criteriosCount === 0) {
			setValidationError('Elegí al menos un criterio para poder continuar.')
			return
		}

		if (isLastStep) {
			if (lugaresCount === 0) {
				setValidationError('Agregá al menos un punto de interés para poder continuar.')
				return
			}

			setIsSaveDialogOpen(true)
			return
		}

		setValidationError('')
		goToStep(activeStep + 1)
	}

	function handleSaved() {
		setIsSaveDialogOpen(false)
		onComplete?.()
		// Igual que el wizard de invitado: por ahora siempre Recoleta; se reemplaza por el cálculo real.
		navigate(`/zonas/${RESULTADO_ZONE_SLUG}`)
	}

	return (
		/* `.zm-analysis` scopes the whole design system of the feature: tokens, fonts
		   and every component override live under this single root. */
		<div className="zm-analysis">
			<div className="page__main">
				<AnalysisStepper activeIndex={activeStep} onSelect={goToStep} steps={ANALYSIS_STEPS} />

				<div key={activeStep}>
					{activeStep === 0 && (
						<ContextoStep
							edades={state.contexto.edades}
							mascotas={state.contexto.mascotas}
							movilidad={state.contexto.movilidad}
							onEdadChange={(...args) => {
								setValidationError('')
								actions.setEdad(...args)
							}}
							onPersonasChange={(...args) => {
								setValidationError('')
								actions.setPersonas(...args)
							}}
							onToggleMascota={(...args) => {
								setValidationError('')
								actions.toggleMascota(...args)
							}}
							onToggleMovilidad={(...args) => {
								setValidationError('')
								actions.toggleMovilidad(...args)
							}}
							personas={state.contexto.personas}
						/>
					)}

					{activeStep === 1 && (
						<CriteriosStep
							onAddCriterio={(...args) => {
								setValidationError('')
								actions.addCriterio(...args)
							}}
							onSelectPrioridad={(...args) => {
								setValidationError('')
								actions.selectPrioridad(...args)
							}}
							selected={state.criterios}
						/>
					)}

					{activeStep === 2 && (
						<PuntosStep
							alquilerMaximo={state.puntos.alquilerMaximo}
							lugares={state.puntos.lugares}
							onAddLugar={(...args) => {
								setValidationError('')
								actions.addLugar(...args)
							}}
							onAlquilerMaximoChange={(...args) => {
								setValidationError('')
								actions.setAlquilerMaximo(...args)
							}}
							onPatchLugar={(...args) => {
								setValidationError('')
								actions.patchLugar(...args)
							}}
							onRemoveLugar={(...args) => {
								setValidationError('')
								actions.removeLugar(...args)
							}}
						/>
					)}
				</div>

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
					cancelLabel={activeStep === 0 ? 'Reiniciar' : 'Atrás'}
					continuationLabel={isLastStep ? 'Ver mi resultado' : 'Continuar'}
					onCancel={handleCancel}
					onContinue={handleContinue}
				/>
			</div>

			<SaveAnalysisDialog
				onHide={() => setIsSaveDialogOpen(false)}
				onSaved={handleSaved}
				state={state}
				visible={isSaveDialogOpen}
			/>
		</div>
	)
}