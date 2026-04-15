<!-- packages/motion-kit/src/primitives/MotionNumber.vue -->
<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useCountUp } from '../composables/useCountUp'
import { duration as tokens } from '../tokens'

type Format = 'integer' | 'decimal' | 'percent' | 'bytes' | 'duration'

interface Props {
  value: number
  format?: Format
  /** ms — defaults to tokens.base */
  durationMs?: number
  /** Number of decimals (decimal/percent formats). Default 0 for integer, 1 for decimal, 0 for percent. */
  decimals?: number
}

const props = withDefaults(defineProps<Props>(), {
  format: 'integer',
  durationMs: tokens.base,
})

const valueRef = toRef(props, 'value')
const { display } = useCountUp(valueRef, {
  duration: props.durationMs,
  integer: props.format === 'integer',
})

const formatted = computed(() => {
  const v = display.value
  switch (props.format) {
    case 'integer':
      return Math.round(v).toLocaleString()
    case 'decimal':
      return v.toFixed(props.decimals ?? 1)
    case 'percent': {
      const decimals = props.decimals ?? 0
      const formatted = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString()
      return `${formatted}%`
    }
    case 'bytes':
      return formatBytes(v)
    case 'duration':
      return formatDuration(v)
  }
})

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${Math.round(bytes)} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`
  return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
}
</script>

<template>
  <span class="tabular-nums" data-mono>{{ formatted }}</span>
</template>

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
