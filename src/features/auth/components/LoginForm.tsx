import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import type { Location } from 'react-router-dom'
import { Button } from '../../../shared/components/button'
import { InputText } from '../../../shared/components/input-text'
import { getLoginErrorMessage } from '../services/auth-api'
import { loginSchema } from '../schemas/login.schema'
import type { LoginFormValues } from '../schemas/login.schema'
import { useUserLogin } from '../hooks/userLogin'

// Solo rutas de la app ("/zonas/villa-luro"), nunca otro sitio ("//evil.com", "/\evil.com")
const isInternalPath = (path: string | null): path is string =>
  path !== null && /^\/(?![/\\])/.test(path)

export function LoginForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  // A dónde volver después de iniciar sesión: la ruta de ?volver= (acciones que piden cuenta, como
  // escribir una reseña), la ruta protegida desde la que se llegó (state.from) o, si no hay ninguna,
  // /analisis-detallado (solo con sesión)
  const returnTo = searchParams.get('volver')
  const from = (location.state as { from?: Location } | null)?.from
  const redirectTo = isInternalPath(returnTo) ? returnTo : from ? `${from.pathname}${from.search}` : '/analisis-detallado'
  const login = useUserLogin()
  const [passwordVisible, setPasswordVisible] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  function submit(values: LoginFormValues) {
    login.mutate(values, {
      onSuccess: () => navigate(redirectTo, { replace: true }),
    })
  }

  return (
    <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit(submit)}>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#26372d]" htmlFor="email">
          Correo electrónico
        </label>
        <InputText
          autoComplete="email"
          className="!rounded-lg !border-[#dce4dd] !py-3"
          fullWidth
          id="email"
          invalid={Boolean(errors.email)}
          leftIcon={<i aria-hidden="true" className="pi pi-envelope" />}
          placeholder="nombre@correo.com"
          type="email"
          {...register('email')}
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#26372d]" htmlFor="password">
          Contraseña
        </label>
        <InputText
          autoComplete="current-password"
          className="!rounded-lg !border-[#dce4dd] !py-3"
          fullWidth
          id="password"
          invalid={Boolean(errors.password)}
          leftIcon={<i aria-hidden="true" className="pi pi-lock" />}
          placeholder="Ingresá tu contraseña"
          rightIcon={
            <Button
              aria-label={passwordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              className="!h-8 !w-8 !p-0 !text-[#68756d]"
              icon={passwordVisible ? 'pi pi-eye-slash' : 'pi pi-eye'}
              onClick={() => setPasswordVisible((visible) => !visible)}
              type="button"
              variant="text"
            />
          }
          type={passwordVisible ? 'text' : 'password'}
          {...register('password')}
        />
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>

      {login.isError && (
        <p aria-live="polite" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {getLoginErrorMessage(login.error)}
        </p>
      )}

      <Button
        className="!h-12 !rounded-full !border-[#b7e24d] !bg-[#b7e24d] !font-semibold !text-[#20321f] hover:!border-[#a9d63e] hover:!bg-[#a9d63e]"
        disabled={login.isPending}
        fullWidth
        label={login.isPending ? 'Ingresando...' : 'Iniciar sesión'}
        type="submit"
      />
    </form>
  )
}
