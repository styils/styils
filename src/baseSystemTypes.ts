import { type CSSAttribute } from 'nativeCssTypes'
import { type StyleSheetOptions } from './types'

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

export type NeverToObeject<T> = [T] extends [never] ? {} : T

export type StyleInterpolation<
  Theme,
  VariantsKey extends PropertyKey,
  VariantsValue extends PropertyKey,
  Var
> =
  | {
      [key in VariantsKey]: {
        [key in VariantsValue]: CSSAttribute<Var>
      }
    }
  | ((
      props: Theme,
      mode: string
    ) => {
      [key in VariantsKey]: {
        [key in VariantsValue]: CSSAttribute<Var>
      }
    })
