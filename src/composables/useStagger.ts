// packages/motion-kit/src/composables/useStagger.ts
import { computed, type Ref, type ComputedRef } from 'vue'
import { stagger as tokens, type StaggerKey } from '../tokens'

interface UseStaggerOptions {
  step: StaggerKey
  /** Force stagger off (used for reduced-motion fallback). */
  forceDisable?: boolean
}

interface UseStaggerReturn {
  delayFor: (index: number) => number
  isStaggered: ComputedRef<boolean>
  stepMs: number
}

export function useStagger<T>(
  items: Ref<readonly T[]>,
  options: UseStaggerOptions
): UseStaggerReturn {
  const { step, forceDisable = false } = options

  const stepMs = tokens[step]

  const isStaggered = computed(() => {
    if (forceDisable) return false
    return items.value.length > 0 && items.value.length <= tokens.maxItems
  })

  function delayFor(index: number): number {
    if (!isStaggered.value) return 0
    if (index < 0) return 0
    return index * stepMs
  }

  return { delayFor, isStaggered, stepMs }
}
