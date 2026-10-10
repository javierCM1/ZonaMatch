import axios from 'axios'
import { apiClient } from '../../../core/api/api.client'
import type { LoginFormValues } from '../schemas/login.schema'
import type { RegisterPayload } from '../schemas/register.schema'

export interface LoginResponse {
  accessToken: string
}

export async function loginUser(credentials: LoginFormValues): Promise<LoginResponse> {
  const { data } = await apiClient.post<LoginResponse>('/Auth/login', credentials)

  if (!data.accessToken) {
    throw new Error('La respuesta del servidor no incluyó un token de acceso.')
  }

  return data
}

export async function registerUser(payload: RegisterPayload): Promise<void> {
  await apiClient.post('/Auth/registro', payload)
}

interface ApiErrorBody {
  message?: unknown
  detail?: unknown
  errors?: Record<string, unknown>
}

function firstNonEmptyString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value : undefined
}

function getValidationMessage(errors: ApiErrorBody['errors']): string | undefined {
  if (!errors) {
    return undefined
  }

  for (const fieldErrors of Object.values(errors)) {
    const message = Array.isArray(fieldErrors) ? firstNonEmptyString(fieldErrors[0]) : firstNonEmptyString(fieldErrors)

    if (message) {
      return message
    }
  }

  return undefined
}

export function getRegisterErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    if (!error.response) {
      return 'No se pudo conectar con el servidor. Revisá tu conexión e intentá nuevamente.'
    }

    const body = error.response.data
    const message =
      getValidationMessage(body?.errors) ?? firstNonEmptyString(body?.message) ?? firstNonEmptyString(body?.detail)

    if (message) {
      return message
    }

    if (error.response.status === 409) {
      return 'Ya existe una cuenta registrada con ese correo electrónico.'
    }

    return 'No se pudo crear la cuenta. Intentá nuevamente.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Ocurrió un error inesperado al crear la cuenta.'
}

export function getLoginErrorMessage(error: unknown): string {
  if (axios.isAxiosError<{ message?: unknown }>(error)) {
    const responseMessage = error.response?.data?.message

    if (typeof responseMessage === 'string' && responseMessage.trim()) {
      return responseMessage
    }

    if (error.response?.status === 401 || error.response?.status === 403) {
      return 'El correo o la contraseña no son correctos.'
    }

    if (!error.response) {
      return 'No se pudo conectar con el servidor. Revisá tu conexión e intentá nuevamente.'
    }

    return 'No se pudo iniciar sesión. Intentá nuevamente.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Ocurrió un error inesperado al iniciar sesión.'
}
