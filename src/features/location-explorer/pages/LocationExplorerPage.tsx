import { useState } from 'react'
import { Button } from 'primereact/button'
import { Chip } from '../../../shared/components/chip'
import { Map, RightPanel, SearchBar } from '../../../shared/components'

interface LocationResult {
	id: string
	name: string
	category: string
	address: string
	distance: string
	color: string
	mapColor: string
	latitude: number
	longitude: number
}

const locations: LocationResult[] = [
	{
		id: 'palermo-soho',
		name: 'Palermo Soho',
		category: 'Barrio',
		address: 'Costa Rica 4680, Buenos Aires',
		distance: '1,2 km',
		color: 'bg-emerald-500',
		mapColor: '#10b981',
		latitude: -34.5889,
		longitude: -58.4247,
	},
	{
		id: 'parque-las-heras',
		name: 'Parque Las Heras',
		category: 'Espacio verde',
		address: 'Av. General Las Heras 3850, Buenos Aires',
		distance: '2,4 km',
		color: 'bg-amber-500',
		mapColor: '#f59e0b',
		latitude: -34.5795,
		longitude: -58.4066,
	},
	{
		id: 'club-palermo',
		name: 'Club Palermo',
		category: 'Deportes',
		address: 'Av. Córdoba 5500, Buenos Aires',
		distance: '3,1 km',
		color: 'bg-sky-500',
		mapColor: '#0ea5e9',
		latitude: -34.5941,
		longitude: -58.4437,
	},
]

export function LocationExplorerPage() {
	const [search, setSearch] = useState('')
	const [selectedLocation, setSelectedLocation] = useState<LocationResult>(locations[0])

	const filteredLocations = locations.filter((location) =>
		`${location.name} ${location.category} ${location.address}`
			.toLowerCase()
			.includes(search.toLowerCase()),
	)

	return (
		<div className="grid h-full min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_348px]">
			<main className="relative min-h-[520px] overflow-hidden bg-[#e8eee9]">
				<div className="absolute left-5 top-5 z-10 w-[min(420px,calc(100%-2.5rem))]">
					<SearchBar
						aria-label="Buscar lugares"
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Buscá un lugar, actividad o barrio"
						value={search}
					/>
				</div>
					<div className="absolute left-5 top-24 z-10 flex flex-wrap gap-2">
						<Chip label="Todos" className="!border-0 !bg-slate-950 !text-white" />
						<Chip label="Cerca mío" className="!border-0 !bg-white !text-slate-700" />
						<Chip label="Abiertos ahora" className="!border-0 !bg-white !text-slate-700" />
					</div>
					<div className="absolute bottom-5 left-5 z-10 rounded-xl border border-white/80 bg-white/90 px-3 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur">
						<i className="pi pi-info-circle mr-2 text-emerald-600" />
						Mapa de CABA y alrededores
					</div>
					<Map
						className="absolute inset-0"
						markers={locations.map((location) => ({
							id: location.id,
							latitude: location.latitude,
							longitude: location.longitude,
							color: location.mapColor,
							label: location.name,
							selected: selectedLocation.id === location.id,
						}))}
						onMarkerSelect={(marker) => {
							const location = locations.find((item) => item.id === marker.id)
							if (location) setSelectedLocation(location)
						}}
					/>
				</main>

				<RightPanel
					className="border-t border-slate-200 lg:border-l lg:border-t-0"
					onClose={() => setSelectedLocation(locations[0])}
					subtitle={`${filteredLocations.length} lugares encontrados cerca tuyo`}
					title="Descubrí lugares"
				>
					<div className="space-y-3">
						{filteredLocations.map((location) => (
							<button
								className={`w-full rounded-2xl border p-4 text-left transition-colors ${
									selectedLocation.id === location.id
										? 'border-emerald-300 bg-emerald-50/70'
										: 'border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50'
								}`}
								key={location.id}
								onClick={() => setSelectedLocation(location)}
								type="button"
							>
								<div className="flex items-start gap-3">
									<span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${location.color}`} />
									<span className="min-w-0">
										<span className="block text-sm font-semibold text-slate-950">{location.name}</span>
										<span className="mt-1 block text-xs font-medium text-slate-500">{location.category}</span>
										<span className="mt-3 block text-xs leading-5 text-slate-600">{location.address}</span>
									</span>
									<span className="ml-auto shrink-0 text-xs font-semibold text-slate-400">{location.distance}</span>
								</div>
							</button>
						))}
						{filteredLocations.length === 0 && (
							<div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center">
								<i className="pi pi-search text-xl text-slate-300" />
								<p className="mt-3 text-sm font-medium text-slate-700">No encontramos lugares</p>
								<p className="mt-1 text-xs text-slate-500">Probá con otra búsqueda.</p>
							</div>
						)}
					</div>
					<div className="mt-8 rounded-2xl bg-slate-950 p-5 text-white">
						<p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Seleccionado</p>
						<p className="mt-2 text-lg font-semibold">{selectedLocation.name}</p>
						<p className="mt-2 text-xs leading-5 text-slate-300">{selectedLocation.address}</p>
						<Button className="mt-4 !border-emerald-400 !bg-emerald-500 !text-slate-950" label="Ver detalles" />
					</div>
				</RightPanel>
			</div>
	)
}
