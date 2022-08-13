import type { AnyObject, Widen } from './types'
import { StyleInterpolation, Styles } from './baseSystemTypes'
import { DefineComponent, VNode, VNodeRef } from 'vue'

export type UseSystem<Theme> = () => {
  mode: string
  setMode: (mode: string) => void
  theme: Theme
}

export type Provider = (props: { children: VNode }) => VNode

export type ExtractElement = VNode

export type NativeComponent = keyof JSX.IntrinsicElements | DefineComponent

type StyledProps<As extends NativeComponent, Variants, Vars extends string> = Omit<
  ComponentProps<As>,
  'ref'
> & {
  ref?: VNodeRef
} & {
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
) => VNode

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
