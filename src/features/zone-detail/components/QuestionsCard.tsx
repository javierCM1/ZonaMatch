import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../../shared/components/button'
import { InputText } from '../../../shared/components/input-text'
import { communityErrorMessage, useAnswerQuestion, useAskQuestion, useZoneQuestions } from '../api/community.api'
import { CARD_CLASS, ERROR_TEXT_CLASS, GHOST_BUTTON_CLASS, LIME_BUTTON_CLASS, TEXTAREA_CLASS } from '../constants'
import { useLoginGate } from '../hooks/useLoginGate'
import type { Question } from '../types'
import { formatRelative } from '../utils/dates'

interface QuestionsCardProps {
	zoneId: string
}

// Mismos límites que el backend (Longitudes.TextoPregunta y TextoRespuesta)
const MIN_QUESTION = 10
const MAX_QUESTION = 300
const MAX_ANSWER = 1000

function questionMeta(question: Question): string {
	const count = question.answers.length

	if (count === 0) {
		return `Publicada ${formatRelative(question.publishedAt)} · Sin respuestas todavía`
	}

	const last = question.answers[count - 1]
	return `${count} ${count === 1 ? 'respuesta' : 'respuestas'} · última ${formatRelative(last.publishedAt)}`
}

export function QuestionsCard({ zoneId }: QuestionsCardProps) {
	const [draft, setDraft] = useState('')
	const { isAuthenticated, goToLogin } = useLoginGate()
	const questionsQuery = useZoneQuestions(zoneId)
	const ask = useAskQuestion(zoneId)

	const text = draft.trim()

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (!isAuthenticated) {
			goToLogin()
			return
		}

		if (text.length < MIN_QUESTION) {
			return
		}

		ask.mutate(text, { onSuccess: () => setDraft('') })
	}

	const questions = questionsQuery.data ?? []

	return (
		<section aria-labelledby="questions-title" className={`${CARD_CLASS} flex flex-col gap-3.5 p-6`}>
			<div className="flex items-center gap-2.5">
				<i aria-hidden="true" className="pi pi-comment text-xl text-[#14201a]" />
				<h2 className="text-lg font-semibold text-[#14201a]" id="questions-title">
					Preguntale a los vecinos
				</h2>
				{questionsQuery.isSuccess && (
					<span className="ml-auto text-[13px] font-medium text-[#8a9a91]">
						{questions.length} {questions.length === 1 ? 'pregunta' : 'preguntas'}
					</span>
				)}
			</div>

			<form className="flex flex-col gap-1.5" onSubmit={handleSubmit}>
				<div className="flex items-center gap-2.5">
					<InputText
						aria-label="Tu pregunta sobre la zona"
						className="!rounded-[10px] !py-3"
						disabled={!isAuthenticated}
						fullWidth
						maxLength={MAX_QUESTION}
						onChange={(event) => setDraft(event.target.value)}
						placeholder={isAuthenticated ? 'Escribí tu pregunta sobre la zona…' : 'Iniciá sesión para preguntar'}
						value={draft}
						wrapperClassName="min-w-0 flex-1"
					/>
					<Button
						className={LIME_BUTTON_CLASS}
						disabled={isAuthenticated && (text.length < MIN_QUESTION || ask.isPending)}
						label={isAuthenticated ? 'Publicar' : 'Ingresar'}
						type="submit"
					/>
				</div>
				{isAuthenticated && text.length > 0 && text.length < MIN_QUESTION && (
					<p className="text-xs text-[#8a9a91]">La pregunta tiene que tener al menos {MIN_QUESTION} caracteres.</p>
				)}
				{ask.isError && (
					<p className={ERROR_TEXT_CLASS} role="alert">
						{communityErrorMessage(ask.error, 'No pudimos publicar tu pregunta. Intentá de nuevo.')}
					</p>
				)}
			</form>

			{questionsQuery.isPending ? (
				<p className="text-sm text-[#586a61]" role="status">
					Cargando preguntas…
				</p>
			) : questionsQuery.isError ? (
				<div className="flex items-center gap-2 text-sm text-[#14201a]">
					No pudimos cargar las preguntas.
					<button
						className="cursor-pointer font-semibold text-[#1f4a38] underline"
						onClick={() => void questionsQuery.refetch()}
						type="button"
					>
						Reintentar
					</button>
				</div>
			) : questions.length === 0 ? (
				<p className="text-sm text-[#586a61]">Nadie preguntó nada todavía. ¡Hacé la primera pregunta!</p>
			) : (
				<ul className="flex flex-col gap-3.5">
					{questions.map((question) => (
						<QuestionItem key={question.id} question={question} zoneId={zoneId} />
					))}
				</ul>
			)}
		</section>
	)
}

function QuestionItem({ question, zoneId }: { question: Question; zoneId: string }) {
	const [expanded, setExpanded] = useState(false)
	const [draft, setDraft] = useState('')
	const { isAuthenticated, goToLogin } = useLoginGate()
	const answer = useAnswerQuestion(zoneId)

	const text = draft.trim()
	// La respuesta más reciente es la que se ve con la pregunta cerrada
	const latest = question.answers.at(-1)
	const answersId = `answers-${question.id}`

	const handleAnswer = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		if (text.length === 0) {
			return
		}

		answer.mutate({ questionId: question.id, text }, { onSuccess: () => setDraft('') })
	}

	return (
		<li className="flex flex-col gap-1.5 rounded-xl bg-[#fafbf8] px-3.5 py-3">
			<p className="text-sm font-semibold text-[#14201a]">{question.text}</p>
			{!expanded && latest && <p className="text-[13px] italic text-[#586a61]">“{latest.text}”</p>}
			<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
				<p className="text-xs text-[#8a9a91]">{questionMeta(question)}</p>
				<button
					aria-controls={answersId}
					aria-expanded={expanded}
					className="cursor-pointer text-xs font-semibold text-[#1f4a38] underline"
					onClick={() => setExpanded((value) => !value)}
					type="button"
				>
					{expanded ? 'Ocultar' : question.answers.length > 0 ? 'Ver respuestas y responder' : 'Responder'}
				</button>
			</div>

			{expanded && (
				<div className="mt-1 flex flex-col gap-2.5 border-t border-[#e3e8e2] pt-2.5" id={answersId}>
					{question.answers.map((item) => (
						<div className="flex gap-2.5" key={item.id}>
							<div
								aria-hidden="true"
								className="flex size-7 shrink-0 items-center justify-center rounded-2xl bg-white text-[11px] font-semibold text-[#586a61]"
							>
								{item.initials}
							</div>
							<div className="flex min-w-0 flex-col gap-0.5">
								<p className="whitespace-pre-line text-[13px] text-[#14201a]">{item.text}</p>
								<p className="text-[11px] text-[#8a9a91]">
									{item.mine ? 'Tu respuesta' : 'Vecino'} · {formatRelative(item.publishedAt)}
								</p>
							</div>
						</div>
					))}

					{isAuthenticated ? (
						<form className="flex flex-col gap-2" onSubmit={handleAnswer}>
							<textarea
								aria-label={`Tu respuesta a: ${question.text}`}
								className={TEXTAREA_CLASS}
								maxLength={MAX_ANSWER}
								onChange={(event) => setDraft(event.target.value)}
								placeholder="Escribí tu respuesta…"
								rows={2}
								value={draft}
							/>
							{answer.isError && (
								<p className={ERROR_TEXT_CLASS} role="alert">
									{communityErrorMessage(answer.error, 'No pudimos publicar tu respuesta. Intentá de nuevo.')}
								</p>
							)}
							<Button
								className={`${GHOST_BUTTON_CLASS} self-end !py-2`}
								disabled={text.length === 0 || answer.isPending}
								label={answer.isPending ? 'Enviando…' : 'Responder'}
								type="submit"
								variant="outlined"
							/>
						</form>
					) : (
						<button
							className="cursor-pointer self-start text-xs font-semibold text-[#1f4a38] underline"
							onClick={goToLogin}
							type="button"
						>
							Iniciá sesión para responder
						</button>
					)}
				</div>
			)}
		</li>
	)
}
