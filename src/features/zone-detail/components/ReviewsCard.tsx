import { useMemo, useState } from 'react'
import { Button } from '../../../shared/components/button'
import { ChoiceChip } from '../../../shared/components/chip'
import { communityErrorMessage, useToggleHelpful, useZoneReviews } from '../api/community.api'
import { ASPECT_LABEL, CARD_CLASS, ERROR_TEXT_CLASS, GHOST_BUTTON_CLASS, REVIEW_FILTERS } from '../constants'
import type { ReviewFilterId } from '../constants'
import { useLoginGate } from '../hooks/useLoginGate'
import type { Review, ReviewSummary } from '../types'
import { formatMonthYear } from '../utils/dates'
import { formatRating } from '../utils/ratings'
import { ReviewDialog } from './ReviewDialog'
import { Stars } from './Stars'

interface ReviewsCardProps {
	zoneId: string
	zoneName: string
}

function tenureLabel(years: number | null): string {
	if (years === null) {
		return 'Vecino de la zona'
	}

	if (years === 0) {
		return 'Vive en la zona hace menos de un año'
	}

	return `Vive en la zona hace ${years} ${years === 1 ? 'año' : 'años'}`
}

function filterReviews(reviews: Review[], filter: ReviewFilterId): Review[] {
	const byRecency = [...reviews].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

	if (filter === 'recientes') {
		return byRecency
	}

	if (filter === 'verificados') {
		return byRecency.filter((review) => review.verified)
	}

	return byRecency.filter((review) => review.topics.includes(filter))
}

export function ReviewsCard({ zoneId, zoneName }: ReviewsCardProps) {
	const [filter, setFilter] = useState<ReviewFilterId>('recientes')
	const [dialogOpen, setDialogOpen] = useState(false)
	const { isAuthenticated, goToLogin } = useLoginGate()

	const reviewsQuery = useZoneReviews(zoneId)
	const toggleHelpful = useToggleHelpful(zoneId)

	const reviews = reviewsQuery.data?.reviews
	const myReview = reviews?.find((review) => review.mine)
	const visibleReviews = useMemo(() => filterReviews(reviews ?? [], filter), [reviews, filter])

	const handleHelpful = (review: Review) => {
		if (!isAuthenticated) {
			goToLogin()
			return
		}

		toggleHelpful.mutate({ reviewId: review.id, helpful: !review.markedHelpfulByMe })
	}

	return (
		<section aria-labelledby="reviews-title" className={`${CARD_CLASS} flex min-w-0 flex-1 flex-col gap-[18px] p-6`}>
			<div className="flex items-center justify-between gap-4">
				<h2 className="text-lg font-semibold text-[#14201a]" id="reviews-title">
					Reseñas de vecinos
				</h2>
				<Button
					className={GHOST_BUTTON_CLASS}
					label={myReview ? 'Editar mi reseña' : 'Escribir reseña'}
					onClick={() => (isAuthenticated ? setDialogOpen(true) : goToLogin())}
					variant="outlined"
				/>
			</div>

			{!isAuthenticated && (
				<p className="text-xs text-[#8a9a91]">Para escribir una reseña o marcar una como útil tenés que iniciar sesión.</p>
			)}

			{reviewsQuery.isPending ? (
				<p className="text-sm text-[#586a61]" role="status">
					Cargando reseñas…
				</p>
			) : reviewsQuery.isError ? (
				<div className="flex items-center gap-2 text-sm text-[#14201a]">
					No pudimos cargar las reseñas.
					<button
						className="cursor-pointer font-semibold text-[#1f4a38] underline"
						onClick={() => void reviewsQuery.refetch()}
						type="button"
					>
						Reintentar
					</button>
				</div>
			) : reviewsQuery.data.summary.total === 0 ? (
				<p className="text-sm text-[#586a61]">Todavía nadie dejó una reseña de esta zona. ¡Contá cómo es vivir acá!</p>
			) : (
				<>
					<SummaryPanel summary={reviewsQuery.data.summary} />

					<div aria-label="Filtrar reseñas" className="flex flex-wrap gap-2" role="group">
						{REVIEW_FILTERS.map((option) => (
							<ChoiceChip
								key={option.id}
								label={option.label}
								onClick={() => setFilter(option.id)}
								selected={filter === option.id}
							/>
						))}
					</div>

					{toggleHelpful.isError && (
						<p className={ERROR_TEXT_CLASS} role="alert">
							{communityErrorMessage(toggleHelpful.error, 'No pudimos registrar tu voto. Intentá de nuevo.')}
						</p>
					)}

					{visibleReviews.length === 0 ? (
						<p className="border-t border-[#e3e8e2] pt-4 text-sm text-[#586a61]">Todavía no hay reseñas para este filtro.</p>
					) : (
						visibleReviews.map((review) => (
							<ReviewItem
								helpfulPending={toggleHelpful.isPending && toggleHelpful.variables?.reviewId === review.id}
								key={review.id}
								onHelpful={() => handleHelpful(review)}
								review={review}
							/>
						))
					)}
				</>
			)}

			{dialogOpen && (
				<ReviewDialog existing={myReview} onHide={() => setDialogOpen(false)} zoneId={zoneId} zoneName={zoneName} />
			)}
		</section>
	)
}

function SummaryPanel({ summary }: { summary: ReviewSummary }) {
	return (
		<div className="flex flex-col gap-6 rounded-xl bg-[#fafbf8] px-5 py-4 sm:flex-row sm:items-center sm:gap-8">
			<div className="flex shrink-0 flex-col gap-1 whitespace-nowrap">
				<p className="text-[40px] font-bold leading-none text-[#14201a]">{formatRating(summary.average)}</p>
				<Stars className="text-lg font-bold" value={summary.average} />
				<p className="text-xs text-[#586a61]">
					{summary.total} {summary.total === 1 ? 'reseña' : 'reseñas'} · {summary.verified} verificadas
				</p>
			</div>

			<ul className="flex min-w-0 flex-1 flex-col gap-2.5">
				{summary.aspects.map((aspect) => {
					const label = ASPECT_LABEL[aspect.id]

					return (
						<li className="flex items-center gap-3.5" key={aspect.id}>
							<span className="w-[150px] shrink-0 text-[13px] text-[#586a61]">{label}</span>
							<div
								aria-label={`${label}: ${formatRating(aspect.value)} de 5`}
								aria-valuemax={5}
								aria-valuemin={0}
								aria-valuenow={aspect.value}
								className="h-2 min-w-0 max-w-[300px] flex-1 overflow-hidden rounded bg-[#e3e8e2]"
								role="meter"
							>
								<div className="h-full rounded bg-[#b7e24d]" style={{ width: `${(aspect.value / 5) * 100}%` }} />
							</div>
							<span className="text-[13px] font-semibold text-[#14201a]">{formatRating(aspect.value)}</span>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

interface ReviewItemProps {
	review: Review
	helpfulPending: boolean
	onHelpful: () => void
}

function ReviewItem({ review, helpfulPending, onHelpful }: ReviewItemProps) {
	return (
		<article className="flex flex-col gap-2 border-t border-[#e3e8e2] pt-4">
			<div className="flex items-center gap-3">
				<div
					aria-hidden="true"
					className="flex size-8 shrink-0 items-center justify-center rounded-2xl bg-[#fafbf8] text-xs font-semibold text-[#586a61]"
				>
					{review.initials}
				</div>
				<div className="flex min-w-0 flex-col gap-0.5">
					<p className="text-[13px] font-semibold text-[#14201a]">
						{tenureLabel(review.yearsInZone)}
						{review.verified ? ' · Verificado' : ''}
						{review.mine && <span className="ml-2 rounded-full bg-[#e4f3e8] px-2 py-0.5 text-[11px] text-[#1f4a38]">Tu reseña</span>}
					</p>
					<p className="whitespace-pre text-xs text-[#586a61]">
						<Stars value={review.rating} />
						{` ${formatRating(review.rating)}  ·  ${formatMonthYear(review.publishedAt)}`}
					</p>
				</div>
				{review.mine ? (
					<span className="ml-auto shrink-0 text-xs font-medium text-[#586a61]">Útil ({review.helpfulCount})</span>
				) : (
					<button
						aria-label={`Marcar reseña como útil (${review.helpfulCount})`}
						aria-pressed={review.markedHelpfulByMe}
						className={`ml-auto flex shrink-0 cursor-pointer items-center gap-1.5 text-xs font-medium transition-colors hover:text-[#1f4a38] disabled:cursor-wait disabled:opacity-60 ${
							review.markedHelpfulByMe ? 'text-[#1f4a38]' : 'text-[#586a61]'
						}`}
						disabled={helpfulPending}
						onClick={onHelpful}
						type="button"
					>
						<i aria-hidden="true" className={`pi ${review.markedHelpfulByMe ? 'pi-thumbs-up-fill' : 'pi-thumbs-up'} text-sm`} />
						Útil ({review.helpfulCount})
					</button>
				)}
			</div>
			<p className="whitespace-pre-line text-sm text-[#14201a]">{review.text}</p>
			{review.topics.length > 0 && (
				<p className="text-xs text-[#8a9a91]">Habla de: {review.topics.map((topic) => ASPECT_LABEL[topic]).join(', ')}</p>
			)}
		</article>
	)
}
