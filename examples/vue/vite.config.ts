import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import styils from '@styils/vite-plugin'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), styils({ importPaths: /theme/ })],
  resolve: {
    alias: [
      { find: '@styils/vue', replacement: path.join(__dirname, '..', '..', 'src', 'indexVue.ts') }
    ]
  }
})
