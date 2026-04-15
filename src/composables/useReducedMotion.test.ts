// packages/motion-kit/src/composables/useReducedMotion.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useReducedMotion } from './useReducedMotion'

describe('useReducedMotion', () => {
  let mediaQueryList: { matches: boolean; addEventListener: any; removeEventListener: any }
  let listeners: Array<(e: { matches: boolean }) => void>

  beforeEach(() => {
    listeners = []
    mediaQueryList = {
      matches: false,
      addEventListener: vi.fn((_event: string, cb: (e: { matches: boolean }) => void) => {
        listeners.push(cb)
      }),
      removeEventListener: vi.fn((_event: string, cb: (e: { matches: boolean }) => void) => {
        listeners = listeners.filter(l => l !== cb)
      }),
    }
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQueryList))
    // Ensure no stale html attribute
    document.documentElement.removeAttribute('data-reduced-motion')
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns false when OS preference is normal and in-app toggle is off', () => {
    mediaQueryList.matches = false
    const { isReduced } = useReducedMotion()
    expect(isReduced.value).toBe(false)
  })

  it('returns true when OS preference requests reduced motion', () => {
    mediaQueryList.matches = true
    const { isReduced } = useReducedMotion()
    expect(isReduced.value).toBe(true)
  })

  it('returns true when in-app toggle is set regardless of OS', () => {
    mediaQueryList.matches = false
    document.documentElement.setAttribute('data-reduced-motion', 'true')
    const { isReduced } = useReducedMotion()
    expect(isReduced.value).toBe(true)
  })

  it('updates reactively when OS preference changes', async () => {
    mediaQueryList.matches = false
    const { isReduced } = useReducedMotion()
    expect(isReduced.value).toBe(false)
    // Simulate OS change
    mediaQueryList.matches = true
    listeners.forEach(cb => cb({ matches: true }))
    expect(isReduced.value).toBe(true)
  })

  it('setUserPreference(true) sets data-reduced-motion on <html>', () => {
    const { setUserPreference, isReduced } = useReducedMotion()
    setUserPreference(true)
    expect(document.documentElement.getAttribute('data-reduced-motion')).toBe('true')
    expect(isReduced.value).toBe(true)
  })

  it('setUserPreference(false) removes the attribute', () => {
    document.documentElement.setAttribute('data-reduced-motion', 'true')
    const { setUserPreference, isReduced } = useReducedMotion()
    setUserPreference(false)
    expect(document.documentElement.hasAttribute('data-reduced-motion')).toBe(false)
    expect(isReduced.value).toBe(false)
  })
})
