<!-- packages/motion-kit/src/primitives/MotionSparkline.vue -->
<script setup lang="ts">
import { toRef, onMounted, ref } from 'vue'
import { motion } from 'motion-v'
import { useSparkline } from '../composables/useSparkline'
import { duration, easing } from '../tokens'

interface Props {
  data: readonly number[]
  width?: number
  height?: number
  padY?: number
  /** Stroke color (CSS color string). Default: currentColor. */
  color?: string
  /** Stroke width (px). Default 1.5. */
  strokeWidth?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: 120,
  height: 32,
  padY: 2,
  color: 'currentColor',
  strokeWidth: 1.5,
})

const dataRef = toRef(props, 'data')
const { path } = useSparkline(dataRef, {
  width: props.width,
  height: props.height,
  padY: props.padY,
})

// Draw-in on mount, then morph on updates
const isMounted = ref(false)
onMounted(() => {
  // Next frame to let the SVG render the initial path
  requestAnimationFrame(() => {
    isMounted.value = true
  })
})
</script>

<template>
  <svg
    :width="props.width"
    :height="props.height"
    :viewBox="`0 0 ${props.width} ${props.height}`"
    fill="none"
  >
    <motion.path
      :d="path"
      :stroke="props.color"
      :stroke-width="props.strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      :initial="{ pathLength: 0, opacity: 0 }"
      :animate="{ pathLength: isMounted ? 1 : 0, opacity: isMounted ? 1 : 0 }"
      :transition="{
        pathLength: { duration: duration.slower / 1000, ease: easing.out },
        opacity: { duration: duration.fast / 1000 },
      }"
    />
  </svg>
</template>
