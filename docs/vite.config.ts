import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/styil/',
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@styil/react', replacement: path.join(__dirname, '..', 'src', 'indexReact.ts') },
      { find: /react-dom$/, replacement: 'react-dom/profiling' },
      { find: 'scheduler/tracing', replacement: 'scheduler/tracing-profiling' }
    ]
  }
})
