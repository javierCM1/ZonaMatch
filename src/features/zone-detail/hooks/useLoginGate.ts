import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../core/auth/auth.store'

/**
 * Para las acciones que necesitan una cuenta (escribir reseñas, preguntar, aportar): indica si hay
 * sesión y lleva al login con la vuelta a la pantalla actual (`/login?volver=...`).
 */
export function useLoginGate() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
	const navigate = useNavigate()
	const location = useLocation()

	const goToLogin = () => navigate(`/login?volver=${encodeURIComponent(location.pathname + location.search)}`)

	return { isAuthenticated, goToLogin }
}
