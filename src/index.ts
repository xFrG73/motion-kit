// packages/motion-kit/src/index.ts
// Public surface of @sudothink/motion-kit.

// Tokens
export {
  duration,
  easing,
  distance,
  stagger,
  staggerTotalMs,
  type DurationKey,
  type EasingKey,
  type DistanceKey,
  type StaggerKey,
} from './tokens'

// Composables
export { useReducedMotion } from './composables/useReducedMotion'
export { useCountUp } from './composables/useCountUp'
export { useStagger } from './composables/useStagger'
export { useSparkline } from './composables/useSparkline'

// Primitives are NOT re-exported here — they are auto-imported by Nuxt's
// components.dirs mechanism in each consumer project, pointing directly
// at packages/motion-kit/src/primitives/.
