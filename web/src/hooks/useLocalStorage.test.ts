import { describe, it, expect, beforeEach } from 'vitest'
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
})
