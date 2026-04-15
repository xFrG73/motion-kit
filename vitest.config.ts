import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: false,
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/composables/**/*.ts'],
      exclude: ['src/composables/**/*.test.ts'],
    },
  },
})
