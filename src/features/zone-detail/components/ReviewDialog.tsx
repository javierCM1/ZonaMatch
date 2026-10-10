import { useState } from 'react'
import { Button } from '../../../shared/components/button'
import { ChoiceChip } from '../../../shared/components/chip'
import { Dialog } from '../../../shared/components/dialog'
import { communityErrorMessage, useDeleteReview, useSaveReview } from '../api/community.api'
import {
	ASPECTS,
	ERROR_TEXT_CLASS,
	FIELD_LABEL_CLASS,
	GHOST_BUTTON_CLASS,
	LIME_BUTTON_CLASS,
	TEXTAREA_CLASS,
} from '../constants'
import type { AspectId, AspectScores, Review, ReviewDraft } from '../types'
import { formatRating, overallRating } from '../utils/ratings'
import { StarInput } from './StarInput'
import { Stars } from './Stars'

interface ReviewDialogProps {
	zoneId: string
	zoneName: string
	/** La reseña propia, para editarla; sin ella se escribe una nueva. */
	existing?: Review
	onHide: () => void
}

// Mismos límites que el backend (Longitudes.TextoResena)
const MIN_TEXT = 20
const MAX_TEXT = 1000
const MAX_YEARS = 100

const EMPTY_ASPECTS: AspectScores = {
	seguridad: 0,
	transporte: 0,
	conectividad: 0,
	comercios: 0,
	'espacios-verdes': 0,
}

export function ReviewDialog({ zoneId, zoneName, existing, onHide }: ReviewDialogProps) {
	const [aspects, setAspects] = useState<AspectScores>(existing?.aspects ?? EMPTY_ASPECTS)
	const [topics, setTopics] = useState<AspectId[]>(existing?.topics ?? [])
	const [text, setText] = useState(existing?.text ?? '')
	const [years, setYears] = useState(existing?.yearsInZone?.toString() ?? '')
	const [confirmingDelete, setConfirmingDelete] = useState(false)

	const save = useSaveReview(zoneId)
	const remove = useDeleteReview(zoneId)

	const trimmedText = text.trim()
	const yearsValue = years.trim() === '' ? null : Number(years)
	const yearsValid = yearsValue === null || (Number.isInteger(yearsValue) && yearsValue >= 0 && yearsValue <= MAX_YEARS)
	const missingAspects = ASPECTS.filter((aspect) => aspects[aspect.id] === 0)
	const rating = overallRating(aspects)
	const canSubmit = missingAspects.length === 0 && trimmedText.length >= MIN_TEXT && yearsValid && !save.isPending

	const toggleTopic = (topic: AspectId) =>
		setTopics((current) => (current.includes(topic) ? current.filter((id) => id !== topic) : [...current, topic]))

	const handleSubmit = () => {
		if (!canSubmit) {
			return
		}

		const draft: ReviewDraft = { aspects, text: trimmedText, yearsInZone: yearsValue, topics }
		save.mutate(draft, { onSuccess: onHide })
	}

	const error = save.error ?? remove.error

	return (
		<Dialog
			footer={
				<div className="flex w-full flex-wrap items-center gap-3">
					{existing &&
						(confirmingDelete ? (
							<div className="mr-auto flex items-center gap-3 text-sm text-[#14201a]">
								¿Eliminar tu reseña?
								<button
									className="cursor-pointer font-semibold text-[#b42318] underline disabled:opacity-50"
									disabled={remove.isPending}
									onClick={() => remove.mutate(undefined, { onSuccess: onHide })}
									type="button"
								>
									Sí, eliminar
								</button>
								<button
									className="cursor-pointer font-semibold text-[#1f4a38] underline"
									onClick={() => setConfirmingDelete(false)}
									type="button"
								>
									No
								</button>
							</div>
						) : (
							<button
								className="mr-auto cursor-pointer text-sm font-semibold text-[#b42318] underline"
								onClick={() => setConfirmingDelete(true)}
								type="button"
							>
								Eliminar mi reseña
							</button>
						))}
					<Button className={`${GHOST_BUTTON_CLASS} ${existing ? '' : 'ml-auto'}`} label="Cancelar" onClick={onHide} variant="outlined" />
					<Button
						className={LIME_BUTTON_CLASS}
						disabled={!canSubmit}
						label={save.isPending ? 'Publicando…' : existing ? 'Guardar cambios' : 'Publicar reseña'}
						onClick={handleSubmit}
					/>
				</div>
			}
			header={
				<div className="flex flex-col gap-1">
					<h2 className="text-[22px] font-bold text-[#14201a]">{existing ? 'Editar tu reseña' : 'Escribir una reseña'}</h2>
					<p className="text-sm font-normal text-[#586a61]">{zoneName} · Contá cómo es vivir en la zona.</p>
				</div>
			}
			onHide={onHide}
			size="lg"
			visible
		>
			<div className="flex flex-col gap-5">
				<div className="flex flex-col gap-2">
					<p className="text-sm font-semibold text-[#14201a]">¿Cómo es cada aspecto?</p>
					<div className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
						{ASPECTS.map((aspect) => (
							<div className="flex items-center justify-between gap-3" key={aspect.id}>
								<span className="text-[13px] text-[#586a61]">{aspect.label}</span>
								<StarInput
									label={aspect.label}
									onChange={(value) => setAspects((current) => ({ ...current, [aspect.id]: value }))}
									value={aspects[aspect.id]}
								/>
							</div>
						))}
					</div>
					<div className="flex items-center gap-2 border-t border-[#e3e8e2] pt-3">
						<span className="text-sm font-semibold text-[#14201a]">Puntaje general</span>
						{rating > 0 ? (
							<>
								<Stars className="text-xl leading-none" value={rating} />
								<span className="text-sm font-semibold text-[#14201a]">{formatRating(rating)}</span>
								<span className="text-xs text-[#8a9a91]">promedio de los aspectos</span>
							</>
						) : (
							<span className="text-xs text-[#8a9a91]">Se calcula como el promedio de los aspectos.</span>
						)}
					</div>
				</div>

				<div className="flex flex-col gap-1.5">
					<label className={FIELD_LABEL_CLASS} htmlFor="review-text">
						Tu experiencia en la zona
					</label>
					<textarea
						className={TEXTAREA_CLASS}
						id="review-text"
						maxLength={MAX_TEXT}
						onChange={(event) => setText(event.target.value)}
						placeholder="Contá cómo es el barrio: transporte, seguridad, comercios, ruido…"
						rows={5}
						value={text}
					/>
					<p className="text-xs text-[#8a9a91]">
						{trimmedText.length < MIN_TEXT
							? `Mínimo ${MIN_TEXT} caracteres (faltan ${MIN_TEXT - trimmedText.length})`
							: `${trimmedText.length} / ${MAX_TEXT}`}
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<p className={FIELD_LABEL_CLASS}>¿De qué habla tu reseña? (opcional, ayuda a filtrarla)</p>
					<div aria-label="Temas de la reseña" className="flex flex-wrap gap-2" role="group">
						{ASPECTS.map((aspect) => (
							<ChoiceChip
								key={aspect.id}
								label={aspect.label}
								onClick={() => toggleTopic(aspect.id)}
								selected={topics.includes(aspect.id)}
							/>
						))}
					</div>
				</div>

				<div className="flex flex-col gap-1.5">
					<label className={FIELD_LABEL_CLASS} htmlFor="review-years">
						¿Hace cuántos años vivís en la zona? (opcional)
					</label>
					<input
						className={`${TEXTAREA_CLASS} max-w-[140px]`}
						id="review-years"
						inputMode="numeric"
						max={MAX_YEARS}
						min={0}
						onChange={(event) => setYears(event.target.value)}
						type="number"
						value={years}
					/>
					{!yearsValid && <p className={ERROR_TEXT_CLASS}>Indicá un número entero entre 0 y {MAX_YEARS}.</p>}
				</div>

				{missingAspects.length > 0 && (
					<p className="text-xs text-[#8a9a91]">
						Para publicar falta puntuar: {missingAspects.map((aspect) => aspect.label.toLowerCase()).join(', ')}.
					</p>
				)}

				{error && (
					<p className={ERROR_TEXT_CLASS} role="alert">
						{communityErrorMessage(error, 'No pudimos guardar tu reseña. Intentá de nuevo.')}
					</p>
				)}
			</div>
		</Dialog>
	)
}
