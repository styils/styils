import { SourceMapGenerator } from 'source-map'
import convert from 'convert-source-map'

export default function addSourceMaps(
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
