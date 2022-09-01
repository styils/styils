import { type NodePath, type PluginPass } from '@babel/core'
import { declare } from '@babel/helper-plugin-utils'
import { SourceMapGenerator } from 'source-map'
import convert from 'convert-source-map'
import { extname } from 'path'
import type { Options } from '../types'

export interface State extends PluginPass {
  opts: Options
}

export function addSourceMaps(
  offset: {
    line: number
    column: number
  },
  state: {
    sourceFileName: string
    sourceRoot: string
    code: string
  }
) {
  const { code } = state

  const generator = new SourceMapGenerator({
    file: state.sourceFileName,
    sourceRoot: state.sourceRoot
  })

  generator.setSourceContent(state.sourceFileName, code)

  generator.addMapping({
    generated: {
      line: 1,
      column: 0
    },
    source: state.sourceFileName,
    original: offset
  })
  return convert.fromObject(generator).toComment({ multiline: true })
}

const sourceMapProperty = 'sourceMap'

export default declare((api) => {
  const { types: t } = api
  api.assertVersion(7)
  let readyImport = false

  return {
    name: '@styils/babel-plugin',
    manipulateOptions(_, parserOpts) {
      const { plugins } = parserOpts as { plugins: any[] }

      plugins.forEach((plugin, index) => {
        if (plugin === 'jsx') plugins.splice(index, 1)
      })

      plugins.forEach((plugin, index) => {
        const name = Array.isArray(plugin) ? plugin[0] : plugin
        if (name === 'flow') plugins.splice(index, 1)
      })

      plugins.push('jsx', 'typescript', 'classProperties')
    },
    visitor: {
      Program: {
        enter(_, state: State) {
          if (!state.opts.importPaths) {
            state.opts.importPaths = /@styils\/(react|solid)/
          }

          state.opts.identifier = {
            styled: 'styled',
            createGlobal: 'createGlobal',
            ...(state.opts.identifier ?? {})
          }
        }
      },
      ImportDeclaration(path, state: State) {
        const { importPaths } = state.opts
        if (importPaths) {
          const isImport =
            typeof importPaths === 'string'
              ? importPaths === path.node.source.value
              : importPaths.test(path.node.source.value)

          const ext = extname(path.node.source.value)

          if (ext !== '.js' && ext !== '.ts' && ext && isImport) {
            console.log(`styils-plugin wrong match: ${path.node.source.value}`)
          }

          if (isImport) {
            readyImport = path.node.specifiers.some((childNode) => {
              return state.opts.identifier![childNode.local.name]
            })
          }
        }
      },
      CallExpression(path, state: State) {
        const sourceFileName =
          state.file.opts.filename ?? state.file.opts.sourceFileName ?? state.opts.sourceFileName
        const sourceRoot = state.file.opts.sourceRoot ?? state.opts.sourceRoot ?? ''

        if (!sourceFileName) {
          throw new Error('To compile using api, you need to pass in `sourceFileName`')
        }

        if (
          readyImport &&
          t.isIdentifier(path.node.callee) &&
          state.opts.identifier &&
          state.opts.identifier[path.node.callee.name] &&
          path.node.loc
        ) {
          let parent: NodePath | null = null

          if (path.node.callee.name === state.opts.identifier.styled) {
            parent = path.findParent((parent) => parent.isVariableDeclaration())
          } else if (path.node.callee.name === state.opts.identifier.createGlobal) {
            parent = path.findParent((parent) => parent.isExpressionStatement())
          }

          if (parent) {
            const sourceMapNode = t.logicalExpression(
              '&&',
              t.binaryExpression(
                '!==',
                t.memberExpression(
                  t.memberExpression(t.identifier('process'), t.identifier('env')),
                  t.identifier('NODE_ENV')
                ),
                t.stringLiteral('production')
              ),
              t.assignmentExpression(
                '=',
                t.memberExpression(
                  t.identifier(path.node.callee.name),
                  t.identifier(sourceMapProperty)
                ),
                t.stringLiteral(
                  addSourceMaps(path.node.loc.start, {
                    sourceFileName,
                    sourceRoot,
                    code: state.file.code
                  })
                )
              )
            )

            parent.insertBefore(sourceMapNode)
          }
        }
      }
    }
  }
})
