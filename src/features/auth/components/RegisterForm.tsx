import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { loadingService } from '../../../core/loading'
import { Button } from '../../../shared/components/button'
import { Checkbox } from '../../../shared/components/checkbox'
import { InputText } from '../../../shared/components/input-text'
import { useUserRegister } from '../hooks/userRegister'
import { registerSchema } from '../schemas/register.schema'
import type { RegisterFormValues } from '../schemas/register.schema'
import { getRegisterErrorMessage } from '../services/auth-api'

const INPUT_CLASS_NAME = '!rounded-lg !border-[#dce4dd] !py-2.5'

function toggleIcon(visible: boolean) {
  return visible ? 'pi pi-eye-slash' : 'pi pi-eye'
}

export function RegisterForm() {
  const navigate = useNavigate()
  const registerMutation = useUserRegister()
  const [passwordVisible, setPasswordVisible] = useState(false)
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: { terms: false },
  })

  async function submit({ terms: _terms, ...payload }: RegisterFormValues) {
    try {
      await loadingService.track(registerMutation.mutateAsync(payload), 'Creando tu cuenta...')
      navigate('/login')
    } catch {
      // The error is exposed through registerMutation.error and rendered below.
    }
  }

  const passwordToggle = (
    <Button
      aria-label={passwordVisible ? 'Ocultar contraseñas' : 'Mostrar contraseñas'}
      className="!h-8 !w-8 !p-0 !text-[#68756d]"
      icon={toggleIcon(passwordVisible)}
      onClick={() => setPasswordVisible((visible) => !visible)}
      type="button"
      variant="text"
    />
  )

  return (
    <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit(submit)}>
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#26372d]" htmlFor="email">
          Correo electrónico
        </label>
        <InputText
          autoComplete="email"
          className={INPUT_CLASS_NAME}
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

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#26372d]" htmlFor="fechaNacimiento">
          Fecha de nacimiento
        </label>
        <InputText
          autoComplete="bday"
          className={INPUT_CLASS_NAME}
          fullWidth
          id="fechaNacimiento"
          invalid={Boolean(errors.fechaNacimiento)}
          leftIcon={<i aria-hidden="true" className="pi pi-calendar" />}
          type="date"
          {...register('fechaNacimiento')}
        />
        {errors.fechaNacimiento && <p className="text-xs text-red-600">{errors.fechaNacimiento.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#26372d]" htmlFor="password">
          Contraseña
        </label>
        <InputText
          autoComplete="new-password"
          className={INPUT_CLASS_NAME}
          fullWidth
          id="password"
          invalid={Boolean(errors.password)}
          leftIcon={<i aria-hidden="true" className="pi pi-lock" />}
          placeholder="Al menos 8 caracteres"
          rightIcon={passwordToggle}
          type={passwordVisible ? 'text' : 'password'}
          {...register('password')}
        />
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-[#26372d]" htmlFor="confirmarPassword">
          Repetir contraseña
        </label>
        <InputText
          autoComplete="new-password"
          className={INPUT_CLASS_NAME}
          fullWidth
          id="confirmarPassword"
          invalid={Boolean(errors.confirmarPassword)}
          leftIcon={<i aria-hidden="true" className="pi pi-lock" />}
          placeholder="Repetí tu contraseña"
          type={passwordVisible ? 'text' : 'password'}
          {...register('confirmarPassword')}
        />
        {errors.confirmarPassword && <p className="text-xs text-red-600">{errors.confirmarPassword.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Controller
          control={control}
          name="terms"
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              inputId="terms"
              invalid={Boolean(errors.terms)}
              label={
                <span className="text-xs leading-4">
                  Acepto los{' '}
                  <Link className="font-medium text-[#47742e] underline underline-offset-2" to="/terminos">
                    términos y condiciones
                  </Link>{' '}
                  y la{' '}
                  <Link className="font-medium text-[#47742e] underline underline-offset-2" to="/privacidad">
                    política de privacidad
                  </Link>
                  .
                </span>
              }
              name={field.name}
              onChange={(event) => field.onChange(event.checked ?? false)}
            />
          )}
        />
        {errors.terms && <p className="text-xs text-red-600">{errors.terms.message}</p>}
      </div>

      {registerMutation.isError && (
        <p aria-live="polite" className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {getRegisterErrorMessage(registerMutation.error)}
        </p>
      )}

      <Button
        className="!h-10 !rounded-full !border-[#b7e24d] !bg-[#b7e24d] !font-semibold !text-[#20321f] hover:!border-[#a9d63e] hover:!bg-[#a9d63e]"
        disabled={registerMutation.isPending}
        fullWidth
        label={registerMutation.isPending ? 'Creando cuenta...' : 'Crear cuenta'}
        type="submit"
      />
    </form>
  )
}
