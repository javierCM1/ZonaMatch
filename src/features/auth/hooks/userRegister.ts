import { useMutation } from '@tanstack/react-query'
import { registerUser } from '../services/auth-api'

export function useUserRegister() {
  return useMutation({
    mutationFn: registerUser,
  })
}
