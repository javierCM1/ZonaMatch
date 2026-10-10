import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

/** Lo necesario para listar la zona sin volver a pedirla al backend. */
export interface SavedZone {
	id: string
	name: string
	subtitle: string
	/** ISO, para ordenar de la más nueva a la más vieja. */
	savedAt: string
}

interface SavedZonesState {
	zones: SavedZone[]
	save: (zone: Omit<SavedZone, 'savedAt'>) => void
	remove: (zoneId: string) => void
}

// Todavía no hay usuarios en el backend: las zonas guardadas viven en el navegador (localStorage).
// Si el almacenamiento no está disponible, la lista funciona igual durante la sesión.
export const useSavedZonesStore = create<SavedZonesState>()(
	persist(
		(set) => ({
			zones: [],
			save: (zone) =>
				set((state) => ({
					zones: [
						{ ...zone, savedAt: new Date().toISOString() },
						...state.zones.filter((saved) => saved.id !== zone.id),
					],
				})),
			remove: (zoneId) => set((state) => ({ zones: state.zones.filter((saved) => saved.id !== zoneId) })),
		}),
		{ name: 'zonamatch.saved-zones', version: 1, storage: createJSONStorage(() => localStorage) },
	),
)

export const useIsZoneSaved = (zoneId: string) =>
	useSavedZonesStore((state) => state.zones.some((saved) => saved.id === zoneId))
