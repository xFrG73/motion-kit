<!-- packages/motion-kit/src/primitives/MotionSkeleton.vue -->
<script setup lang="ts">
import { AnimatePresence, motion } from 'motion-v'
import { duration, easing } from '../tokens'

interface Props {
  loading: boolean
  /** Optional override of the cross-fade duration (ms). Default: duration.fast. */
  fadeMs?: number
}

const props = withDefaults(defineProps<Props>(), {
  fadeMs: duration.fast,
})
</script>

<template>
  <AnimatePresence mode="wait">
    <motion.div
      v-if="props.loading"
      key="skeleton"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="{ duration: props.fadeMs / 1000, ease: easing.out }"
    >
      <slot name="skeleton" />
    </motion.div>
    <motion.div
      v-else
      key="content"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :exit="{ opacity: 0 }"
      :transition="{ duration: props.fadeMs / 1000, ease: easing.out }"
    >
      <slot />
    </motion.div>
  </AnimatePresence>
</template>
