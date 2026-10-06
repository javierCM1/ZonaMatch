import { useState } from 'react'
import { Button } from '../../../shared/components/button'
import {
	GUEST_CRITERIA,
	GUEST_CRITERIA_LIMIT,
	GUEST_LIMIT_NOTICE,
	PRIORITIES,
	PRIORITY_LABELS,
	type CriteriosState,
	type PrioridadId,
} from '../data/criteria.constants'

export interface CriteriaStepProps {
	selected: CriteriosState
	onAddCriterio: (id: string) => void
	/** Clic en la prioridad ya activa la desactiva y libera un cupo. */
	onSelectPrioridad: (id: string, prioridad: PrioridadId) => void
}

const LIMIT_NOTICE_ID = 'guest-criteria-limit'

export function CriteriaStep({ selected, onAddCriterio, onSelectPrioridad }: CriteriaStepProps) {
	// El reintento se cuenta localmente para re-montar el aviso y repetir su
	// entrada: es el feedback del clic en un botón que no puede avanzar.
	const [blockedAttempts, setBlockedAttempts] = useState(0)

	const activeCount = GUEST_CRITERIA.filter((criterio) => selected[criterio.id]).length
	const limitReached = activeCount >= GUEST_CRITERIA_LIMIT
	const progress = Math.round((activeCount / GUEST_CRITERIA_LIMIT) * 100)

	function handleAdd(id: string) {
		if (limitReached) {
			setBlockedAttempts((count) => count + 1)
			return
		}

		onAddCriterio(id)
	}

	return (
		<div className="screen">
			<header className="screen__header">
				<h1 className="screen__title">¿Qué es importante para tu grupo familiar?</h1>
				<p className="screen__subtitle">
					Elegí los criterios que te importan y asignales una prioridad. Como visitante podés mantener hasta{' '}
					{GUEST_CRITERIA_LIMIT} activos.
				</p>
			</header>

			<section className="card criterios-card">
				<div aria-live="polite" className="criterios-summary">
					<span className="criterios-summary__count">{activeCount}</span>
					<span aria-hidden="true" className="criterios-summary__of">
						/ {GUEST_CRITERIA_LIMIT}
					</span>
					<span className="criterios-summary__label">criterios activos</span>

					<span aria-hidden="true" className="criterios-summary__track">
						<span className="criterios-summary__fill" style={{ width: `${progress}%` }} />
					</span>
				</div>

				{limitReached && (
					<div className="guest-limit" id={LIMIT_NOTICE_ID} key={blockedAttempts} role="status">
						<i aria-hidden="true" className="pi pi-info-circle" />
						<span>{GUEST_LIMIT_NOTICE}</span>
					</div>
				)}

				<ul className="criterios">
					{GUEST_CRITERIA.map((criterio) => {
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
										aria-describedby={limitReached ? LIMIT_NOTICE_ID : undefined}
										aria-disabled={limitReached || undefined}
										className="sumar"
										icon="pi pi-plus"
										label="Sumar"
										onClick={() => handleAdd(criterio.id)}
										outlined
										title={limitReached ? GUEST_LIMIT_NOTICE : undefined}
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
