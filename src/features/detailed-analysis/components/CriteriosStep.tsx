import { Button } from '../../../shared/components/button'
import { CRITERIOS, PRIORITIES, PRIORITY_LABELS } from '../constants/analysis.constants'
import type { CriterioId, CriteriosState, PrioridadId } from '../types'

export interface CriteriosStepProps {
	selected: CriteriosState
	onSelectPrioridad: (id: CriterioId, prioridad: PrioridadId) => void
	onAddCriterio: (id: CriterioId) => void
}

export function CriteriosStep({ selected, onSelectPrioridad, onAddCriterio }: CriteriosStepProps) {
	const selectedCount = CRITERIOS.filter((criterio) => selected[criterio.id]).length
	const progress = Math.round((selectedCount / CRITERIOS.length) * 100)

	return (
		<div className="screen">
			<header className="screen__header">
				<h1 className="screen__title">
					¿Qué querés tener en cuenta y cuánto pesa cada criterio?
				</h1>
				<p className="screen__subtitle">
					Sumá los criterios que te importan y asignales una prioridad. Podés modificarlos después.
				</p>
			</header>

			<section className="card criterios-card">
				<div className="criterios-summary">
					<span className="criterios-summary__count">{selectedCount}</span>
					<span aria-hidden="true" className="criterios-summary__of">
						/ {CRITERIOS.length}
					</span>
					<span className="criterios-summary__label">
						{selectedCount === 1 ? 'criterio activo' : 'criterios activos'}
					</span>

					<span aria-hidden="true" className="criterios-summary__track">
						<span className="criterios-summary__fill" style={{ width: `${progress}%` }} />
					</span>
				</div>

				<ul className="criterios">
					{CRITERIOS.map((criterio) => {
						const prioridad = selected[criterio.id]
						const isActive = Boolean(prioridad)

						return (
							<li
								className={`criterio ${isActive ? 'criterio--active' : 'criterio--inactive'}`}
								key={criterio.id}
							>
								<span aria-hidden="true" className="criterio__icon">
									<i className={criterio.icon} />
								</span>

								<div className="criterio__body">
									<p className="criterio__name">{criterio.nombre}</p>
									<p className="criterio__description">{criterio.descripcion}</p>
								</div>

								{prioridad ? (
									<div
										aria-label={`Prioridad de ${criterio.nombre}`}
										className="prioridades"
										role="group"
									>
										{PRIORITIES.map((opcion) => {
											const isSelected = prioridad === opcion

											return (
												<Button
													aria-pressed={isSelected}
													className={`prioridad ${isSelected ? 'prioridad--selected' : ''}`}
													icon={isSelected ? 'pi pi-check' : undefined}
													key={opcion}
													label={PRIORITY_LABELS[opcion]}
													onClick={() => onSelectPrioridad(criterio.id, opcion)}
													outlined
												/>
											)
										})}
									</div>
								) : (
									<Button
										className="sumar"
										icon="pi pi-plus"
										label="Sumar"
										onClick={() => onAddCriterio(criterio.id)}
										outlined
									/>
								)}
							</li>
						)
					})}
				</ul>
			</section>
		</div>
	)
}