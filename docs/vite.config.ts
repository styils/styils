import { defineConfig, PluginOption } from 'vite'
import { transformSync } from '@babel/core'
import { Options } from '@styils/babel-plugin'
import path from 'path'

import react from '@vitejs/plugin-react'

function parseId(id: string) {
  const index = id.indexOf('?')
  if (index < 0) return id
  return id.slice(0, index)
}

// https://vitejs.dev/config/
export default defineConfig({
  base: '/styil/',
  plugins: [
    {
      name: 'test',
      enforce: 'pre',
      async transform(code, id) {
        const filePath = parseId(id)

        if (!/node_modules/.test(filePath) && /(j|t)sx?$/.test(filePath)) {
          const filename = filePath.replace(path.join(process.cwd(), 'src'), '')
          const fileResult = transformSync(code, {
            plugins: [
              [
                '@styils',
                {
                  importPaths: ['../theme', './theme'],
                  sourceFileName: filename
                } as Options
              ]
            ]
          })

          return fileResult || code
        }

        return code
      }
    } as PluginOption,
    react()
  ],
  resolve: {
    alias: [
      { find: '@styil/react', replacement: path.join(__dirname, '..', 'src', 'indexReact.ts') },
      { find: /react-dom$/, replacement: 'react-dom/profiling' },
      { find: 'scheduler/tracing', replacement: 'scheduler/tracing-profiling' }
    ]
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
})
