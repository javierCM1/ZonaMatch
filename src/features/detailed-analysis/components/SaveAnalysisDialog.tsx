import { useState } from 'react'
import { Button } from '../../../shared/components/button'
import { Dialog } from '../../../shared/components/dialog'
import { InputText } from '../../../shared/components/input-text'
import { MAX_ANALISIS_GUARDADOS, getSaveErrorMessage } from '../api/analisis.api'
import type { AnalisisDetallado, CrearAnalisisPayload } from '../api/analisis.api'
import { useDeleteAnalisis, useMisAnalisis, useSaveAnalisis } from '../hooks/useAnalisisGuardados'
import type { DetailedAnalysisState } from '../types'

export interface SaveAnalysisResult {
	nombre: string
	/** Present → this analysis was overwritten; absent → a new one was created. */
	sourceId?: string
}

export interface SaveAnalysisDialogProps {
	visible: boolean
	state: DetailedAnalysisState
	/** Called after a successful save. */
	onSaved: (result: SaveAnalysisResult) => void
	onHide: () => void
}

const DEFAULT_NAME = 'Mi análisis'

export function SaveAnalysisDialog({ visible, state, onSaved, onHide }: SaveAnalysisDialogProps) {
	const { data: misAnalisis = [], isLoading } = useMisAnalisis()
	const saveMutation = useSaveAnalisis()
	const deleteMutation = useDeleteAnalisis()

	const [nombre, setNombre] = useState(DEFAULT_NAME)
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [localError, setLocalError] = useState('')

	const isFull = misAnalisis.length >= MAX_ANALISIS_GUARDADOS
	const trimmedName = nombre.trim()

	function buildPayload(): CrearAnalisisPayload {
		return { nombre: trimmedName, contexto: state.contexto, criterios: state.criterios, puntos: state.puntos }
	}

	function handleSave(targetId?: string) {
		setLocalError('')

		if (!trimmedName) {
			setLocalError('Ponéle un nombre a tu análisis.')
			return
		}

		if (isFull && !targetId) {
			setLocalError('Elegí cuál análisis sobrescribir: ya tenés 3 guardados.')
			return
		}

		saveMutation.mutate(
			{ id: targetId, payload: buildPayload() },
			{
				onSuccess: () => {
					onSaved({ nombre: trimmedName, sourceId: targetId })
				},
				onError: (error) => {
					setLocalError(getSaveErrorMessage(error))
				},
			},
		)
	}

	function handleDelete(id: string) {
		deleteMutation.mutate(id, {
			onSuccess: () => {
				if (selectedId === id) setSelectedId(null)
			},
		})
	}

	function formatDate(iso: string) {
		return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
	}

	return (
		<Dialog header="Guardar mi análisis" onHide={onHide} size="sm" visible={visible}>
			<div className="space-y-4">
				<div className="space-y-1.5">
					<label className="block text-sm font-medium text-slate-800" htmlFor="analisis-nombre">
						Nombre del análisis
					</label>
					<InputText
						fullWidth
						id="analisis-nombre"
						maxLength={50}
						onChange={(event) => setNombre(event.target.value)}
						placeholder="Ej: Familia Palermo"
						value={nombre}
					/>
				</div>

				<p className="text-xs text-slate-500">
					{misAnalisis.length} de {MAX_ANALISIS_GUARDADOS} análisis guardados
				</p>

				{isLoading && <p className="text-sm text-slate-500">Cargando tus análisis…</p>}

				{misAnalisis.length > 0 && (
					<div className="space-y-2">
						<p className="text-sm font-medium text-slate-700">
							{isFull ? 'Ya tenés 3 análisis: elegí cuál sobrescribir.' : 'O sobrescribí uno existente:'}
						</p>
						<ul className="space-y-2">
							{misAnalisis.map((analisis: AnalisisDetallado) => (
								<li
									className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 transition-colors ${
										selectedId === analisis.id
											? 'border-emerald-500 bg-emerald-50'
											: 'border-slate-200 bg-white hover:border-slate-300'
									}`}
									key={analisis.id}
								>
									<button
										className="min-w-0 flex-1 text-left focus-visible:outline-none"
										onClick={() => setSelectedId(analisis.id)}
										type="button"
									>
										<p className="truncate text-sm font-medium text-slate-800">{analisis.nombre}</p>
										<p className="text-xs text-slate-500">Actualizado {formatDate(analisis.fechaActualizacion)}</p>
									</button>
									<button
										aria-label={`Eliminar ${analisis.nombre}`}
										className="shrink-0 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
										disabled={deleteMutation.isPending}
										onClick={() => handleDelete(analisis.id)}
										type="button"
									>
										<i className="pi pi-trash text-sm" />
									</button>
								</li>
							))}
						</ul>
					</div>
				)}

				{localError && (
					<p aria-live="polite" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
						{localError}
					</p>
				)}

				<div className="flex items-center justify-end gap-3 pt-2">
					<Button label="Cancelar" onClick={onHide} variant="outlined" />
					{!isFull && (
						<Button
							disabled={saveMutation.isPending}
							label={saveMutation.isPending ? 'Guardando…' : 'Guardar como nuevo'}
							onClick={() => handleSave()}
						/>
					)}
					{isFull && (
						<Button
							disabled={saveMutation.isPending || !selectedId}
							label={saveMutation.isPending ? 'Guardando…' : 'Sobrescribir'}
							onClick={() => selectedId && handleSave(selectedId)}
						/>
					)}
				</div>
			</div>
		</Dialog>
	)
}
