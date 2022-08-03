export interface Options {
  identifier?: {
    styled?: string
    global?: string
  }
  importPaths?: string | RegExp
  sourceFileName?: string
  sourceRoot?: string
}
