import { type CSSAttribute } from 'nativeCssTypes'
import { AnyObject, type StyleSheetOptions } from './types'

export type BaseVariants = Record<string, Record<string, CSSAttribute>>

export type AnyFunc = (...props: any[]) => any

export interface Global<Theme> {
  (
    styles:
      | Record<string, CSSAttribute>
      | ((theme: Theme, mode: string) => Record<string, CSSAttribute>)
  ): void
}

export interface Keyframes {
  (styles: Record<string, CSSAttribute>): string
}

export interface SystemOptions<Theme> {
  theme?: (mode: string) => Theme
  defaultMode?: string
  sheetOptions?: Partial<StyleSheetOptions>
}

export interface BaseStyled {
  (...props: any[]): any
  sourceMap?: string
}

export interface SystemExtractElement {
  metaSelectorCacheId: string
  selectorCacheString: string
  globalStyleSSRId: string
  ssrGlobalData: string
  styleSSRId: string
  ssrData: string
  metaMode: string
}

export type BaseTag = unknown | { tag: unknown; namespace?: string }

export type TargetInfo = { namespaceJoiner: string; targetClassName: string }

export interface BaseSystem<
  Styled,
  Theme,
  Provider extends AnyFunc,
  ExtractElement extends AnyFunc
> {
  styled: Styled
  SystemProvider: ReturnType<Provider>
  global: Global<Theme>
  keyframes: Keyframes
  createExtracts: () => { extractHtml: string; extractElement: ReturnType<ExtractElement> }
  /**
   * @default 'all'
   */
  flush: (type?: 'all' | 'global') => void
}

export type OmitAnyPropertyKey<T = {}> = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [key in keyof T as T[key] extends `$${infer _}`
    ? key
    : T[key] extends AnyObject
    ? key
    : never]: T[key]
}

export type CssStateKey<T extends CSSAttribute | string | number> = T extends `$${infer R}`
  ? R
  : T extends Record<PropertyKey, string | number | CSSAttribute>
  ? CssStateKey<OmitAnyPropertyKey<T>[keyof OmitAnyPropertyKey<T>]>
  : never
