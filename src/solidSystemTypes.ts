import type { JSX, ComponentProps, Accessor } from 'solid-js'
import type { AnyObject, Widen } from './types'
import { StyleInterpolation, Styles } from './baseSystemTypes'

export type UseSystem<Theme> = () => {
  mode: Accessor<string>
  setMode: (mode: string) => void
  theme: Accessor<Theme>
}

export type Provider = (props: { children: JSX.Element }) => JSX.Element

export type ExtractElement = Accessor<JSX.Element>[]

export type NativeComponent = keyof JSX.IntrinsicElements | ((...props: any[]) => JSX.Element)

type PropsWithRef<P> = 'ref' extends keyof P ? (P extends { ref?: infer R } ? R : P) : P

type StyledProps<As extends NativeComponent, Variants, Vars extends string> = Omit<
  ComponentProps<As>,
  'ref'
> & {
  ref?: PropsWithRef<ComponentProps<As>>
  as?: As extends StyledComponent<infer A, AnyObject, any> ? A : As
  variants?: {
    [key in keyof Variants]?: Widen<Variants[key]>
  }
  vars?: {
    [key in Vars]?: string | number
  }
}

type StyledComponent<Component extends NativeComponent, Variants, Vars extends string> = <
  As extends NativeComponent = Component
>(
  props: StyledProps<As, Variants, Vars>
) => JSX.Element

export interface Styled<Theme> {
  <
    Component extends NativeComponent,
    VariantsKey extends PropertyKey = '',
    VariantsValue extends PropertyKey = '',
    Vars extends string = ''
  >(
    component: Component | { tag: Component; namespace?: string },
    styles: Styles<Theme, Vars>,
    interpolation?: StyleInterpolation<Theme, VariantsKey, VariantsValue, Vars>
  ): StyledComponent<
    Component,
    { [key in VariantsKey as '' extends key ? never : key]: VariantsValue },
    Vars
  >
}
