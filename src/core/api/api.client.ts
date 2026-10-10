import axios from 'axios'
import { useAuthStore } from '../auth/auth.store'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 10_000,
})

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken

  if (accessToken) {
    config.headers.setAuthorization(`Bearer ${accessToken}`)
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { accessToken, logout } = useAuthStore.getState()

    // An expired/invalid token: clearing the session makes ProtectedRoute redirect to /login.
    if (axios.isAxiosError(error) && error.response?.status === 401 && accessToken) {
      logout()
    }

    return Promise.reject(error)
  },
)
