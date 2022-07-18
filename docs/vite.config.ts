import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/styil/',
  plugins: [react()],
  resolve: {
    alias: {
      '@styil/react': path.join(__dirname, '..', 'src', 'indexReact.ts')
    }
  },
  build: {
    minify: 'esbuild'
  }
})
