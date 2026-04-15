// packages/motion-kit/src/composables/useStagger.test.ts
import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useStagger } from './useStagger'

describe('useStagger', () => {
  it('returns delay = index * step for items under the cap', () => {
    const items = ref([1, 2, 3])
    const { delayFor } = useStagger(items, { step: 'normal' }) // normal = 40ms
    expect(delayFor(0)).toBe(0)
    expect(delayFor(1)).toBe(40)
    expect(delayFor(2)).toBe(80)
  })

  it('returns 0 for all items when list exceeds maxItems cap', () => {
    const items = ref(Array.from({ length: 20 }, (_, i) => i)) // 20 > 12
    const { delayFor } = useStagger(items, { step: 'tight' })
    expect(delayFor(0)).toBe(0)
    expect(delayFor(5)).toBe(0)
    expect(delayFor(19)).toBe(0)
  })

  it('uses tight step (20ms) when specified', () => {
    const items = ref([1, 2, 3])
    const { delayFor } = useStagger(items, { step: 'tight' })
    expect(delayFor(2)).toBe(40)
  })

  it('uses loose step (60ms) when specified', () => {
    const items = ref([1, 2, 3])
    const { delayFor } = useStagger(items, { step: 'loose' })
    expect(delayFor(2)).toBe(120)
  })

  it('is reactive to items length changes', () => {
    const items = ref([1, 2, 3])
    const { delayFor, isStaggered } = useStagger(items, { step: 'normal' })
    expect(isStaggered.value).toBe(true)
    // Grow past cap
    items.value = Array.from({ length: 15 }, (_, i) => i)
    expect(isStaggered.value).toBe(false)
    expect(delayFor(5)).toBe(0)
  })

  it('respects forceDisable option (reduced-motion)', () => {
    const items = ref([1, 2, 3])
    const { delayFor, isStaggered } = useStagger(items, { step: 'normal', forceDisable: true })
    expect(isStaggered.value).toBe(false)
    expect(delayFor(0)).toBe(0)
    expect(delayFor(2)).toBe(0)
  })
})
