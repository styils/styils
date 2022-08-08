import type { JSX, ComponentProps, Accessor } from 'solid-js'
import type { AnyObject, Widen } from './types'
import type { BaseVariants, CssStateKey } from './baseSystemTypes'
import { CSSAttribute } from 'nativeCssTypes'

export type UseSystem<Theme> = () => {
  mode: Accessor<string>
  setMode: (mode: string) => void
  theme: Accessor<Theme>
}

export type Provider = (props: { children: JSX.Element }) => JSX.Element

export type ExtractElement = Accessor<JSX.Element>[]

export type NativeComponent = keyof JSX.IntrinsicElements | ((...props: any[]) => JSX.Element)

type PropsWithRef<P> = 'ref' extends keyof P ? (P extends { ref?: infer R } ? R : P) : P

type StyledProps<
  As extends NativeComponent,
  Styles extends CSSAttribute = {},
  Variants extends BaseVariants = {}
> = Omit<ComponentProps<As>, 'ref'> & {
  ref?: PropsWithRef<ComponentProps<As>>
} & {
  as?: As extends StyledComponent<infer A, AnyObject, AnyObject> ? A : As
  variants?: {
    [key in keyof Variants]?: Widen<keyof Variants[key]>
  }
  cssState?: {
    [key in CssStateKey<Styles> | CssStateKey<Variants>]?: string | number
  }
}

type StyledComponent<
  Component extends NativeComponent,
  Styles extends CSSAttribute = {},
  Variants extends BaseVariants = {}
> = <As extends NativeComponent = Component>(
  props: StyledProps<As, Styles, Variants>
) => JSX.Element

export interface Styled<Theme> {
  <Component extends NativeComponent, Styles extends CSSAttribute, Variants extends BaseVariants>(
    component: Component | { tag: Component; namespace?: string },
    styles: Styles | ((props: Theme, mode: string) => Styles),
    interpolation?: Variants | ((props: Theme, mode: string) => Variants)
  ): StyledComponent<Component, Styles, Variants>
}
