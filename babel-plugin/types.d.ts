export interface Options {
  identifier?: {
    styled?: string
    createGlobal?: string
  }
  importPaths?: string | RegExp
  sourceFileName?: string
  sourceRoot?: string
}

export function addSourceMaps(
  offset: {
    line: number
    column: number
  },
  state: {
    sourceFileName: string
    sourceRoot?: string
    code: string
  }
): string
