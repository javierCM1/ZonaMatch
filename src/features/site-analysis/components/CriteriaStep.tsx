import { Button } from '../../../shared/components/button'
import { Slider } from '../../../shared/components/slider'

export interface CriterionOption {
	id: string
	label: string
}

export interface CriteriaStepProps {
	criteria: CriterionOption[]
	selectedCriteria: string[]
	onToggleCriterion: (id: string) => void
	priorities: Record<string, number>
	priorityLabels: string[]
	onPriorityChange: (id: string, value: number) => void
}

const SLIDER_RANGE_CLASS = '!rounded-full !bg-[#bfdf69]'
const SLIDER_HANDLE_CLASS =
	'!-mt-[10px] !-ml-[10px] !h-5 !w-5 !rounded-full !border-2 !border-[#bfdf69] !bg-white !shadow-sm !transition-colors hover:!border-[#a8c94f] focus:!outline-none focus:!shadow-[0_0_0_4px_rgba(191,223,105,0.35)]'

export function CriteriaStep({
	criteria,
	selectedCriteria,
	onToggleCriterion,
	priorities,
	priorityLabels,
	onPriorityChange,
}: CriteriaStepProps) {
	const activeCriteria = criteria.filter((criterion) => selectedCriteria.includes(criterion.id))

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-2">
				<h1 className="text-2xl font-bold text-[#2d493a] sm:text-3xl">¿Qué es importante para tu grupo familiar?</h1>
				<p className="text-sm text-[#56675e]">
					Como visitante podés elegir entre estos dos criterios clave. Si querés más opciones, creá tu perfil más
					adelante.
				</p>
			</div>

			<div className="flex flex-col gap-6 rounded-2xl border border-[#e3e8e2] bg-white p-6 sm:p-8">
				<div className="flex flex-col gap-3">
					<h2 className="text-sm font-semibold text-[#2d493a]">Criterios disponibles</h2>
					<div className="flex flex-wrap gap-3">
						{criteria.map((criterion) => {
							const selected = selectedCriteria.includes(criterion.id)

							return (
								<Button
									aria-pressed={selected}
									className={`!h-10 !rounded-full !border !px-5 !text-sm !font-medium !shadow-none ${
										selected
											? '!border-[#2d493a] !bg-[#e7f2e9] !text-[#2d493a]'
											: '!border-[#dfe7df] !bg-white !text-[#56675e]'
									}`}
									key={criterion.id}
									label={criterion.label}
									onClick={() => onToggleCriterion(criterion.id)}
									outlined
								/>
							)
						})}
					</div>
				</div>

				{activeCriteria.map((criterion) => {
					const priority = priorities[criterion.id] ?? 0

					return (
						<div className="flex flex-col gap-3" key={criterion.id}>
							<h3 className="text-sm font-medium text-[#2d493a]">Prioridad: {criterion.label}</h3>
							<div className="flex items-center gap-4">
								<Slider
									className="flex-1"
									handleClassName={SLIDER_HANDLE_CLASS}
									max={priorityLabels.length - 1}
									min={0}
									onChange={(event) => onPriorityChange(criterion.id, event.value as number)}
									rangeClassName={SLIDER_RANGE_CLASS}
									step={1}
									value={priority}
								/>
								<span className="w-28 shrink-0 text-sm text-[#56675e]">{priorityLabels[priority]}</span>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
