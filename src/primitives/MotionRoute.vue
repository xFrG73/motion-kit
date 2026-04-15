<!-- packages/motion-kit/src/primitives/MotionRoute.vue -->
<script setup lang="ts">
import { motion, AnimatePresence } from 'motion-v'
import { duration, easing, distance } from '../tokens'
import { useRoute } from 'vue-router'

// Small wrapper that applies a consistent enter/exit animation to the
// default slot (typically <NuxtPage />). Uses the current route's fullPath
// as the AnimatePresence key so page changes trigger the transition.
const route = useRoute()
</script>

<template>
  <AnimatePresence mode="wait">
    <motion.div
      :key="route.fullPath"
      :initial="{ opacity: 0, y: distance.short }"
      :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0 }"
      :transition="{
        duration: duration.base / 1000,
        ease: easing.out,
      }"
    >
      <slot />
    </motion.div>
  </AnimatePresence>
</template>
