import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../../../core/auth/auth.store'
import { loginUser } from '../services/auth-api'

export function useUserLogin() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken)

  return useMutation({
    mutationFn: loginUser,
    onSuccess: ({ accessToken }) => {
      setAccessToken(accessToken)
    },
  })
}
