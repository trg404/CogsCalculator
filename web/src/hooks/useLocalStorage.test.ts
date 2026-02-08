import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('default')
  })

  it('persists value to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    act(() => {
      result.current[1]('new value')
    })

    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new value'))
  })

  it('reads existing value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored value'))

    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))
    expect(result.current[0]).toBe('stored value')
  })

  it('handles objects', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', { name: 'default' })
    )

    act(() => {
      result.current[1]({ name: 'updated' })
    })

    expect(result.current[0]).toEqual({ name: 'updated' })
  })

  it('applies migrate function to stored data', () => {
    // Store "legacy" data
    localStorage.setItem('test-key', JSON.stringify({ oldField: 42 }))

    // Migrate transforms the stored shape
    const migrate = (stored: unknown) => {
      const legacy = stored as { oldField: number }
      return { newField: legacy.oldField * 2 }
    }

    const { result } = renderHook(() =>
      useLocalStorage('test-key', { newField: 0 }, migrate)
    )

    expect(result.current[0]).toEqual({ newField: 84 })
  })

  it('falls back to initial value when JSON is corrupted', () => {
    // Store invalid JSON
    localStorage.setItem('test-key', '{not valid json!!!')

    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'))
    expect(result.current[0]).toBe('fallback')
  })

  it('silently handles localStorage setItem failure', () => {
    // Simulate a quota exceeded error on setItem
    const originalSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = vi.fn(() => {
      throw new DOMException('QuotaExceededError')
    })

    // Should not throw — the hook catches the error silently
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'))

    act(() => {
      result.current[1]('new value')
    })

    // State still updates in memory even if storage fails
    expect(result.current[0]).toBe('new value')

    Storage.prototype.setItem = originalSetItem
  })
})
