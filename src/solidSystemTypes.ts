import type { JSX, ComponentProps, Accessor } from 'solid-js'
import type { CSSAttribute } from 'nativeCssTypes'
import type { AnyObject, Widen } from './types'
import type { StyleCSSAttribute, StyleInterpolation } from './baseSystemTypes'

export type UseSystem<Theme> = () => {
  mode: Accessor<string>
  setMode: (mode: string) => void
  theme: Accessor<Theme>
}

export type Provider = (props: { children: JSX.Element }) => JSX.Element

export type ExtractElement = Accessor<JSX.Element>[]

export type NativeComponent = keyof JSX.IntrinsicElements | ((...props: any[]) => JSX.Element)

type PropsWithRef<P> = 'ref' extends keyof P ? (P extends { ref?: infer R | undefined } ? R : P) : P

type StyledProps<As extends NativeComponent, Variants> = Omit<ComponentProps<As>, 'ref'> & {
  ref?: PropsWithRef<ComponentProps<As>>
} & {
  as?: As extends StyledComponent<infer A, AnyObject> ? A : As
  variants?: {
    [key in keyof Variants]?: Widen<keyof Variants[key]>
  }
}

type StyledComponent<Component extends NativeComponent, Variants> = <
  As extends NativeComponent = Component
>(
  props: StyledProps<As, Variants>
) => JSX.Element

export interface Styled<Theme> {
  <
    Component extends NativeComponent,
    Variants extends Record<string, Record<string, CSSAttribute>>
  >(
    component: Component | { tag: Component; namespace?: string },
    styles: StyleCSSAttribute<Theme>,
    interpolation?: StyleInterpolation<Theme, Variants>
  ): StyledComponent<Component, Variants>
}
