export type AgeRange =
	| '18–25 años'
	| '26–35 años'
	| '36–45 años'
	| '46–60 años'
	| 'Más de 60 años'

export type MobilityId = 'a-pie' | 'transporte-publico' | 'vehiculo' | 'bici'

export type PetId = 'perro' | 'gato' | 'otras' | 'ninguna'

export type CriterioId = 'seguridad' | 'movilidad' | 'espacios-verdes' | 'educacion' | 'salud'

export type PrioridadId = 'baja' | 'media' | 'alta'

export type LugarTipo = 'Trabajo' | 'Estudio' | 'Colegio' | 'Salud' | 'Familiar' | 'Otro'

export type QuienVa = 'Yo' | 'Nosotros' | 'Hijo/a' | 'Otro'

export type Frecuencia =
	| '5x por semana'
	| '3x por semana'
	| '2x por semana'
	| '1x por semana'
	| 'Ocasional'

export type LugarPrioridad = 'Muy importante' | 'Alta' | 'Media' | 'Baja'

export type TiempoViaje = '15 min' | '20 min' | '30 min' | '45 min' | '60 min' | '90 min'

export interface ContextoState {
	personas: number
	edades: AgeRange[]
	movilidad: MobilityId[]
	mascotas: PetId[]
}

export type CriteriosState = Partial<Record<CriterioId, PrioridadId>>

export interface Lugar {
	id: string
	nombre: string
	tipo: LugarTipo
	direccion: string
	quienVa: QuienVa
	frecuencia: Frecuencia
	prioridad: LugarPrioridad
	tiempoMax: TiempoViaje
}

export interface LugarDefaults {
	quienVa: QuienVa
	frecuencia: Frecuencia
	prioridad: LugarPrioridad
	tiempoMax: TiempoViaje
}

export interface PuntosState {
	lugares: Lugar[]
	alquilerMaximo: string
}

export interface DetailedAnalysisState {
	contexto: ContextoState
	criterios: CriteriosState
	puntos: PuntosState
}

export interface CriterioOption {
	id: CriterioId
	nombre: string
	descripcion: string
	icon: string
}

export interface MobilityOption {
	id: MobilityId
	label: string
}

export interface PetOption {
	id: PetId
	label: string
	emoji: string
}