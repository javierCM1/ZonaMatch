import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 10_000,
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
)
