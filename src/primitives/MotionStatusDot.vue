<!-- packages/motion-kit/src/primitives/MotionStatusDot.vue -->
<script setup lang="ts">
import { computed } from 'vue'

type Status = 'online' | 'offline' | 'error' | 'pending'

interface Props {
  status: Status
  /** Size in px. Default 8. */
  size?: number
}

const props = withDefaults(defineProps<Props>(), { size: 8 })

const colorClass = computed(() => {
  switch (props.status) {
    case 'online':  return 'bg-success dot-online'
    case 'offline': return 'bg-muted-foreground/30 dot-offline'
    case 'error':   return 'bg-destructive dot-error'
    case 'pending': return 'bg-primary dot-pending'
  }
})

const animationClass = computed(() => {
  switch (props.status) {
    case 'online':  return 'mk-dot-pulse'
    case 'error':   return 'mk-dot-shake'
    case 'pending': return 'mk-dot-breath'
    case 'offline': return ''
  }
})
</script>

<template>
  <span
    :class="['inline-block rounded-full align-middle', colorClass, animationClass]"
    :style="{ width: `${props.size}px`, height: `${props.size}px` }"
    :aria-label="`status: ${props.status}`"
  />
</template>

<style scoped>
.mk-dot-pulse {
  animation: mk-pulse-gentle 2.4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.mk-dot-breath {
  animation: mk-pulse-gentle 1.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.mk-dot-shake {
  animation: mk-shake-tiny 0.4s cubic-bezier(0.4, 0, 0.6, 1) 4s infinite;
}

@media (prefers-reduced-motion: reduce) {
  .mk-dot-pulse,
  .mk-dot-breath,
  .mk-dot-shake {
    animation: none;
  }
}
</style>
