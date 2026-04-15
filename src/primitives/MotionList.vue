<!-- packages/motion-kit/src/primitives/MotionList.vue -->
<script setup lang="ts" generic="T">
import { computed, toRef } from 'vue'
import { AnimatePresence, motion } from 'motion-v'
import { useStagger } from '../composables/useStagger'
import { useReducedMotion } from '../composables/useReducedMotion'
import { duration, easing, distance, type StaggerKey } from '../tokens'

interface Props {
  items: readonly T[]
  /** Function returning a stable unique key per item. */
  keyBy: (item: T) => string | number
  /** Stagger intensity. Default: 'normal'. */
  stagger?: StaggerKey
  /** Enter distance ('none'|'nudge'|'short'|'medium'). Default: 'short'. */
  enterDistance?: keyof typeof distance
  /** Tag for the outer element. Default: 'div'. */
  tag?: string
}

const props = withDefaults(defineProps<Props>(), {
  stagger: 'normal',
  enterDistance: 'short',
  tag: 'div',
})

const { isReduced } = useReducedMotion()
const itemsRef = toRef(props, 'items')
const { delayFor } = useStagger(itemsRef, {
  step: props.stagger,
  forceDisable: isReduced.value,
})

const enterY = computed(() => (isReduced.value ? 0 : distance[props.enterDistance]))
</script>

<template>
  <component :is="props.tag">
    <AnimatePresence :initial="true">
      <motion.div
        v-for="(item, index) in props.items"
        :key="props.keyBy(item)"
        layout
        :initial="{ opacity: 0, y: enterY }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: enterY }"
        :transition="{
          duration: duration.slower / 1000,
          delay: delayFor(index) / 1000,
          ease: easing.out,
          layout: { duration: duration.base / 1000, ease: easing.spring },
        }"
      >
        <slot name="item" :item="item" :index="index" />
      </motion.div>
    </AnimatePresence>
  </component>
</template>
