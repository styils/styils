import type { JSX, ComponentProps, Accessor } from 'solid-js'
import type { AnyObject, Widen } from './types'
import type {
  BaseVariants,
  StyleCSSAttribute,
  StyleInterpolation,
  CssStateKey
} from './baseSystemTypes'

export type UseSystem<Theme> = () => {
  mode: Accessor<string>
  setMode: (mode: string) => void
  theme: Accessor<Theme>
}

export type Provider = (props: { children: JSX.Element }) => JSX.Element

export type ExtractElement = Accessor<JSX.Element>[]

export type NativeComponent = keyof JSX.IntrinsicElements | ((...props: any[]) => JSX.Element)

type PropsWithRef<P> = 'ref' extends keyof P ? (P extends { ref?: infer R | undefined } ? R : P) : P

type StyledProps<As extends NativeComponent, Styles, Variants> = Omit<ComponentProps<As>, 'ref'> & {
  ref?: PropsWithRef<ComponentProps<As>>
} & {
  as?: As extends StyledComponent<infer A, AnyObject, AnyObject> ? A : As
  variants?: {
    [key in keyof Variants]?: Widen<keyof Variants[key]>
  }
  cssState?: {
    // @ts-expect-error hack
    [key in CssStateKey<Styles[keyof Styles]> | CssStateKey<Variants[keyof Variants]>]?:
      | string
      | number
  }
}

type StyledComponent<Component extends NativeComponent, Styles, Variants> = <
  As extends NativeComponent = Component
>(
  props: StyledProps<As, Styles, Variants>
) => JSX.Element

export interface Styled<Theme> {
  <
    Component extends NativeComponent,
    Styles extends StyleCSSAttribute<Theme>,
    Variants extends BaseVariants
  >(
    component: Component | { tag: Component; namespace?: string },
    styles: Styles | ((props: Theme, mode: string) => Styles),
    interpolation?: StyleInterpolation<Theme, Variants>
  ): StyledComponent<Component, Styles, Variants>
}
