import { transformSync } from '@babel/core'
import type { Options } from '@styils/babel-plugin'
import { PluginOption } from 'vite'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

function parseId(id: string) {
  const index = id.indexOf('?')
  if (index < 0) return id
  return id.slice(0, index)
}

export default (options?: Options & { enforce?: 'pre' | 'post' }): PluginOption => {
  const cwd = process.cwd()
  return {
    name: '@styils/vite-plugin',
    enforce: options.enforce || 'pre',
    async transform(code, id) {
      const filePath = parseId(id)

      if (
        !/node_modules/.test(filePath) &&
        (/(j|t)sx?$/.test(filePath) || options.enforce === 'post'
          ? filePath.endsWith('.vue')
          : false) &&
        process.env.NODE_ENV !== 'production'
      ) {
        const filename = filePath.replace(cwd, '')
        const fileResult = transformSync(code, {
          plugins: [[require.resolve('@styils/babel-plugin'), options]],
          filename
        })

        return fileResult.code || code
      }

      return code
    }
  }
}
