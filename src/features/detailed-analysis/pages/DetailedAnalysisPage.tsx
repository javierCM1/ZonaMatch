import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import type { AppLayoutOutletContext } from '../../../shared/layouts/AppLayout'
import { ANALYSIS_STEPS } from '../constants/analysis.constants'
import { useDetailedAnalysisWizard } from '../hooks/useDetailedAnalysisWizard'
import { AnalysisStepper } from '../../../shared/components/analysis-stepper'
import { StepActions } from '../../../shared/components/step-actions'
import { ContextoStep } from '../components/ContextoStep'
import { CriteriosStep } from '../components/CriteriosStep'
import { PuntosStep } from '../components/PuntosStep'
import '../../../styles/analysis-wizard.css'

export interface DetailedAnalysisPageProps {
	/** Called when the wizard is restarted from the first step. */
	onReset?: () => void
	/** Called when finishing the wizard from the last step ("Ver mi resultado"). */
	onComplete?: () => void
}

export function DetailedAnalysisPage({ onReset, onComplete }: DetailedAnalysisPageProps) {
	const { scrollToTop } = useOutletContext<AppLayoutOutletContext>()
	const { state, actions, steps } = useDetailedAnalysisWizard()
	const [activeStep, setActiveStep] = useState(0)

	const isLastStep = activeStep === steps.total - 1

	function goToStep(index: number) {
		setActiveStep(index)
		scrollToTop()
	}

	function handleCancel() {
		actions.reset()
		onReset?.()
		goToStep(0)
	}

	function handleContinue() {
		if (isLastStep) {
			onComplete?.()
			return
		}

		goToStep(activeStep + 1)
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
							onEdadChange={actions.setEdad}
							onPersonasChange={actions.setPersonas}
							onToggleMascota={actions.toggleMascota}
							onToggleMovilidad={actions.toggleMovilidad}
							personas={state.contexto.personas}
						/>
					)}

					{activeStep === 1 && (
						<CriteriosStep
							onAddCriterio={actions.addCriterio}
							onSelectPrioridad={actions.selectPrioridad}
							selected={state.criterios}
						/>
					)}

					{activeStep === 2 && (
						<PuntosStep
							alquilerMaximo={state.puntos.alquilerMaximo}
							lugares={state.puntos.lugares}
							onAddLugar={actions.addLugar}
							onAlquilerMaximoChange={actions.setAlquilerMaximo}
							onPatchLugar={actions.patchLugar}
							onRemoveLugar={actions.removeLugar}
						/>
					)}
				</div>

				<StepActions
					cancelLabel={activeStep === 0 ? 'Reiniciar' : 'Atrás'}
					continuationLabel={isLastStep ? 'Ver mi resultado' : 'Continuar'}
					onCancel={handleCancel}
					onContinue={handleContinue}
				/>
			</div>
		</div>
	)
}