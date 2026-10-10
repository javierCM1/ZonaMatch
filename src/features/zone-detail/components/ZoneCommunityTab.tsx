import { useState } from 'react'
import { useContributionStats } from '../api/community.api'
import { useLoginGate } from '../hooks/useLoginGate'
import type { ContributionMode, ZoneDetail } from '../types'
import { ContributeCard } from './ContributeCard'
import { ContributionDialog } from './ContributionDialog'
import { PendingContributionsCard } from './PendingContributionsCard'
import { QuestionsCard } from './QuestionsCard'
import { ReviewsCard } from './ReviewsCard'

interface ZoneCommunityTabProps {
	zone: ZoneDetail
}

export function ZoneCommunityTab({ zone }: ZoneCommunityTabProps) {
	const [dialogMode, setDialogMode] = useState<ContributionMode | null>(null)
	const [sentContribution, setSentContribution] = useState(false)
	const { isAuthenticated, goToLogin } = useLoginGate()
	const statsQuery = useContributionStats(zone.id)

	// Aportar necesita una cuenta: sin sesión se va al login y se vuelve a esta pantalla
	const openDialog = (mode: ContributionMode) => (isAuthenticated ? setDialogMode(mode) : goToLogin())

	return (
		<div className="flex flex-col gap-6 xl:flex-row xl:items-start">
			<ReviewsCard zoneId={zone.id} zoneName={zone.name} />

			<div className="flex min-w-0 flex-col gap-6 xl:w-[42%] xl:max-w-[680px] xl:shrink-0">
				<QuestionsCard zoneId={zone.id} />
				<ContributeCard
					onAddPoi={() => openDialog('poi')}
					onCorrectData={() => openDialog('correccion')}
					showThanks={sentContribution}
					stats={statsQuery.data}
				/>
				<PendingContributionsCard zoneId={zone.id} />
			</div>

			{dialogMode && (
				<ContributionDialog
					initialMode={dialogMode}
					onHide={() => setDialogMode(null)}
					onSent={() => {
						setSentContribution(true)
						setDialogMode(null)
					}}
					zone={zone}
				/>
			)}
		</div>
	)
}
