import { Link, useSearchParams } from 'react-router-dom'
import { useDebouncedValue } from '../../../core/hooks'
import { InputText } from '../../../shared/components/input-text'
import { MIN_ZONE_SEARCH_LENGTH, useZoneSearch } from '../api/zone.api'
import type { ZoneSearchResult } from '../api/zone.api'
import { CARD_CLASS } from '../constants'
import { useIsZoneSaved, useSavedZonesStore } from '../store/saved-zones.store'
import type { SavedZone } from '../store/saved-zones.store'
import { zoneSubtitleParts, zoneTitle } from '../utils/zone-detail'

type ZoneListItem = Omit<SavedZone, 'savedAt'>

const toListItem = (zone: ZoneSearchResult): ZoneListItem => ({
	id: zone.id,
	name: zoneTitle(zone.name, zone.jurisdictions),
	subtitle: zoneSubtitleParts(zone.jurisdictions, zone.areaKm2).join(' · '),
})

function SaveToggle({ zone }: { zone: ZoneListItem }) {
	const saved = useIsZoneSaved(zone.id)
	const save = useSavedZonesStore((state) => state.save)
	const remove = useSavedZonesStore((state) => state.remove)

	return (
		<button
			aria-label={saved ? `Quitar ${zone.name} de guardadas` : `Guardar ${zone.name}`}
			aria-pressed={saved}
			className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-[#1f4a38] transition-colors hover:bg-[#e6f3e9]"
			onClick={() => (saved ? remove(zone.id) : save(zone))}
			type="button"
		>
			<i aria-hidden="true" className={`pi ${saved ? 'pi-bookmark-fill' : 'pi-bookmark'} text-base`} />
		</button>
	)
}

function ZoneRow({ zone }: { zone: ZoneListItem }) {
	return (
		<li className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#fafbf8]">
			<Link className="flex min-w-0 flex-1 flex-col gap-0.5" to={`/zonas/${zone.id}`}>
				<span className="truncate text-[15px] font-semibold text-[#14201a]">{zone.name}</span>
				<span className="truncate text-[13px] text-[#586a61]">{zone.subtitle}</span>
			</Link>
			<SaveToggle zone={zone} />
		</li>
	)
}

function SearchResults({ text }: { text: string }) {
	const debouncedText = useDebouncedValue(text.trim(), 250)
	const searchQuery = useZoneSearch(debouncedText)

	if (!searchQuery.isEnabled) {
		return (
			<p className="px-3 text-sm text-[#586a61]">
				Escribí al menos {MIN_ZONE_SEARCH_LENGTH} letras: barrios de CABA, localidades y partidos del Conurbano.
			</p>
		)
	}

	if (searchQuery.isPending) {
		return (
			<p className="px-3 text-sm text-[#586a61]" role="status">
				Buscando zonas…
			</p>
		)
	}

	if (searchQuery.isError) {
		return (
			<div className="flex items-center gap-2 px-3 text-sm text-[#14201a]">
				No pudimos buscar zonas.
				<button
					className="cursor-pointer font-semibold text-[#1f4a38] underline"
					onClick={() => void searchQuery.refetch()}
					type="button"
				>
					Reintentar
				</button>
			</div>
		)
	}

	if (searchQuery.data.length === 0) {
		return <p className="px-3 text-sm text-[#586a61]">No encontramos zonas que coincidan con “{debouncedText}”.</p>
	}

	return (
		<ul
			aria-busy={searchQuery.isPlaceholderData}
			aria-label="Resultados de la búsqueda"
			className={`flex flex-col transition-opacity ${searchQuery.isPlaceholderData ? 'opacity-50' : ''}`}
		>
			{searchQuery.data.map((zone) => (
				<ZoneRow key={zone.id} zone={toListItem(zone)} />
			))}
		</ul>
	)
}

export function ZonesPage() {
	const [searchParams, setSearchParams] = useSearchParams()
	const savedZones = useSavedZonesStore((state) => state.zones)
	const text = searchParams.get('q') ?? ''

	// El texto queda en la URL para que "volver" desde el detalle conserve la búsqueda
	const setText = (value: string) => setSearchParams(value ? { q: value } : {}, { replace: true })

	return (
		<div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6">
			<header className="flex flex-col gap-1.5">
				<h1 className="text-[30px] font-bold leading-tight text-[#14201a]">Zonas</h1>
				<p className="text-[15px] text-[#586a61]">Buscá una zona para ver sus datos o volvé a las que guardaste.</p>
			</header>

			<div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
				<section aria-labelledby="zone-search-title" className={`${CARD_CLASS} flex flex-col gap-4 p-6`}>
					<h2 className="text-lg font-semibold text-[#14201a]" id="zone-search-title">
						Buscar zona
					</h2>
					<InputText
						aria-label="Nombre de la zona"
						autoFocus={savedZones.length === 0}
						fullWidth
						leftIcon={<i aria-hidden="true" className="pi pi-search" />}
						onChange={(event) => setText(event.target.value)}
						placeholder="Barrio, localidad o partido (p. ej. Villa Luro)"
						type="search"
						value={text}
					/>
					<SearchResults text={text} />
				</section>

				<section
					aria-labelledby="saved-zones-title"
					className={`${CARD_CLASS} flex flex-col gap-4 p-6 lg:sticky lg:top-0`}
				>
					<div className="flex items-center gap-2.5">
						<h2 className="text-lg font-semibold text-[#14201a]" id="saved-zones-title">
							Zonas guardadas
						</h2>
						<span className="ml-auto text-[13px] font-medium text-[#8a9a91]">
							{savedZones.length} {savedZones.length === 1 ? 'zona' : 'zonas'}
						</span>
					</div>
					{savedZones.length === 0 ? (
						<p className="px-3 text-sm text-[#586a61]">
							Todavía no guardaste zonas. Tocá <i aria-label="guardar" className="pi pi-bookmark text-xs" /> en un
							resultado o “Guardar zona” en el detalle para tenerla a mano acá.
						</p>
					) : (
						<ul className="flex flex-col">
							{savedZones.map((zone) => (
								<ZoneRow key={zone.id} zone={zone} />
							))}
						</ul>
					)}
					<p className="px-3 text-xs text-[#8a9a91]">Las zonas guardadas quedan en este navegador.</p>
				</section>
			</div>
		</div>
	)
}
