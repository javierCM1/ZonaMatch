import { Button } from '../../../shared/components/button'
import { GHOST_BUTTON_CLASS, LIME_BUTTON_CLASS } from '../constants'
import type { ContributionStats } from '../types'

interface ContributeCardProps {
	/** Sin datos mientras carga o si falló el resumen. */
	stats?: ContributionStats
	/** Se muestra cuando la persona acaba de enviar un aporte. */
	showThanks?: boolean
	onAddPoi: () => void
	onCorrectData: () => void
}

export function ContributeCard({ stats, showThanks = false, onAddPoi, onCorrectData }: ContributeCardProps) {
	return (
		<section
			aria-labelledby="contribute-title"
			className="flex flex-col gap-3 rounded-2xl border border-[#e3e8e2] bg-[#f2faf3] p-6"
		>
			<h2 className="text-lg font-semibold text-[#14201a]" id="contribute-title">
				Completá el mapa de la zona
			</h2>
			<p className="text-sm text-[#586a61]">
				Sumá un lugar que no encontrás o corregí un dato existente. Se publica cuando lo validan otros vecinos.
			</p>
			<div className="flex flex-wrap gap-3">
				<Button className={LIME_BUTTON_CLASS} label="Agregar punto de interés" onClick={onAddPoi} />
				<Button className={GHOST_BUTTON_CLASS} label="Corregir un dato" onClick={onCorrectData} variant="outlined" />
			</div>
			{stats && (
				<p className="text-xs font-medium text-[#586a61]">
					{`Aportes en esta zona: ${stats.total}  ·  Pendientes de validación: ${stats.pending}`}
				</p>
			)}
			{showThanks && (
				<p className="text-xs font-semibold text-[#1f4a38]" role="status">
					¡Gracias! Tu aporte quedó pendiente de validación.
				</p>
			)}
		</section>
	)
}
