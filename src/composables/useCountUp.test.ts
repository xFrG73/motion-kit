// packages/motion-kit/src/composables/useCountUp.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { ref, nextTick } from 'vue'
import { useCountUp } from './useCountUp'

describe('useCountUp', () => {
  beforeEach(() => {
    // Vitest 2.x fakes requestAnimationFrame/cancelAnimationFrame and performance.now()
    // when you opt them in explicitly via toFake.
    vi.useFakeTimers({
      toFake: [
        'setTimeout',
        'clearTimeout',
        'requestAnimationFrame',
        'cancelAnimationFrame',
        'performance',
      ],
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts at the initial value', () => {
    const source = ref(0)
    const { display } = useCountUp(source)
    expect(display.value).toBe(0)
  })

  it('animates from old to new value over the given duration', async () => {
    const source = ref(0)
    const { display } = useCountUp(source, { duration: 200 })
    source.value = 100
    await nextTick()
    // Advance halfway
    vi.advanceTimersByTime(100)
    expect(display.value).toBeGreaterThan(0)
    expect(display.value).toBeLessThan(100)
    // Advance to end
    vi.advanceTimersByTime(200)
    expect(display.value).toBe(100)
  })

  it('snaps to target when duration is 0 (reduced-motion fallback)', async () => {
    const source = ref(10)
    const { display } = useCountUp(source, { duration: 0 })
    source.value = 42
    await nextTick()
    vi.advanceTimersByTime(0)
    expect(display.value).toBe(42)
  })

  it('handles decreasing values', async () => {
    const source = ref(100)
    const { display } = useCountUp(source, { duration: 100 })
    source.value = 0
    await nextTick()
    vi.advanceTimersByTime(100)
    expect(display.value).toBe(0)
  })

  it('cancels a running animation when value changes mid-flight', async () => {
    const source = ref(0)
    const { display } = useCountUp(source, { duration: 200 })
    source.value = 100
    await nextTick()
    vi.advanceTimersByTime(50)
    // Jump to new target mid-animation
    source.value = 50
    await nextTick()
    vi.advanceTimersByTime(200)
    expect(display.value).toBe(50)
  })

  it('respects integer option by rounding display', async () => {
    const source = ref(0)
    const { display } = useCountUp(source, { duration: 200, integer: true })
    source.value = 10
    await nextTick()
    vi.advanceTimersByTime(100)
    expect(Number.isInteger(display.value)).toBe(true)
  })
})
