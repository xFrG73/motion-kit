// packages/motion-kit/src/composables/useSparkline.test.ts
import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useSparkline } from './useSparkline'

describe('useSparkline', () => {
  it('generates an SVG path string from a data array', () => {
    const data = ref([1, 2, 3, 4])
    const { path } = useSparkline(data, { width: 100, height: 20 })
    // Should start with M (moveto) and contain L (lineto) commands
    expect(path.value).toMatch(/^M /)
    expect(path.value).toContain('L ')
  })

  it('maps min and max to the full vertical range', () => {
    const data = ref([0, 10])
    const { path } = useSparkline(data, { width: 100, height: 20 })
    // First point should be at y=height (min → bottom), last at y=0 (max → top)
    // Path format: "M 0 20 L 100 0"
    expect(path.value).toContain('0 20')
    expect(path.value).toContain('100 0')
  })

  it('handles single-point data without crashing', () => {
    const data = ref([5])
    const { path } = useSparkline(data, { width: 100, height: 20 })
    // Single point: no lineto, just moveto
    expect(path.value).toMatch(/^M /)
    expect(path.value).not.toContain('L ')
  })

  it('handles empty data gracefully', () => {
    const data = ref<number[]>([])
    const { path, pathLength } = useSparkline(data, { width: 100, height: 20 })
    expect(path.value).toBe('')
    expect(pathLength.value).toBe(0)
  })

  it('is reactive to data changes', () => {
    const data = ref([1, 2, 3])
    const { path } = useSparkline(data, { width: 100, height: 20 })
    const initial = path.value
    data.value = [5, 4, 3, 2, 1]
    expect(path.value).not.toBe(initial)
  })

  it('returns pathLength approximately proportional to width for flat data', () => {
    const data = ref([5, 5, 5, 5])
    const { pathLength } = useSparkline(data, { width: 100, height: 20 })
    // Flat line, all points at same y → length ≈ width
    expect(pathLength.value).toBeGreaterThan(90)
    expect(pathLength.value).toBeLessThan(110)
  })
})
