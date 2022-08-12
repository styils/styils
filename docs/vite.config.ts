import { defineConfig } from 'vite'
import styils from '@styils/vite-plugin'
import path from 'path'
import react from '@vitejs/plugin-react'

console.log(styils)

// https://vitejs.dev/config/
export default defineConfig({
  base: '/styils/',
  plugins: [styils({ importPaths: /theme$/ }), react()],
  resolve: {
    alias: [
      { find: '@styils/react', replacement: path.join(__dirname, '..', 'src', 'indexReact.ts') },
      { find: /react-dom$/, replacement: 'react-dom/profiling' },
      { find: 'scheduler/tracing', replacement: 'scheduler/tracing-profiling' }
    ]
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
})
