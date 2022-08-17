import { transformSync } from '@babel/core'
import { type Options, addSourceMaps } from '@styils/babel-plugin'
import { PluginOption } from 'vite'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

function parseId(id: string) {
  const index = id.indexOf('?')
  if (index < 0) return id
  return id.slice(0, index)
}

export default (options: Options = {}): PluginOption => {
  const cwd = process.cwd()
  return {
    name: '@styils/vite-plugin',
    enforce: 'pre',
    async transform(code, id) {
      const filePath = parseId(id)
      const filename = filePath.replace(cwd, '')

      if (!/node_modules/.test(filePath) && process.env.NODE_ENV !== 'production') {
        if (/(j|t)sx?$/.test(filePath)) {
          const fileResult = transformSync(code, {
            plugins: [[require.resolve('@styils/babel-plugin'), options]],
            filename
          })

          return fileResult.code || code
        }

        if (filePath.endsWith('.vue')) {
          const lines = code.split(/\r?\n/)

          let styledName = null
          let globalName = null
          lines.forEach((line, index) => {
            if (/from\s*("|').+/.test(line)) {
              const [fromValue] = line.match(/('|").+('|")/)
              const value = fromValue.replace(/('|")/g, '')
              let isStyils = null

              if (typeof options.importPaths === 'string' && options.importPaths === value) {
                isStyils = true
              } else if (
                options.importPaths &&
                options.importPaths.constructor === RegExp &&
                options.importPaths.test(value)
              ) {
                isStyils = true
              }

              if (isStyils) {
                if (
                  options.identifier &&
                  options.identifier.styled &&
                  RegExp(options.identifier.styled).test(line)
                ) {
                  styledName = options.identifier.styled
                } else if (/styled/.test(line)) {
                  styledName = 'styled'
                }

                if (
                  options.identifier &&
                  options.identifier.createGlobal &&
                  RegExp(options.identifier.createGlobal).test(line)
                ) {
                  globalName = options.identifier.createGlobal
                } else if (/createGlobal/.test(line)) {
                  globalName = 'createGlobal'
                }
              }
            }

            if (styledName && RegExp(`(const|var|let)\\s*.+\\s*=\\s*${styledName}\\(`).test(line)) {
              lines[index] = `${styledName}.sourceMap = "${addSourceMaps(
                { line: index + 1, column: 0 },
                {
                  sourceFileName: `${filename}?styils`,
                  code
                }
              )}";${line}`
            }

            if (globalName && RegExp(`${globalName}\\(`).test(line)) {
              lines[index] = `${globalName}.sourceMap = "${addSourceMaps(
                { line: index + 1, column: 0 },
                {
                  sourceFileName: `${filename}?styils`,
                  code
                }
              )}";${line}`
            }
          })

          return lines.join('\r\n')
        }
      }

      return code
    }
  }
}
