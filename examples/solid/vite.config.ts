import { transformSync } from '@babel/core'
import { Options } from '@styils/babel-plugin'
import { PluginOption, defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

function parseId(id: string) {
  const index = id.indexOf('?')
  if (index < 0) return id
  return id.slice(0, index)
}

export default defineConfig({
  plugins: [
    {
      name: 'test',
      enforce: 'pre',
      async transform(code, id) {
        const filePath = parseId(id)

        if (!/node_modules/.test(filePath) && /(j|t)sx?$/.test(filePath)) {
          const filename = filePath.replace(process.cwd(), '')

          const fileResult = transformSync(code, {
            plugins: [
              [
                '@styils',
                {
                  importPaths: /theme$/
                } as Options
              ]
            ],
            filename
          })

          return fileResult || code
        }

        return code
      }
    } as PluginOption,
    solidPlugin()
  ],
  server: {
    port: 3000
  },
  build: {
    target: 'esnext'
  }
})
