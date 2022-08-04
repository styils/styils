import { JSX, ComponentProps } from 'solid-js'
import { type CSSAttribute } from 'nativeCssTypes'
import { type Accessor } from 'solid-js/types/reactive/signal'
import { StyleSheetOptions, Widen } from './types'

export type StyleInterpolation<Theme, Variants> =
  | Variants
  | ((props: Theme, mode: string) => Variants)

export type StyleCSSAttribute<Theme> = CSSAttribute | ((props: Theme, mode: string) => CSSAttribute)

export type StyledComponent = keyof JSX.IntrinsicElements | ((...props: any[]) => JSX.Element)

type PropsWithRef<P> = 'ref' extends keyof P ? (P extends { ref?: infer R | undefined } ? R : P) : P

type StyledProps<As extends StyledComponent, Variants> = Omit<ComponentProps<As>, 'ref'> & {
  ref?: PropsWithRef<ComponentProps<As>>
} & {
  as?: As
  variants?: {
    [key in keyof Variants]?: Widen<keyof Variants[key]>
  }
}

export interface SystemOptions<Theme> {
  theme?: (mode: string) => Theme
  defaultMode?: string
  sheetOptions?: Partial<StyleSheetOptions>
}

export interface Styled<Theme> {
  <
    Component extends StyledComponent,
    Variants extends Record<string, Record<string, CSSAttribute>>
  >(
    component: Component | { tag: Component; namespace?: string },
    styles: StyleCSSAttribute<Theme>,
    interpolation?: StyleInterpolation<Theme, Variants>
  ): {
    <As extends StyledComponent = Component>(props: StyledProps<As, Variants>): JSX.Element
  }
}

export interface Global<Theme> {
  (styles: CSSAttribute | ((theme: Theme, mode: string) => CSSAttribute)): void
}

export interface Keyframes {
  (styles: Record<string, CSSAttribute>): string
}

export interface System<Theme> {
  styled: Styled<Theme>
  SystemProvider: (props: { children: JSX.Element }) => JSX.Element
  useSystem: () => {
    mode: Accessor<string>
    setMode: (value: string) => void
    theme: Theme
  }
  global: Global<Theme>
  keyframes: Keyframes
  createExtracts: () => { extractHtml: string; extractElement: Accessor<JSX.Element>[] }
  flush: () => void
}
