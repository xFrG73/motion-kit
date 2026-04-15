// packages/motion-kit/src/composables/useCountUp.ts
import { ref, watch, onUnmounted, type Ref } from 'vue'
import { duration as tokens } from '../tokens'

interface UseCountUpOptions {
  /** Duration in ms. Pass 0 to snap instantly (reduced-motion fallback). */
  duration?: number
  /** Round display to nearest integer. Default: false (display = exact float). */
  integer?: boolean
}

interface UseCountUpReturn {
  display: Readonly<Ref<number>>
}

// Easing: same curve as tokens.easing.out for consistency
function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

export function useCountUp(
  source: Ref<number>,
  options: UseCountUpOptions = {}
): UseCountUpReturn {
  const {
    duration: animDuration = tokens.base,
    integer = false,
  } = options

  const display = ref(source.value)
  let rafId: number | null = null
  let snapId: ReturnType<typeof setTimeout> | null = null
  let startTime: number | null = null
  let startValue = source.value

  const cancel = () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    if (snapId !== null) {
      clearTimeout(snapId)
      snapId = null
    }
    startTime = null
  }

  const snap = (target: number) => {
    display.value = integer ? Math.round(target) : target
    cancel()
  }

  const tick = (target: number) => {
    if (startTime === null) {
      startTime = performance.now()
      startValue = display.value
    }
    const elapsed = performance.now() - startTime
    const progress = Math.min(elapsed / animDuration, 1)
    const eased = easeOutExpo(progress)
    const next = startValue + (target - startValue) * eased
    display.value = integer ? Math.round(next) : next
    if (progress < 1) {
      rafId = requestAnimationFrame(() => tick(target))
    } else {
      snap(target)
    }
  }

  watch(source, (newVal) => {
    cancel()
    if (animDuration <= 0) {
      display.value = integer ? Math.round(newVal) : newVal
      return
    }
    // setTimeout guarantees the final snap fires at exactly animDuration ms,
    // even if requestAnimationFrame frames don't land precisely on the boundary.
    snapId = setTimeout(() => snap(newVal), animDuration)
    rafId = requestAnimationFrame(() => tick(newVal))
  })

  onUnmounted(() => cancel())

  return { display: display as Readonly<Ref<number>> }
}
