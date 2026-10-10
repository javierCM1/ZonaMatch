import { z } from 'zod'

const EMAIL_MAX_LENGTH = 254
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_MAX_LENGTH = 128
const MAX_AGE_YEARS = 120

function isValidBirthDate(value: string): boolean {
  const birthDate = new Date(`${value}T00:00:00`)

  if (Number.isNaN(birthDate.getTime())) {
    return false
  }

  const today = new Date()
  const oldestAllowed = new Date(today.getFullYear() - MAX_AGE_YEARS, today.getMonth(), today.getDate())

  return birthDate <= today && birthDate >= oldestAllowed
}

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'El correo electrónico es obligatorio.')
      .max(EMAIL_MAX_LENGTH, `El correo no puede superar los ${EMAIL_MAX_LENGTH} caracteres.`)
      .pipe(z.email('Ingresá un correo electrónico válido.')),
    password: z
      .string()
      .min(1, 'La contraseña es obligatoria.')
      .min(PASSWORD_MIN_LENGTH, `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`)
      .max(PASSWORD_MAX_LENGTH, `La contraseña no puede superar los ${PASSWORD_MAX_LENGTH} caracteres.`),
    confirmarPassword: z.string().min(1, 'Repetí tu contraseña.'),
    fechaNacimiento: z
      .string()
      .min(1, 'La fecha de nacimiento es obligatoria.')
      .refine(isValidBirthDate, 'La fecha de nacimiento no es válida.'),
    terms: z.boolean().refine((accepted) => accepted, 'Debés aceptar los términos y la política de privacidad.'),
  })
  .refine((values) => values.password === values.confirmarPassword, {
    message: 'Las contraseñas no coinciden.',
    path: ['confirmarPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>

/** Payload expected by POST /Auth/registro (RegistroUsuarioDto). */
export type RegisterPayload = Omit<RegisterFormValues, 'terms'>
