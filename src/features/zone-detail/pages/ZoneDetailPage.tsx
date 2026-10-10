import { useMemo } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button } from '../../../shared/components/button'
import { isZoneNotFound, useZone } from '../api/zone.api'
import { ZoneCommunityTab } from '../components/ZoneCommunityTab'
import { ZoneDataTab } from '../components/ZoneDataTab'
import { GHOST_BUTTON_CLASS } from '../constants'
import { getZoneContent } from '../data/zones.mock'
import { useIsZoneSaved, useSavedZonesStore } from '../store/saved-zones.store'
import type { ZoneTabId } from '../types'
import { buildZoneDetail } from '../utils/zone-detail'

const TABS: { id: ZoneTabId; label: string }[] = [
	{ id: 'datos', label: 'Datos de la zona' },
	{ id: 'comunidad', label: 'Comunidad' },
]

export function ZoneDetailPage() {
	const { zoneId = '' } = useParams()
	const navigate = useNavigate()
	const [searchParams, setSearchParams] = useSearchParams()
	const location = useLocation()
	const saved = useIsZoneSaved(zoneId)
	const saveZone = useSavedZonesStore((state) => state.save)
	const removeZone = useSavedZonesStore((state) => state.remove)

	const zoneQuery = useZone(zoneId)
	const zone = useMemo(
		() => zoneQuery.data && buildZoneDetail(zoneQuery.data, getZoneContent(zoneId)),
		[zoneQuery.data, zoneId],
	)
	const activeTab: ZoneTabId = searchParams.get('tab') === 'comunidad' ? 'comunidad' : 'datos'

	if (zoneQuery.isPending) {
		return (
			<p className="text-[15px] text-[#586a61]" role="status">
				Cargando zona…
			</p>
		)
	}

	if (zoneQuery.isError && !isZoneNotFound(zoneQuery.error)) {
		return (
			<div className="flex flex-col items-start gap-4">
				<h1 className="text-2xl font-bold text-[#14201a]">No pudimos cargar esta zona</h1>
				<p className="text-[15px] text-[#586a61]">Revisá tu conexión e intentá de nuevo.</p>
				<Button className={GHOST_BUTTON_CLASS} label="Reintentar" onClick={() => void zoneQuery.refetch()} variant="outlined" />
			</div>
		)
	}

	if (!zone) {
		return (
			<div className="flex flex-col items-start gap-4">
				<h1 className="text-2xl font-bold text-[#14201a]">No encontramos esta zona</h1>
				<p className="text-[15px] text-[#586a61]">Es posible que el enlace sea incorrecto o que la zona ya no esté disponible.</p>
				<Button className={GHOST_BUTTON_CLASS} label="Buscar otra zona" onClick={() => navigate('/zonas')} variant="outlined" />
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-5">
			<header className="flex flex-wrap items-center gap-4">
				<div className="flex min-w-0 flex-col gap-1.5">
					<h1 className="text-[30px] font-bold leading-tight text-[#14201a]">{zone.name}</h1>
					<p className="text-[15px] text-[#586a61]">{zone.subtitleParts.join(' · ')}</p>
				</div>
				<div className="ml-auto flex flex-wrap items-center gap-4">
					<Button
						aria-pressed={saved}
						className={GHOST_BUTTON_CLASS}
						label={saved ? '★  Zona guardada' : '☆  Guardar zona'}
						onClick={() =>
							saved
								? removeZone(zone.id)
								: saveZone({ id: zone.id, name: zone.name, subtitle: zone.subtitleParts.join(' · ') })
						}
						variant="outlined"
					/>
					<Button
						className={GHOST_BUTTON_CLASS}
						label="Volver al resultado"
						// Sin historial (enlace abierto directo) se vuelve al buscador de zonas
						onClick={() => (location.key === 'default' ? navigate('/zonas') : navigate(-1))}
						variant="outlined"
					/>
				</div>
			</header>

			<div className="flex gap-7 border-b border-[#e3e8e2]" role="tablist">
				{TABS.map((tab) => {
					const active = activeTab === tab.id

					return (
						<button
							aria-controls={`zone-tabpanel-${tab.id}`}
							aria-selected={active}
							className={`-mb-px cursor-pointer border-b-[3px] pb-2.5 pt-1 text-[15px] transition-colors ${
								active
									? 'border-[#1f4a38] font-semibold text-[#1f4a38]'
									: 'border-transparent font-medium text-[#586a61] hover:text-[#1f4a38]'
							}`}
							id={`zone-tab-${tab.id}`}
							key={tab.id}
							onClick={() => setSearchParams({ tab: tab.id }, { replace: true })}
							role="tab"
							type="button"
						>
							{tab.label}
						</button>
					)
				})}
			</div>

			<div aria-labelledby={`zone-tab-${activeTab}`} id={`zone-tabpanel-${activeTab}`} role="tabpanel">
				{activeTab === 'comunidad' ? (
					<ZoneCommunityTab key={zone.id} zone={zone} />
				) : (
					<ZoneDataTab key={zone.id} zone={zone} />
				)}
			</div>
		</div>
	)
}
