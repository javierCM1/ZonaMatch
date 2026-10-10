import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Ingresá un correo electrónico válido.'),
  password: z.string().min(1, 'Ingresá tu contraseña.'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
