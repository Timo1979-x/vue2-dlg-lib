import { defineConfig } from 'vitest/config'
import vue2 from '@vitejs/plugin-vue2'

export default defineConfig({
  plugins: [vue2()],
  test: {
    environment: 'jsdom',
    include: ['packages/vue2-dlg-lib/src/**/*.test.js'],
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',
    },
  },
})
