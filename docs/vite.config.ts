import react from '@vitejs/plugin-react'
import ssr from 'vite-plugin-ssr/plugin'
import { UserConfig } from 'vite'
import path from 'path'

const config: UserConfig = {
  plugins: [react(), ssr({ prerender: true })],
  resolve: {
    alias: {
      'styls-react': path.join(__dirname, '..', 'src', 'indexReact'),
      system: path.join(__dirname, 'common', 'system')
    }
  }
}

export default config
