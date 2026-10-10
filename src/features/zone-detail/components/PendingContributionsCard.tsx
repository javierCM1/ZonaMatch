import { communityErrorMessage, usePendingContributions, useValidateContribution } from '../api/community.api'
import { CARD_CLASS, CORRECTION_REASON_LABEL, ERROR_TEXT_CLASS, POI_CATEGORY_BY_ID, VOTES_TO_RESOLVE } from '../constants'
import { useLoginGate } from '../hooks/useLoginGate'
import type { PendingContribution } from '../types'
import { formatRelative } from '../utils/dates'
import { CategoryBadge } from './CategoryBadge'

interface PendingContributionsCardProps {
	zoneId: string
}

/** Qué se propone, en una línea: "Farmacia Sol · Salud" o "Kiosco Pepe: el nombre está mal → Kiosco Pepito". */
function proposalText(contribution: PendingContribution): string {
	if (contribution.kind === 'punto-nuevo') {
		const details = [contribution.address, contribution.schedule].filter(Boolean).join(' · ')
		return details ? `${contribution.name} · ${details}` : (contribution.name ?? '')
	}

	const reason = contribution.reason ? CORRECTION_REASON_LABEL[contribution.reason] : 'Corrección'
	const proposed =
		contribution.reason === 'nombre'
			? contribution.name
			: contribution.reason === 'categoria' && contribution.categoryId
				? POI_CATEGORY_BY_ID[contribution.categoryId].label
				: contribution.reason === 'ubicacion'
					? 'nueva ubicación marcada en el mapa'
					: null

	return `${contribution.placeName}: ${reason.toLowerCase()}${proposed ? ` → ${proposed}` : ''}`
}

export function PendingContributionsCard({ zoneId }: PendingContributionsCardProps) {
	const { isAuthenticated, goToLogin } = useLoginGate()
	const pendingQuery = usePendingContributions(zoneId)
	const validate = useValidateContribution(zoneId)

	// Sin aportes pendientes la tarjeta no ocupa lugar
	if (!pendingQuery.isSuccess || pendingQuery.data.length === 0) {
		return null
	}

	const vote = (contribution: PendingContribution, confirm: boolean) => {
		if (!isAuthenticated) {
			goToLogin()
			return
		}

		validate.mutate({ contributionId: contribution.id, confirm })
	}

	return (
		<section aria-labelledby="pending-title" className={`${CARD_CLASS} flex flex-col gap-3.5 p-6`}>
			<div className="flex flex-col gap-1">
				<h2 className="text-lg font-semibold text-[#14201a]" id="pending-title">
					Aportes para validar
				</h2>
				<p className="text-[13px] text-[#586a61]">
					¿Conocés la zona? Confirmá o rechazá lo que sumaron otros vecinos. Con {VOTES_TO_RESOLVE} votos de diferencia se
					publica o se descarta.
				</p>
			</div>

			{validate.isError && (
				<p className={ERROR_TEXT_CLASS} role="alert">
					{communityErrorMessage(validate.error, 'No pudimos registrar tu voto. Intentá de nuevo.')}
				</p>
			)}

			<ul className="flex flex-col gap-3">
				{pendingQuery.data.map((contribution) => {
					const busy = validate.isPending && validate.variables?.contributionId === contribution.id
					const category = contribution.categoryId ? POI_CATEGORY_BY_ID[contribution.categoryId] : null

					return (
						<li className="flex flex-col gap-2 rounded-xl bg-[#fafbf8] px-3.5 py-3" key={contribution.id}>
							<div className="flex items-start gap-2.5">
								{contribution.kind === 'punto-nuevo' && category ? (
									<CategoryBadge category={category} size={22} />
								) : (
									<i aria-hidden="true" className="pi pi-pencil mt-0.5 text-sm text-[#586a61]" />
								)}
								<div className="flex min-w-0 flex-col gap-0.5">
									<p className="text-[13px] font-semibold text-[#14201a]">
										{contribution.kind === 'punto-nuevo' ? `Lugar nuevo${category ? ` · ${category.label}` : ''}` : 'Corrección'}
									</p>
									<p className="text-[13px] text-[#14201a]">{proposalText(contribution)}</p>
									{contribution.comment && <p className="text-xs italic text-[#586a61]">“{contribution.comment}”</p>}
									<p className="text-[11px] text-[#8a9a91]">
										{contribution.mine ? 'Tu aporte' : 'Aporte de un vecino'} · {formatRelative(contribution.publishedAt)} ·{' '}
										{contribution.confirmations} a favor · {contribution.rejections} en contra
									</p>
								</div>
							</div>

							{contribution.mine ? (
								<p className="text-xs text-[#586a61]">Esperando que lo validen otros vecinos.</p>
							) : (
								<div aria-label="Validar aporte" className="flex flex-wrap gap-2" role="group">
									<VoteButton
										active={contribution.myVote === true}
										disabled={busy}
										icon="pi-check"
										label="Es correcto"
										onClick={() => vote(contribution, true)}
									/>
									<VoteButton
										active={contribution.myVote === false}
										disabled={busy}
										icon="pi-times"
										label="No es correcto"
										onClick={() => vote(contribution, false)}
									/>
								</div>
							)}
						</li>
					)
				})}
			</ul>
		</section>
	)
}

interface VoteButtonProps {
	label: string
	icon: string
	active: boolean
	disabled: boolean
	onClick: () => void
}

function VoteButton({ label, icon, active, disabled, onClick }: VoteButtonProps) {
	return (
		<button
			aria-pressed={active}
			className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border-[1.5px] px-3.5 py-1.5 text-xs font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 ${
				active ? 'border-[#1f4a38] bg-[#e4f3e8] text-[#1f4a38]' : 'border-[#e3e8e2] bg-white text-[#1f4a38] hover:bg-[#f2faf3]'
			}`}
			disabled={disabled}
			onClick={onClick}
			type="button"
		>
			<i aria-hidden="true" className={`pi ${icon} text-[11px]`} />
			{label}
		</button>
	)
}
