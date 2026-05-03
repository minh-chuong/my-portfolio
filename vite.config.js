import { defineConfig } from 'vite'

export default defineConfig({
  // Project gốc là HTML thuần, không dùng React plugin
  root: '.',
  build: {
    outDir: 'dist',
  },
})
