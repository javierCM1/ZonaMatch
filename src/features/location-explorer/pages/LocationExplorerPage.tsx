import { useState } from 'react'
import { Button } from 'primereact/button'
import { SelectButton } from 'primereact/selectbutton'
import type { LatLngExpression } from 'leaflet'
import { useOutletContext } from 'react-router-dom'
import { Chip } from '../../../shared/components/chip'
import { RightPanel } from '../../../shared/components/right-panel'
import { MapView } from '../../../shared/components/map'
import type { AppLayoutOutletContext } from '../../../shared/layouts/AppLayout'

interface Neighborhood {
	id: string
	name: string
	comparisonLabel: string
	latitude: number
	longitude: number
	area: LatLngExpression[]
}

const neighborhoods: Neighborhood[] = [
	{
		id: 'palermo',
		name: 'Palermo',
		comparisonLabel: 'Palermo, CABA',
		latitude: -34.5889,
		longitude: -58.4247,
		area: [
			[-34.572, -58.439],
			[-34.571, -58.422],
			[-34.578, -58.411],
			[-34.577, -58.398],
			[-34.585, -58.393],
			[-34.592, -58.401],
			[-34.598, -58.414],
			[-34.604, -58.429],
			[-34.597, -58.44],
			[-34.585, -58.444],
		],
	},
	{
		id: 'mataderos',
		name: 'Mataderos',
		comparisonLabel: 'Mataderos, CABA',
		latitude: -34.6595,
		longitude: -58.5085,
		area: [
			[-34.646, -58.524],
			[-34.645, -58.507],
			[-34.65, -58.495],
			[-34.663, -58.495],
			[-34.67, -58.506],
			[-34.666, -58.523],
			[-34.656, -58.529],
		],
	},
	{
		id: 'ramos-mejia',
		name: 'Ramos Mejía',
		comparisonLabel: 'Ramos Mejía, La Matanza',
		latitude: -34.6436,
		longitude: -58.5628,
		area: [
			[-34.634, -58.575],
			[-34.635, -58.559],
			[-34.642, -58.551],
			[-34.65, -58.556],
			[-34.652, -58.57],
			[-34.644, -58.578],
		],
	},
]

const categories = [
	{ label: 'Transporte', icon: 'pi pi-directions' },
	{ label: 'Educación', icon: 'pi pi-book' },
	{ label: 'Salud', icon: 'pi pi-heart' },
	{ label: 'Seguridad', icon: 'pi pi-shield' },
	{ label: 'Espacios verdes', icon: 'pi pi-sun' },
	{ label: 'Ambiente', icon: 'pi pi-globe' },
]

const radiusOptions = [
	{ label: '500 m', value: '500 m' },
	{ label: '1 km', value: '1 km' },
	{ label: '2 km', value: '2 km' },
]

const initialComparisons = ['Mataderos, CABA', 'Ramos Mejía, La Matanza']

export function LocationExplorerPage() {
	const { search } = useOutletContext<AppLayoutOutletContext>()
	const [selectedCategories, setSelectedCategories] = useState(['Transporte', 'Educación', 'Salud'])
	const [analysisRadius, setAnalysisRadius] = useState('1 km')
	const [comparisons, setComparisons] = useState(initialComparisons)

	const matchingLocation = neighborhoods.find((neighborhood) =>
		neighborhood.name.toLocaleLowerCase('es').includes(search.trim().toLocaleLowerCase('es')),
	)
	const selectedLocation = matchingLocation ?? neighborhoods[0]

	function toggleCategory(category: string) {
		setSelectedCategories((current) =>
			current.includes(category)
				? current.filter((item) => item !== category)
				: [...current, category],
		)
	}

	function addSelectedLocation() {
		setComparisons((current) =>
			current.includes(selectedLocation.comparisonLabel)
				? current
				: [...current, selectedLocation.comparisonLabel],
		)
	}

	return (
		<div className="grid h-full min-h-0 grid-cols-[minmax(0,1fr)_260px] gap-4 max-[1023px]:grid-cols-1 max-[1023px]:grid-rows-[minmax(420px,58dvh)_auto] max-[1023px]:overflow-y-auto">
			<main className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)_49px] gap-4">
				<div aria-label="Capas del mapa" className="flex min-w-0 flex-wrap content-start items-center gap-2 overflow-hidden">
					{categories.map((category) => {
						const active = selectedCategories.includes(category.label)

						return (
							<Button
								aria-pressed={active}
								className={`!h-8 !shrink-0 !rounded-full !border-transparent !px-3 !text-[13px] !font-medium !shadow-none ${
									active
										? '!bg-[#1f8b5b] !text-white hover:!bg-[#18784e]'
										: '!bg-[#e6e8e7] !text-[#45534b] hover:!bg-[#d8dcda]'
								}`}
								icon={category.icon}
								key={category.label}
								label={category.label}
								onClick={() => toggleCategory(category.label)}
								outlined
							/>
						)
					})}
				</div>

				<section aria-label={`Mapa de ${selectedLocation.name}`} className="relative min-h-0 overflow-hidden rounded-xl bg-[#edf0ed]">
					<MapView
						selectedArea={selectedLocation.area}
						latitude={selectedLocation.latitude}
						longitude={selectedLocation.longitude}
						selectedMarker={{
							latitude: selectedLocation.latitude,
							longitude: selectedLocation.longitude,
							label: selectedLocation.name,
						}}
						zoom={12}
						className="absolute inset-0"
					/>
					<div className="pointer-events-none absolute left-1/2 top-[44%] z-[500] -translate-x-1/2 rounded bg-white/85 px-3 py-1 text-[15px] font-medium text-[#263b31] shadow-sm">
						{selectedLocation.name}
					</div>
				</section>

				<div className="flex min-w-0 items-center gap-3 overflow-x-auto text-sm text-[#56675e]">
					<span className="shrink-0">Radio de análisis:</span>
					<SelectButton
						allowEmpty={false}
						className="[&_.p-button]:!h-[31px] [&_.p-button]:!rounded-full [&_.p-button]:!border-[#dfe7df] [&_.p-button]:!bg-white [&_.p-button]:!px-4 [&_.p-button]:!text-[#234d3a] [&_.p-button.p-highlight]:!border-[#285b43] [&_.p-button.p-highlight]:!bg-[#e5f2e8]"
						onChange={(event) => event.value && setAnalysisRadius(event.value)}
						optionLabel="label"
						optionValue="value"
						options={radiusOptions}
						value={analysisRadius}
					/>
				</div>
			</main>

			<RightPanel
				className="my-0 h-full min-h-[220px] rounded-xl border border-[#dfe7df]"
				title={<span className="block w-full text-center text-[13px] font-semibold uppercase tracking-wide text-[#233a2e]">Comparaciones activas</span>}
			>
				<div className="space-y-3">
					{comparisons.map((comparison) => (
						<Chip
							className="flex h-7 w-full justify-center rounded-full bg-[#edf6d8] px-2 text-[14px] text-[#2b3c32]"
							key={comparison}
							label={comparison}
						/>
					))}
				</div>
				<div className="my-4 border-t border-[#e4e9e4]" />
				<div className="flex items-center justify-between gap-2">
					<h3 className="w-full text-center text-[13px] font-semibold uppercase tracking-wide text-[#233a2e]">Zona seleccionada</h3>
				</div>
				<div className="mt-3 flex h-7 items-center justify-between rounded-full bg-[#e9eee9] pl-3 text-[14px] text-[#2b3c32]">
					<span className="truncate">{selectedLocation.comparisonLabel}</span>
					<Button
						aria-label={`Agregar ${selectedLocation.comparisonLabel} a comparaciones`}
						className="!h-7 !w-8 !bg-transparent !p-0 !text-[#14201a] hover:!bg-[#dce5dc]"
						icon="pi pi-plus"
						onClick={addSelectedLocation}
						rounded
					/>
				</div>
			</RightPanel>
		</div>
	)
}
