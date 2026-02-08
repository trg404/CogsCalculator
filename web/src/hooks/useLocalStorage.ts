/**
 * useLocalStorage — a React hook that syncs state to localStorage so values
 * persist across browser sessions.
 *
 * Works like useState but reads/writes to a localStorage key. On first render
 * it loads the saved value (if any), and on every state change it writes
 * the new value back to localStorage.
 *
 * @param key           The localStorage key to read/write (e.g. 'pottery-settings')
 * @param initialValue  Default value used when nothing is stored yet
 * @param migrate       Optional function to transform legacy stored data into the
 *                      current format. Called on the parsed JSON before returning it.
 *                      This is how we handle schema changes without losing user data
 *                      (see migrateSettings in App.tsx for an example).
 */
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  migrate?: (stored: unknown) => T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        const parsed = JSON.parse(item)
        return migrate ? migrate(parsed) : parsed
      }
      return initialValue
    } catch {
      // If JSON is corrupted or localStorage throws, fall back to defaults
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch {
      // Silently ignore quota or access errors — the app still works,
      // the user just loses persistence until space is freed
    }
  }, [key, storedValue])

  return [storedValue, setStoredValue]
}
