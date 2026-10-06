import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../../shared/components/button'
import { InputText } from '../../../shared/components/input-text'
import { Select } from '../../../shared/components/select'
import { Tag } from '../../../shared/components/tag'
import {
	FRECUENCIAS,
	LUGAR_DEFAULTS,
	LUGAR_PRIORIDADES,
	LUGAR_TYPES,
	MARKER_COLORS,
	PLACE_PRIORITY_SLUGS,
	QUIEN_VA_OPTIONS,
	TIEMPOS_VIAJE,
} from '../constants/analysis.constants'
import type { Frecuencia, Lugar, LugarPrioridad, LugarTipo, QuienVa, TiempoViaje } from '../types'

export interface PuntosStepProps {
	lugares: Lugar[]
	alquilerMaximo: string
	onPatchLugar: (id: string, patch: Partial<Lugar>) => void
	onRemoveLugar: (id: string) => void
	onAddLugar: (lugar: Omit<Lugar, 'id'>) => void
	onAlquilerMaximoChange: (value: string) => void
}

interface LugarDraft {
	tipo: LugarTipo
	nombre: string
	direccion: string
}

const EMPTY_DRAFT: LugarDraft = { tipo: LUGAR_TYPES[0], nombre: '', direccion: '' }

export function PuntosStep({
	lugares,
	alquilerMaximo,
	onPatchLugar,
	onRemoveLugar,
	onAddLugar,
	onAlquilerMaximoChange,
}: PuntosStepProps) {
	const [isAdding, setIsAdding] = useState(false)
	const [draft, setDraft] = useState<LugarDraft>(EMPTY_DRAFT)
	const [error, setError] = useState('')

	function updateDraft<K extends keyof LugarDraft>(field: K, value: LugarDraft[K]) {
		setDraft((current) => ({ ...current, [field]: value }))

		if (error) {
			setError('')
		}
	}

	function cancelAdd() {
		setDraft(EMPTY_DRAFT)
		setError('')
		setIsAdding(false)
	}

	function submitAdd(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const nombre = draft.nombre.trim()

		if (!nombre) {
			setError('Ingresá un nombre para el punto de interés.')
			return
		}

		onAddLugar({ nombre, tipo: draft.tipo, direccion: draft.direccion.trim(), ...LUGAR_DEFAULTS })
		cancelAdd()
	}

	return (
		<div className="screen">
			<header className="screen__header">
				<h1 className="screen__title">Puntos de interés y restricciones</h1>
				<p className="screen__subtitle">
					Para cada lugar definí quién va, con qué frecuencia, cuánto pesa y el tiempo máximo de viaje que
					aceptás.
				</p>
			</header>

			<div className="puntos__list">
				{lugares.length === 0 && (
					<div className="empty-state">
						<span aria-hidden="true" className="empty-state__icon">
							<i className="pi pi-inbox" />
						</span>

						<h2 className="empty-state__title">Todavía no agregaste lugares</h2>
						<p className="empty-state__text">
							Sumá el trabajo, la facultad o el colegio. Cuantos más puntos de interés cargues, más precisa
							va a ser la búsqueda.
						</p>
					</div>
				)}

				{lugares.map((lugar, index) => (
					<article
						className="lugar"
						data-prioridad={PLACE_PRIORITY_SLUGS[lugar.prioridad]}
						key={lugar.id}
					>
						<header className="lugar__header">
							<span
								aria-hidden="true"
								className="lugar__marker"
								style={{ backgroundColor: MARKER_COLORS[index % MARKER_COLORS.length] }}
							>
								{index + 1}
							</span>

							<div className="lugar__ident">
								<InputText
									aria-label="Nombre del lugar"
									className="lugar__name"
									onChange={(event) => onPatchLugar(lugar.id, { nombre: event.target.value })}
									value={lugar.nombre}
								/>

								<div className="lugar__meta">
									<Tag className="lugar__tag" value={lugar.tipo} />
									<span className="lugar__address">{lugar.direccion}</span>
								</div>
							</div>

							<Button
								aria-label={`Eliminar ${lugar.nombre}`}
								className="lugar__remove"
								icon="pi pi-times"
								onClick={() => onRemoveLugar(lugar.id)}
								title={`Eliminar ${lugar.nombre}`}
							/>
						</header>

						<div className="lugar__fields">
							<label className="lugar__field">
								<span className="field-label">Quién va</span>
								<Select
									aria-label={`Quién va a ${lugar.nombre}`}
									onChange={(event) => onPatchLugar(lugar.id, { quienVa: event.value as QuienVa })}
									options={QUIEN_VA_OPTIONS}
									plain
									value={lugar.quienVa}
								/>
							</label>

							<label className="lugar__field">
								<span className="field-label">Frecuencia</span>
								<Select
									aria-label={`Frecuencia de ${lugar.nombre}`}
									onChange={(event) => onPatchLugar(lugar.id, { frecuencia: event.value as Frecuencia })}
									options={FRECUENCIAS}
									plain
									value={lugar.frecuencia}
								/>
							</label>

							<label className="lugar__field">
								<span className="field-label">Prioridad</span>
								<Select
									aria-label={`Prioridad de ${lugar.nombre}`}
									onChange={(event) =>
										onPatchLugar(lugar.id, { prioridad: event.value as LugarPrioridad })
									}
									options={LUGAR_PRIORIDADES}
									plain
									value={lugar.prioridad}
								/>
							</label>

							<label className="lugar__field">
								<span className="field-label">Tiempo máx. de viaje</span>
								<Select
									aria-label={`Tiempo máximo de viaje a ${lugar.nombre}`}
									onChange={(event) => onPatchLugar(lugar.id, { tiempoMax: event.value as TiempoViaje })}
									options={TIEMPOS_VIAJE}
									plain
									value={lugar.tiempoMax}
								/>
							</label>
						</div>
					</article>
				))}

				{isAdding ? (
					<form className="add-form" noValidate onSubmit={submitAdd}>
						<div className="add-form__head">
							<span aria-hidden="true" className="add-form__icon">
								<i className="pi pi-map-marker" />
							</span>
							<h2 className="add-form__title">Nuevo punto de interés</h2>
						</div>

						<div className="add-form__row">
							<label className="add-form__field">
								<span className="field-label">Tipo</span>
								<Select
									onChange={(event) => updateDraft('tipo', event.value as LugarTipo)}
									options={LUGAR_TYPES}
									plain
									value={draft.tipo}
								/>
							</label>

							<label className="add-form__field">
								<span className="field-label">Nombre</span>
								<InputText
									autoFocus
									className="input--roomy"
									invalid={Boolean(error)}
									onChange={(event) => updateDraft('nombre', event.target.value)}
									placeholder="Ej. Gimnasio"
									value={draft.nombre}
								/>
							</label>
						</div>

						<label className="add-form__field">
							<span className="field-label">Dirección (opcional)</span>
							<InputText
								className="input--roomy"
								onChange={(event) => updateDraft('direccion', event.target.value)}
								placeholder="Ej. Av. Siempreviva 742"
								value={draft.direccion}
							/>
						</label>

						{error && (
							<p className="add-form__error" role="alert">
								<i aria-hidden="true" className="pi pi-exclamation-circle" />
								{error}
							</p>
						)}

						<div className="add-form__actions">
							<Button
								className="button button--secondary button--small"
								label="Cancelar"
								onClick={cancelAdd}
								outlined
								type="button"
							/>
							<Button
								className="button button--primary button--small"
								label="Agregar"
								type="submit"
							/>
						</div>
					</form>
				) : (
					<Button
						className="button button--dashed"
						icon="pi pi-plus"
						label="Agregar punto de interés"
						onClick={() => setIsAdding(true)}
						outlined
					/>
				)}

				<section className="restricciones">
					<div className="restricciones__head">
						<span aria-hidden="true" className="restricciones__icon">
							<i className="pi pi-wallet" />
						</span>
						<h2 className="restricciones__title">Restricciones generales</h2>
					</div>

					<label className="restricciones__field">
						<span className="field-label">Alquiler máximo</span>
						<InputText
							className="input--roomy"
							onChange={(event) => onAlquilerMaximoChange(event.target.value)}
							placeholder="$ 000.000"
							value={alquilerMaximo}
						/>
					</label>
				</section>
			</div>
		</div>
	)
}