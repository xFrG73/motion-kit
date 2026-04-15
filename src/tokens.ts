/**
 * Motion tokens — single source of truth for durations, easings, distances, and stagger.
 *
 * These values are mirrored in `css/motion.css` as CSS variables so CSS-only
 * consumers (Tailwind utilities, plain <style>) can reference them without
 * importing TS.
 *
 * See spec: docs/superpowers/specs/2026-04-15-motion-design-refresh-design.md
 */

export const duration = {
  instant: 75,
  fast: 150,
  base: 200,
  slow: 300,
  slower: 400,
} as const

export type DurationKey = keyof typeof duration

/**
 * Easing curves as 4-tuple bezier coefficients.
 * Format: [x1, y1, x2, y2] — directly consumable by motion-v's `ease` transition prop.
 * CSS-side consumers read the mirrored `--motion-easing-*` CSS variables in motion.css
 * which are pre-formatted as `cubic-bezier(...)` strings.
 */
export const easing = {
  out: [0.16, 1, 0.3, 1],
  in: [0.7, 0, 0.84, 0],
  inOut: [0.65, 0, 0.35, 1],
  spring: [0.34, 1.56, 0.64, 1],
} as const satisfies Record<string, readonly [number, number, number, number]>

export type EasingKey = keyof typeof easing

/**
 * Convenience: format an easing tuple as a CSS `cubic-bezier(...)` string.
 * Useful when passing an easing to a plain CSS `transition` property dynamically.
 */
export function easingToCss(easing: readonly [number, number, number, number]): string {
  return `cubic-bezier(${easing.join(', ')})`
}

export const distance = {
  none: 0,
  nudge: 2,
  short: 4,
  medium: 8,
} as const

export type DistanceKey = keyof typeof distance

export const stagger = {
  tight: 20,
  normal: 40,
  loose: 60,
  maxItems: 12,
} as const

export type StaggerKey = Exclude<keyof typeof stagger, 'maxItems'>

/**
 * Convenience helper: compute total stagger duration for N items.
 * Returns 0 if items exceed maxItems (stagger disabled in that case).
 */
export function staggerTotalMs(items: number, step: StaggerKey): number {
  if (items <= 0) return 0
  if (items > stagger.maxItems) return 0
  return (items - 1) * stagger[step]
}
