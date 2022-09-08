import type { CSSAttribute } from 'nativeCssTypes'
import type { AnyFunc, AnyObject, IfEqual, StyleSheetOptions } from './types'

/**
 * createGlobal input constraints
 */
export interface CreateGlobal<Theme> {
  (
    styles:
      | Record<string, CSSAttribute>
      | ((theme: Theme, mode: string) => Record<string, CSSAttribute>)
  ): void
}

/**
 * keyframes input constraints
 */
export interface Keyframes {
  (styles: Record<string, CSSAttribute>): string
}

/**
 * create system options
 */
export interface SystemOptions<Theme> {
  theme?: (mode: string) => Theme
  defaultMode?: string
  sheetOptions?: Partial<StyleSheetOptions>
}

/**
 * use of internal constraints
 */
export interface BaseStyled {
  (...props: any[]): any
  sourceMap?: string
  uniqueIdentifier?: string
}

/**
 * extract factory function parameter
 */
export interface SystemExtractElement {
  metaSelectorCacheId: string
  selectorCacheString: string
  globalStyleSSRId: string
  ssrGlobalData: string[]
  styleSSRId: string
  ssrData: string[]
  metaMode: string
  devIdent: string
}

/**
 * Internal constraints
 */
export type BaseTag = unknown | { tag: unknown; namespace?: string }

/**
 * Internal constraints
 */
export type TargetInfo = { namespaceJoiner: string; targetClassName: string }

/**
 * base system factory function
 */
export interface BaseSystem<
  Styled,
  Theme,
  Provider extends AnyFunc,
  ExtractElement extends AnyFunc
> {
  /**
   * create style component api
   */
  styled: Styled
  /**
   * system provider is required when using themes
   */
  SystemProvider: ReturnType<Provider>
  /**
   * create global rule
   */
  createGlobal: CreateGlobal<Theme>
  /**
   * create keyframes rule
   */
  keyframes: Keyframes
  /**
   * create ssr extracted css
   */
  createExtracts: () => { extractHtml: string; extractElement: ReturnType<ExtractElement> }
  /**
   * @default 'all'
   * you can choose to keep global styles without clearing
   */
  flush: (type?: 'all' | 'global') => void
}

/**
 * variant Constraints
 */
export type StyleInterpolation<Theme, Variants> =
  | {
      [key in keyof Variants]: {
        [value in keyof Variants[key]]: CSSAttribute
      }
    }
  | ((
      props: Theme,
      mode: string
    ) => {
      [key in keyof Variants]: {
        [value in keyof Variants[key]]: CSSAttribute
      }
    })

/**
 * looser input
 */
export type Widen<T> = T extends number
  ? `${T}` | T
  : T extends 'true' | 'false'
  ? boolean | T
  : T extends `${number}`
  ? number | T
  : T

/**
 * css input constraints
 */
export type Styles<Theme, Vars extends string> =
  | CSSAttribute<Vars>
  | ((props: Theme, mode: string) => CSSAttribute<Vars>)

/**
 * returns never if it is an empty object
 */
export type NeverObeject<T extends AnyObject> = IfEqual<T, {}> extends true ? never : T
