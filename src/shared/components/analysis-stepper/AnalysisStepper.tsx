export interface AnalysisStepperStep {
	label: string
}

export interface AnalysisStepperProps {
	steps: AnalysisStepperStep[]
	activeIndex: number
	onSelect: (index: number) => void
}

type StepState = 'done' | 'active' | 'todo'

const STATUS_LABELS: Record<StepState, string> = {
	done: 'Completado',
	active: 'En curso',
	todo: 'Pendiente',
}

function resolveState(index: number, activeIndex: number): StepState {
	if (index < activeIndex) return 'done'
	if (index === activeIndex) return 'active'
	return 'todo'
}

/**
 * Stepper de los wizards de análisis (Mi análisis y Mi análisis detallado).
 *
 * Se implementa a mano (en lugar de usar el Stepper de PrimeReact) porque el
 * prototipo necesita el microcopy de estado —"Completado / En curso / Pendiente"—
 * debajo de cada label, y PrimeReact sólo admite `header?: string`.
 *
 * Vive en su propio folder (no en `shared/components/stepper`) para no tocar el
 * Stepper del Wizard ni el de Mapa. Sus estilos `.stepper*` viven en
 * `src/styles/analysis-wizard.css` y sólo aplican dentro de un scope `.zm-analysis`.
 */
export function AnalysisStepper({ steps, activeIndex, onSelect }: AnalysisStepperProps) {
	return (
		<nav aria-label="Progreso del análisis" className="stepper">
			<ol className="stepper__list">
				{steps.map((step, index) => {
					const state = resolveState(index, activeIndex)

					return (
						<li className={`stepper__item stepper__item--${state}`} key={step.label}>
							<button
								aria-current={state === 'active' ? 'step' : undefined}
								className="stepper__button"
								disabled={state === 'todo'}
								onClick={() => onSelect(index)}
								type="button"
							>
								<span aria-hidden="true" className="stepper__index">
									{state === 'done' ? <i className="pi pi-check" /> : index + 1}
								</span>

								<span className="stepper__text">
									<span className="stepper__label">{step.label}</span>
									<span className="stepper__status">{STATUS_LABELS[state]}</span>
								</span>
							</button>

							{index < steps.length - 1 && (
								<span aria-hidden="true" className="stepper__connector" />
							)}
						</li>
					)
				})}
			</ol>
		</nav>
	)
}