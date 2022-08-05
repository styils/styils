import type { JSX, ComponentProps } from 'solid-js'
import type { CSSAttribute } from 'nativeCssTypes'
import type { Widen } from './types'
import type { StyleCSSAttribute, StyleInterpolation } from './baseSystemTypes'

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
