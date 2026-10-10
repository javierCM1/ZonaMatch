import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAnalisis, deleteAnalisis, getAnalisis, updateAnalisis } from '../api/analisis.api'
import type { CrearAnalisisPayload } from '../api/analisis.api'

export function useMisAnalisis() {
	return useQuery({
		queryKey: ['analisis-detallado'],
		queryFn: getAnalisis,
	})
}

export function useSaveAnalisis() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async ({
			id,
			payload,
		}: {
			/** Present → overwrite that analysis; absent → create a new one. */
			id?: string
			payload: CrearAnalisisPayload
		}) => (id ? updateAnalisis(id, payload) : createAnalisis(payload)),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['analisis-detallado'] })
		},
	})
}

export function useDeleteAnalisis() {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: deleteAnalisis,
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: ['analisis-detallado'] })
		},
	})
}
