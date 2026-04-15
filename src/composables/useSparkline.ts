// packages/motion-kit/src/composables/useSparkline.ts
import { computed, type Ref, type ComputedRef } from 'vue'

interface UseSparklineOptions {
  width: number
  height: number
  /** Optional padding from top/bottom edges (px). Default: 0. */
  padY?: number
}

interface UseSparklineReturn {
  path: ComputedRef<string>
  pathLength: ComputedRef<number>
  points: ComputedRef<Array<{ x: number; y: number }>>
}

export function useSparkline(
  data: Ref<readonly number[]>,
  options: UseSparklineOptions
): UseSparklineReturn {
  const { width, height, padY = 0 } = options

  const points = computed<Array<{ x: number; y: number }>>(() => {
    const values = data.value
    if (values.length === 0) return []
    if (values.length === 1) {
      return [{ x: 0, y: height / 2 }]
    }
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1 // avoid div by zero
    const usableHeight = height - padY * 2
    return values.map((v, i) => {
      const x = (i / (values.length - 1)) * width
      const normalized = (v - min) / range
      // Invert Y: max value → top (y=padY), min value → bottom (y=height-padY)
      const y = padY + (1 - normalized) * usableHeight
      return { x, y }
    })
  })

  const path = computed<string>(() => {
    const pts = points.value
    if (pts.length === 0) return ''
    if (pts.length === 1) {
      return `M ${pts[0]!.x} ${pts[0]!.y}`
    }
    const [first, ...rest] = pts
    const moveTo = `M ${first!.x} ${first!.y}`
    const lineTos = rest.map(p => `L ${p.x} ${p.y}`).join(' ')
    return `${moveTo} ${lineTos}`
  })

  const pathLength = computed<number>(() => {
    const pts = points.value
    if (pts.length < 2) return 0
    let length = 0
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i]!.x - pts[i - 1]!.x
      const dy = pts[i]!.y - pts[i - 1]!.y
      length += Math.sqrt(dx * dx + dy * dy)
    }
    return length
  })

  return { path, pathLength, points }
}
