import { useReducer } from 'react'
import { createId } from '../../../core/utils'
import { ANALYSIS_STEPS, DEFAULT_AGE_RANGE, DEFAULT_PRIORITY } from '../constants/analysis.constants'
import type {
	AgeRange,
	ContextoState,
	CriterioId,
	CriteriosState,
	DetailedAnalysisState,
	Lugar,
	MobilityId,
	PetId,
	PuntosState,
	PrioridadId,
} from '../types'

export function createInitialContexto(): ContextoState {
	return {
		personas: 1,
		edades: [DEFAULT_AGE_RANGE],
		movilidad: [],
		mascotas: [],
	}
}

export function createInitialCriterios(): CriteriosState {
	return {}
}

export function createInitialPuntos(): PuntosState {
	return {
		lugares: [],
		alquilerMaximo: '',
	}
}

export function createInitialAnalysis(): DetailedAnalysisState {
	return {
		contexto: createInitialContexto(),
		criterios: createInitialCriterios(),
		puntos: createInitialPuntos(),
	}
}

type AnalysisAction =
	| { type: 'set-personas'; personas: number }
	| { type: 'set-edad'; index: number; edad: AgeRange }
	| { type: 'toggle-movilidad'; id: MobilityId }
	| { type: 'toggle-mascota'; id: PetId }
	| { type: 'select-prioridad'; id: CriterioId; prioridad: PrioridadId }
	| { type: 'add-criterio'; id: CriterioId }
	| { type: 'patch-lugar'; id: string; patch: Partial<Lugar> }
	| { type: 'remove-lugar'; id: string }
	| { type: 'add-lugar'; lugar: Omit<Lugar, 'id'> }
	| { type: 'set-alquiler-maximo'; alquilerMaximo: string }
	| { type: 'reset' }

function toggleId<T extends string>(items: T[], id: T): T[] {
	return items.includes(id) ? items.filter((item) => item !== id) : [...items, id]
}

function analysisReducer(state: DetailedAnalysisState, action: AnalysisAction): DetailedAnalysisState {
	switch (action.type) {
		case 'set-personas':
			return {
				...state,
				contexto: {
					...state.contexto,
					personas: action.personas,
					// Keep the age list aligned with the people count, reusing the previous values.
					edades: Array.from(
						{ length: action.personas },
						(_, index) => state.contexto.edades[index] ?? DEFAULT_AGE_RANGE,
					),
				},
			}

		case 'set-edad': {
			const edades = [...state.contexto.edades]
			edades[action.index] = action.edad

			return { ...state, contexto: { ...state.contexto, edades } }
		}

		case 'toggle-movilidad':
			return {
				...state,
				contexto: { ...state.contexto, movilidad: toggleId(state.contexto.movilidad, action.id) },
			}

		case 'toggle-mascota':
			return { ...state, contexto: { ...state.contexto, mascotas: toggleId(state.contexto.mascotas, action.id) } }

		case 'select-prioridad': {
			const criterios = { ...state.criterios }

			// Picking the active priority removes the criterion, same as clicking it again.
			if (criterios[action.id] === action.prioridad) {
				delete criterios[action.id]
			} else {
				criterios[action.id] = action.prioridad
			}

			return { ...state, criterios }
		}

		case 'add-criterio':
			return { ...state, criterios: { ...state.criterios, [action.id]: DEFAULT_PRIORITY } }

		case 'patch-lugar':
			return {
				...state,
				puntos: {
					...state.puntos,
					lugares: state.puntos.lugares.map((lugar) =>
						lugar.id === action.id ? { ...lugar, ...action.patch } : lugar,
					),
				},
			}

		case 'remove-lugar':
			return {
				...state,
				puntos: { ...state.puntos, lugares: state.puntos.lugares.filter((lugar) => lugar.id !== action.id) },
			}

		case 'add-lugar':
			return {
				...state,
				puntos: { ...state.puntos, lugares: [...state.puntos.lugares, { id: createId('lugar'), ...action.lugar }] },
			}

		case 'set-alquiler-maximo':
			return { ...state, puntos: { ...state.puntos, alquilerMaximo: action.alquilerMaximo } }

		case 'reset':
			return createInitialAnalysis()
	}
}

export function useDetailedAnalysisWizard() {
	const [state, dispatch] = useReducer(analysisReducer, undefined, createInitialAnalysis)

	return {
		state,
		actions: {
			setPersonas: (personas: number) => dispatch({ type: 'set-personas', personas }),
			setEdad: (index: number, edad: AgeRange) => dispatch({ type: 'set-edad', index, edad }),
			toggleMovilidad: (id: MobilityId) => dispatch({ type: 'toggle-movilidad', id }),
			toggleMascota: (id: PetId) => dispatch({ type: 'toggle-mascota', id }),
			selectPrioridad: (id: CriterioId, prioridad: PrioridadId) =>
				dispatch({ type: 'select-prioridad', id, prioridad }),
			addCriterio: (id: CriterioId) => dispatch({ type: 'add-criterio', id }),
			patchLugar: (id: string, patch: Partial<Lugar>) => dispatch({ type: 'patch-lugar', id, patch }),
			removeLugar: (id: string) => dispatch({ type: 'remove-lugar', id }),
			addLugar: (lugar: Omit<Lugar, 'id'>) => dispatch({ type: 'add-lugar', lugar }),
			setAlquilerMaximo: (alquilerMaximo: string) => dispatch({ type: 'set-alquiler-maximo', alquilerMaximo }),
			reset: () => dispatch({ type: 'reset' }),
		},
		steps: { total: ANALYSIS_STEPS.length },
	}
}

export type DetailedAnalysisWizard = ReturnType<typeof useDetailedAnalysisWizard>