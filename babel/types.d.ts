export interface Options {
  identifier?: {
    styled?: string
    createGlobal?: string
  }
  importPaths?: string | RegExp
  sourceFileName?: string
  sourceRoot?: string
}
