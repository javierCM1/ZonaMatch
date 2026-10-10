import { useEffect, useState } from 'react'

/** Devuelve `value` recién cuando deja de cambiar por `delayMs` (p. ej. para no buscar en cada tecla). */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delayMs)

    return () => window.clearTimeout(timeout)
  }, [value, delayMs])

  return debounced
}
