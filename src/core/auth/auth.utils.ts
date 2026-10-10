interface JwtPayload {
  exp?: number
  [claim: string]: unknown
}

// Claims that may carry the user name, depending on how the backend issues the JWT (ASP.NET Identity included).
const NAME_CLAIMS = [
  'name',
  'unique_name',
  'given_name',
  'preferred_username',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
  'email',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
] as const

const MAX_INITIALS = 2

const MILLISECONDS_PER_SECOND = 1000

function decodeJwtPayload(token: string): JwtPayload | null {
  const [, payload] = token.split('.')

  if (!payload) {
    return null
  }

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64)) as JwtPayload
  } catch {
    return null
  }
}

/** Display name taken from the JWT claims (name first, email as fallback). */
export function getUserNameFromToken(token: string | null): string | null {
  if (!token) {
    return null
  }

  const payload = decodeJwtPayload(token)

  if (!payload) {
    return null
  }

  for (const claim of NAME_CLAIMS) {
    const value = payload[claim]

    if (typeof value === 'string' && value.trim()) {
      return value.trim()
    }
  }

  return null
}

/** "María Pérez" -> "MP"; "maria.perez@mail.com" -> "MA". */
export function getInitials(name: string): string {
  const base = name.includes('@') ? name.split('@')[0] : name
  const words = base.split(/[\s._-]+/).filter(Boolean)

  if (words.length >= MAX_INITIALS) {
    return words
      .slice(0, MAX_INITIALS)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
  }

  return (words[0] ?? '').slice(0, MAX_INITIALS).toUpperCase()
}

/** Client-side check only (UX); the backend remains the source of truth for validity. */
export function isTokenValid(token: string | null): token is string {
  if (!token) {
    return false
  }

  const payload = decodeJwtPayload(token)

  if (!payload) {
    return false
  }

  return payload.exp === undefined || payload.exp * MILLISECONDS_PER_SECOND > Date.now()
}
