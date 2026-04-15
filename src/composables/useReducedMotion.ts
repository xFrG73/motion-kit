// packages/motion-kit/src/composables/useReducedMotion.ts
import { ref, onMounted, onUnmounted, readonly, type Ref } from 'vue'

interface UseReducedMotionReturn {
  isReduced: Readonly<Ref<boolean>>
  setUserPreference: (value: boolean) => void
}

const USER_ATTR = 'data-reduced-motion'
const MEDIA_QUERY = '(prefers-reduced-motion: reduce)'

function currentUserPreference(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.getAttribute(USER_ATTR) === 'true'
}

function currentOsPreference(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false
  return window.matchMedia(MEDIA_QUERY).matches
}

export function useReducedMotion(): UseReducedMotionReturn {
  const isReduced = ref(currentOsPreference() || currentUserPreference())

  let mql: MediaQueryList | null = null
  const onMqChange = (event: MediaQueryListEvent) => {
    isReduced.value = event.matches || currentUserPreference()
  }

  const attachMqListener = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    mql = window.matchMedia(MEDIA_QUERY)
    mql.addEventListener('change', onMqChange)
    // Initial sync in case state drifted
    isReduced.value = mql.matches || currentUserPreference()
  }

  // Attach immediately for tests; onMounted is a no-op outside a component.
  attachMqListener()

  onMounted(() => {
    // Already attached above — idempotent guard
    if (!mql) attachMqListener()
  })

  onUnmounted(() => {
    if (mql) {
      mql.removeEventListener('change', onMqChange)
      mql = null
    }
  })

  function setUserPreference(value: boolean): void {
    if (typeof document === 'undefined') return
    if (value) {
      document.documentElement.setAttribute(USER_ATTR, 'true')
    } else {
      document.documentElement.removeAttribute(USER_ATTR)
    }
    // Reflect in reactive state
    isReduced.value = value || currentOsPreference()
  }

  return {
    isReduced: readonly(isReduced),
    setUserPreference,
  }
}
